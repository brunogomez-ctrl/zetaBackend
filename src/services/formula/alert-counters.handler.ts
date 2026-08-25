import { and, eq, sql } from 'drizzle-orm';
import { db } from '../../db';
import { alert } from '../../db/schema/alert';
import { surveyResponse } from '../../db/schema/survey-response';
import { buildAlertWhere } from '../../repositories/alert-filter.builder';
import { FilterCommand } from '../../models/filter.model';
import { FormulaHandler, FormulaResult } from './formula-handler.interface';

// alertType siempre se agrega al GROUP BY, esté o no en el groupBy pedido — igual que el Java
// (AlertCountersFormulaHandler.getFormulaValuesStream: newFilter.setGroupBy(groupBy + ",alertType")).
//
// Simplificación deliberada respecto al Java: no replicamos el split por finalized_at
// (formula.alert-counters.splitEnabled) — es una optimización de performance, no cambia
// el resultado final (sumar particiones de fecha da lo mismo que sumarlo todo junto).
//
// Alcance de este piloto: soporta groupBy='alertStatus' (el caso validado contra producción)
// o sin groupBy (un solo grupo total). geoLocation/logicalLocation como groupBy de esta
// fórmula no se implementó todavía — no hay evidencia real con la que validarlo.
export class AlertCountersHandler implements FormulaHandler {
  async compute(_questionIds: number[], cmd: FilterCommand): Promise<FormulaResult[]> {
    const outerGroupExpr = cmd.groupBy === 'alertStatus' ? alert.alertStatus : sql`'all'`;

    const rows = await db
      .select({
        outerGroup: outerGroupExpr,
        alertType: alert.alertType,
        count: sql<number>`COUNT(*)`,
      })
      .from(alert)
      .innerJoin(surveyResponse, eq(alert.surveyResponseId, surveyResponse.id))
      .where(buildAlertWhere(cmd))
      .groupBy(outerGroupExpr, alert.alertType);

    const byOuterGroup = new Map<string, { total: number; positive: number; negative: number }>();

    for (const r of rows) {
      const key = String(r.outerGroup ?? 'all');
      const bucket = byOuterGroup.get(key) ?? { total: 0, positive: 0, negative: 0 };
      const count = Number(r.count);
      bucket.total += count;
      if (r.alertType === 'WOW') {
        bucket.positive += count;
      } else {
        bucket.negative += count;
      }
      byOuterGroup.set(key, bucket);
    }

    return Array.from(byOuterGroup.entries()).map(([group, b]) => ({
      group,
      groupId: group,
      count: b.total,
      value: b.total,
      totalCount: b.total,
      positiveCount: b.positive,
      negativeCount: b.negative,
      positivePercentage: b.total > 0 ? round((b.positive / b.total) * 100, 0) : 0,
      negativePercentage: b.total > 0 ? round((b.negative / b.total) * 100, 0) : 0,
    }));
  }
}

function round(n: number, precision: number): number {
  const factor = Math.pow(10, precision);
  return Math.round(n * factor) / factor;
}
