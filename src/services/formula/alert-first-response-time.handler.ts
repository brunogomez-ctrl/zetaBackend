import { eq, sql } from 'drizzle-orm';
import { db } from '../../db';
import { alert } from '../../db/schema/alert';
import { surveyResponse } from '../../db/schema/survey-response';
import { buildAlertWhere } from '../../repositories/alert-filter.builder';
import { FilterCommand } from '../../models/filter.model';
import { FormulaHandler, FormulaResult } from './formula-handler.interface';

const FAST_MAX_HOURS = 36; // fast: delay <= 36h — default real del Java (formula.alert-first-response-time.fast)
const SLOW_MIN_HOURS = 37; // slow: delay >= 37h

// Igual dominio que alertCounters: tabla alert, JOIN survey_response para geo/lógica,
// fecha por alert.created_at. No necesita question_response ni indicator_question.
//
// firstUpdateDelayHours (Java: @Formula diff_hours(created_at, first_updated_at)) se
// replica con TIMESTAMPDIFF(HOUR, ...). Alertas sin first_updated_at (NULL) no cuentan
// en fast ni en slow — la comparación con NULL en SQL da NULL/false, igual que en Java.
//
// No validado todavía contra una respuesta real de producción (a diferencia de
// alertCounters y surveyResponseCounters) — los nombres de campo (fastCount, slowCount,
// fastPerc, slowPerc) sí están confirmados del código fuente, pero la forma exacta del
// JSON de salida es la mejor interpretación, no una comparación 1 a 1 contra el sistema real.
export class AlertFirstResponseTimeHandler implements FormulaHandler {
  async compute(_questionIds: number[], cmd: FilterCommand): Promise<FormulaResult[]> {
    const delayHoursExpr = sql`TIMESTAMPDIFF(HOUR, ${alert.createdAt}, ${alert.firstUpdatedAt})`;

    const [row] = await db
      .select({
        fastCount: sql<number>`SUM(CASE WHEN ${alert.firstUpdatedAt} IS NOT NULL AND ${delayHoursExpr} <= ${FAST_MAX_HOURS} THEN 1 ELSE 0 END)`,
        slowCount: sql<number>`SUM(CASE WHEN ${alert.firstUpdatedAt} IS NOT NULL AND ${delayHoursExpr} >= ${SLOW_MIN_HOURS} THEN 1 ELSE 0 END)`,
      })
      .from(alert)
      .innerJoin(surveyResponse, eq(alert.surveyResponseId, surveyResponse.id))
      .where(buildAlertWhere(cmd));

    const fastCount = Number(row?.fastCount ?? 0);
    const slowCount = Number(row?.slowCount ?? 0);
    const total = fastCount + slowCount;

    return [{
      group: 'all',
      groupId: 'all',
      count: total,
      value: total,
      fastCount,
      slowCount,
      fastPerc: total > 0 ? Math.round((fastCount / total) * 100) : 0,
      slowPerc: total > 0 ? Math.round((slowCount / total) * 100) : 0,
    }];
  }
}
