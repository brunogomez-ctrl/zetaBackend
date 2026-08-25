import { sql } from 'drizzle-orm';
import { db } from '../../db';
import { surveyResponse } from '../../db/schema/survey-response';
import { buildWhere } from '../../repositories/filter-predicate.builder';
import { FilterCommand } from '../../models/filter.model';
import { FormulaHandler, FormulaResult } from './formula-handler.interface';

// A diferencia de wavg/nps/comments, esta fórmula NO pasa por question_response —
// cuenta encuestas completas (survey_response) por status. No necesita preguntas
// asociadas al indicador, por eso ignora 'questionIds' por completo.
export class SurveyResponseCountersHandler implements FormulaHandler {
  async compute(_questionIds: number[], cmd: FilterCommand): Promise<FormulaResult[]> {
    const rows = await db
      .select({
        status: surveyResponse.status,
        count: sql<number>`COUNT(*)`,
      })
      .from(surveyResponse)
      .where(buildWhere(cmd))
      .groupBy(surveyResponse.status);

    const byStatus: Record<string, number> = {};
    for (const r of rows) {
      if (r.status) byStatus[r.status.toLowerCase()] = Number(r.count);
    }

    const answeredCount = byStatus['answered'] ?? 0;
    const notHandledCount = byStatus['not_handled'] ?? 0;
    // Java junta IN_PROGRESS e INCOMPLETE en el mismo contador (inProgressCount).
    const inProgressCount = (byStatus['in_progress'] ?? 0) + (byStatus['incomplete'] ?? 0);
    const invalidCount = byStatus['invalid'] ?? 0;
    const closedCount = byStatus['closed'] ?? 0;
    const fakeCount = byStatus['fake'] ?? 0;
    const externalSourceCount = byStatus['external_source'] ?? 0;

    // count NO incluye fake ni external_source — igual que Java (SurveyResponseCounters.getCount()).
    const count = answeredCount + closedCount + inProgressCount + invalidCount + notHandledCount;
    // notAnsweredCount tampoco incluye invalidCount — así lo define el Java, aunque parezca raro.
    const notAnsweredCount = closedCount + inProgressCount + notHandledCount;

    const answeredDenom = answeredCount + notAnsweredCount;

    return [{
      group: 'all',
      groupId: 'all',
      count,
      value: count, // no hay un "value" numérico natural para esta fórmula; se deja igual a count
      answeredCount,
      notHandledCount,
      inProgressCount,
      invalidCount,
      closedCount,
      fakeCount,
      externalSourceCount,
      notAnsweredCount,
      answeredPerc: answeredDenom > 0 ? round((answeredCount / answeredDenom) * 100, 2) : 0,
      handledPerc: answeredDenom > 0 ? round(((answeredCount + inProgressCount) / answeredDenom) * 100, 2) : 0,
      invalidPerc: count > 0 ? round((invalidCount / count) * 100, 2) : 0,
      validPerc: count > 0 ? Math.round(((count - invalidCount) / count) * 100) : 0,
    }];
  }
}

function round(n: number, precision: number): number {
  const factor = Math.pow(10, precision);
  return Math.round(n * factor) / factor;
}
