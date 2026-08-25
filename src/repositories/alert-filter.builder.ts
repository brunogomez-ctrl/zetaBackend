import { and, gte, lt, or, SQL } from 'drizzle-orm';
import { alert } from '../db/schema/alert';
import { surveyResponse } from '../db/schema/survey-response';
import { FilterCommand } from '../models/filter.model';

// Dominio 'alert' — distinto de question_response/survey_response:
// - la fecha se filtra por alert.created_at (NO survey_response.answered_at — así lo
//   hace el Java real, con un comentario explícito de que son "prácticamente iguales"
//   y se ahorran un join extra solo para la fecha).
// - geo/lógica SÍ necesitan JOIN a survey_response, porque alert no trae sus propios códigos.
export function buildAlertWhere(cmd: FilterCommand): SQL {
  const conditions: SQL[] = [
    gte(alert.createdAt, cmd.dateFrom.toISOString().slice(0, 19).replace('T', ' ')),
    lt(alert.createdAt, cmd.dateTo.toISOString().slice(0, 19).replace('T', ' ')),
  ];

  if (cmd.geoLocationRanges.length) {
    conditions.push(
      or(...cmd.geoLocationRanges.map(r =>
        and(
          gte(surveyResponse.geoLocationCode, r.from),
          lt(surveyResponse.geoLocationCode, r.to),
        )
      ))!
    );
  }

  if (cmd.logicalLocationRanges.length) {
    conditions.push(
      or(...cmd.logicalLocationRanges.map(r =>
        and(
          gte(surveyResponse.logicalLocationCode, r.from),
          lt(surveyResponse.logicalLocationCode, r.to),
        )
      ))!
    );
  }

  return and(...conditions)!;
}
