import { and, desc, eq, inArray, isNotNull, sql } from 'drizzle-orm';
import { db } from '../../db';
import { questionResponse } from '../../db/schema/question-response';
import { surveyResponse } from '../../db/schema/survey-response';
import { buildWhere } from '../../repositories/filter-predicate.builder';
import { FilterCommand } from '../../models/filter.model';
import { FormulaHandler, FormulaResult } from './formula-handler.interface';

const MAX_COMMENTS = 100; // yml: formula.sentiment-comments.agentCommentsLimit (default 100)

// Igual que 'comments', pero además expone 'type' (number_answer) y 'score' (decimal_answer)
// — clasificación/puntaje de sentimiento que se guardó junto con la respuesta.
// El Java permite filtrar por un rango de number_answer (numberAnswerFrom/To) vía
// formula.sentiment-comments.configs, pero ese yml no trae esa sección, así que
// por default NO hay filtro de rango — se replica ese default (sin filtro) aquí.
export class SentimentCommentsHandler implements FormulaHandler {
  async compute(questionIds: number[], cmd: FilterCommand): Promise<FormulaResult[]> {
    if (questionIds.length === 0) return [{ group: 'all', groupId: 'all', count: 0, value: 0, comments: [] }];

    const rows = await db
      .select({
        comment: questionResponse.commentAnswer,
        createdAt: questionResponse.createdAt,
        surveyResponseId: questionResponse.surveyResponseId,
        type: questionResponse.numberAnswer,
        score: questionResponse.decimalAnswer,
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
      value: 0,
      comments: rows.map(r => ({
        comment: r.comment ?? '',
        createdAt: r.createdAt ?? '',
        surveyResponseId: r.surveyResponseId ?? 0,
        type: r.type,
        score: r.score != null ? Number(r.score) : null,
      })),
    }];
  }
}
