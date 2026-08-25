import { and, gte, lt, or, SQL } from 'drizzle-orm';
import { surveyResponse } from '../db/schema/survey-response';
import { FilterCommand } from '../models/filter.model';

// OJO: geoLocationCode / logicalLocationCode / la fecha por default (answeredAt) viven
// en survey_response, NO en question_response. El caller debe hacer JOIN question_response
// -> survey_response (por surveyResponseId) antes de aplicar este WHERE.
//
// Rango semi-abierto [from, to) — igual que FilterPredicateBuilder.addIncludeRangesFilter en Java.
// NO usar between(), que es inclusivo en ambos extremos y puede colar un registro de más
// cuyo código coincide exactamente con el 'to' precalculado.
export function buildWhere(cmd: FilterCommand): SQL {
  const conditions: SQL[] = [
    gte(surveyResponse.answeredAt, cmd.dateFrom.toISOString().slice(0, 19).replace('T', ' ')),
    lt(surveyResponse.answeredAt, cmd.dateTo.toISOString().slice(0, 19).replace('T', ' ')),
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
