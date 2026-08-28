import { and, eq, inArray, sql, type AnyColumn } from 'drizzle-orm';
import { db } from '../../db';
import { questionResponse } from '../../db/schema/question-response';
import { surveyResponse } from '../../db/schema/survey-response';
import { buildWhere } from '../../repositories/filter-predicate.builder';
import { FormulaHandler, FormulaResult } from './formula-handler.interface';

// Java: GroupCountFormulaHandler (base de count-number/count-text). Agrupa SOLO por el
// valor crudo de la respuesta (number_answer o text_answer), sin necesidad de que el
// request mande groupBy — es un agrupamiento implícito, distinto a todo lo demás que
// hemos construido hasta ahora.
//
// value = % del total de esa respuesta específica sobre el total general, redondeado a
// entero (0 decimales) — confirmado con datos reales de producción (oxxo-retail,
// indicador oxxo_retail_rest_contrar_prod): 5 grupos, cada value = round(count/total*100).
//
// Alcance de este piloto:
// - NO resuelve etiqueta legible (Java: question.getAnswerFormatedUi()) — regresa el
//   valor crudo tal cual, aunque el request mande groupNameFormat: 'description'.
// - NO soporta un groupBy externo adicional (ej. 'geoLocation,valor') — solo el caso
//   simple validado contra el ejemplo real.
export function createGroupCountHandler(answerColumn: AnyColumn): FormulaHandler {
  return {
    async compute(questionIds, cmd): Promise<FormulaResult[]> {
      if (questionIds.length === 0) return [];

      const rows = await db
        .select({
          answer: answerColumn,
          count: sql<number>`COUNT(*)`,
        })
        .from(questionResponse)
        .innerJoin(surveyResponse, eq(questionResponse.surveyResponseId, surveyResponse.id))
        .where(and(buildWhere(cmd), inArray(questionResponse.questionId, questionIds)))
        .groupBy(answerColumn);

      const total = rows.reduce((sum, r) => sum + Number(r.count), 0);

      return rows.map(r => {
        const count = Number(r.count);
        const value = total > 0 ? Math.round((count / total) * 100) : 0;
        const label = String(r.answer);
        return { group: label, groupId: label, count, value };
      });
    },
  };
}
