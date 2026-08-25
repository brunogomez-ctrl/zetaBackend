import { and, desc, eq, inArray, isNotNull, sql } from 'drizzle-orm';
import { db } from '../../db';
import { questionResponse } from '../../db/schema/question-response';
import { surveyResponse } from '../../db/schema/survey-response';
import { buildWhere } from '../../repositories/filter-predicate.builder';
import { FilterCommand } from '../../models/filter.model';
import { FormulaHandler, FormulaResult } from './formula-handler.interface';

const MAX_COMMENTS = 5; // igual que last(commentAnswer, 5) en el Java

// A diferencia de wavg/nps, esto NO es un agregado: trae los últimos N comentarios
// que caen dentro del filtro (fecha + geo + lógica), ordenados por más reciente.
// Simplificación respecto al Java: no se respeta groupBy (no se parte "los últimos 5 por grupo",
// se regresan los últimos 5 del total filtrado) — suficiente para el piloto, se puede extender
// después con una window function (ROW_NUMBER() PARTITION BY grupo) si hace falta por grupo.
export class CommentsFormulaHandler implements FormulaHandler {
  async compute(questionIds: number[], cmd: FilterCommand): Promise<FormulaResult[]> {
    if (questionIds.length === 0) return [{ group: 'all', groupId: 'all', count: 0, value: 0, comments: [] }];

    const rows = await db
      .select({
        comment: questionResponse.commentAnswer,
        createdAt: questionResponse.createdAt,
        surveyResponseId: questionResponse.surveyResponseId,
      })
      .from(questionResponse)
      .innerJoin(surveyResponse, eq(questionResponse.surveyResponseId, surveyResponse.id))
      .where(and(
        buildWhere(cmd),
        inArray(questionResponse.questionId, questionIds),
        isNotNull(questionResponse.commentAnswer),
        sql`${questionResponse.commentAnswer} <> ''`,
      ))
      .orderBy(desc(questionResponse.createdAt))
      .limit(MAX_COMMENTS);

    return [{
      group: 'all',
      groupId: 'all',
      count: rows.length,
      value: 0, // no aplica para esta fórmula, se deja en 0 por consistencia de tipo
      comments: rows.map(r => ({
        comment: r.comment ?? '',
        createdAt: r.createdAt ?? '',
        surveyResponseId: r.surveyResponseId ?? 0,
      })),
    }];
  }
}
