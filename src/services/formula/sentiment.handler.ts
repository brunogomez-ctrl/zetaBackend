import { and, desc, eq, inArray, isNotNull, isNull, sql } from 'drizzle-orm';
import { db } from '../../db';
import { questionResponse } from '../../db/schema/question-response';
import { surveyResponse } from '../../db/schema/survey-response';
import { criticalMoment } from '../../db/schema/critical-moment';
import { buildWhere } from '../../repositories/filter-predicate.builder';
import { FilterCommand } from '../../models/filter.model';
import { FormulaHandler, FormulaResult, SentimentTagResult } from './formula-handler.interface';

const DEFAULT_BOTTOM_SIZE = 5; // Java: SentimentHandler.getBottomSize(), default 5
// Hardcoded en el Java real (SentimentCommentsProvider.getComments) — no viene de indicator_question.
const COMMENT_QUESTION_ID = 999;

// El groupBy real llega como string compuesto: "criticalMoment,tag" — el primer término
// es el nivel 1, 'tag' (siempre el último) ya está implícito en esta fórmula.
function getLevel1Dimension(groupBy?: string): string {
  return (groupBy ?? '').split(',')[0]?.trim() ?? '';
}

// Alcance de este piloto: replica resultType='bottom' (el único que usa el widget de
// Ishikawa) con agrupamiento de 2 niveles (nivel 1 configurable + 'tag' siempre).
// NO implementa: categorías de sentimiento (sentiment_category), rankings top/attributes,
// ni el flag omoikane — quedan pendientes si algún día se necesitan.
export class SentimentHandler implements FormulaHandler {
  async compute(questionIds: number[], cmd: FilterCommand): Promise<FormulaResult[]> {
    if (questionIds.length === 0) return [];

    const level1Dimension = getLevel1Dimension(cmd.groupBy);
    const isCriticalMoment = level1Dimension === 'criticalMoment';

    // critical_moment también usa materialized path (search_code_from/to), igual que
    // geo/lógica — no se agrupa por critical_moment_id literal, se agrupa por el código
    // truncado (SUBSTRING), confirmado contra la respuesta real de producción (groupId
    // regresaba el código truncado "001", no el id que se mandó en criticalMomentInclude).
    const level1Column = isCriticalMoment
      ? surveyResponse.criticalMomentCode
      : level1Dimension === 'logicalLocation'
        ? surveyResponse.logicalLocationCode
        : surveyResponse.geoLocationCode;

    // Para criticalMoment el largo se calcula solo (Java: max(largo del filtro) + NODE_CODE_LENGTH).
    // Para geo/lógica se sigue respetando el groupByLevel explícito que ya ten\u00edamos.
    const codeLength = isCriticalMoment ? cmd.criticalMomentGroupCodeLength : cmd.groupCodeLength;

    const level1Expr = codeLength
      ? sql`SUBSTRING(${level1Column}, 1, ${codeLength})`
      : level1Column;

    const whereClause = and(
      buildWhere(cmd),
      inArray(questionResponse.questionId, questionIds),
      isNotNull(questionResponse.textAnswer),
    );

    // DEBUG TEMPORAL — quitar después de diagnosticar
    // console.log('DEBUG criticalMomentRanges:', JSON.stringify(cmd.criticalMomentRanges));
    // console.log('DEBUG codeLength:', codeLength);
    // console.log('DEBUG SQL:', whereClause?.toSQL?.() ?? whereClause);

    const rows = await db
      .select({
        level1: level1Expr,
        tag: questionResponse.textAnswer,
        count: sql<number>`COUNT(*)`,
        positive: sql<number>`SUM(CASE WHEN ${questionResponse.numberAnswer} = 1 THEN 1 ELSE 0 END)`,
        negative: sql<number>`SUM(CASE WHEN ${questionResponse.numberAnswer} = -1 THEN 1 ELSE 0 END)`,
        neutral: sql<number>`SUM(CASE WHEN ${questionResponse.numberAnswer} = 0 THEN 1 ELSE 0 END)`,
      })
      .from(questionResponse)
      .innerJoin(surveyResponse, eq(questionResponse.surveyResponseId, surveyResponse.id))
      .where(whereClause)
      .groupBy(level1Expr, questionResponse.textAnswer);

    // Agrupa en memoria por nivel 1 (así podemos rankear "bottom N" tags DENTRO de cada grupo).
    const byLevel1 = new Map<string, typeof rows>();
    for (const r of rows) {
      const key = String(r.level1 ?? 'sin_grupo');
      if (!byLevel1.has(key)) byLevel1.set(key, []);
      byLevel1.get(key)!.push(r);
    }

    // Resuelve nombre legible: busca qué critical_moment tiene ESTE código truncado como
    // su propio search_code_from (así se ve en producción real: código "001" -> "TODOS").
    const level1Names = new Map<string, string>();
    if (isCriticalMoment) {
      const codes = Array.from(byLevel1.keys()).filter(k => k !== 'sin_grupo');
      if (codes.length > 0) {
        const cms = await db.select({ code: criticalMoment.searchCodeFrom, name: criticalMoment.name })
          .from(criticalMoment)
          .where(inArray(criticalMoment.searchCodeFrom, codes));
        for (const cm of cms) {
          if (cm.code) level1Names.set(cm.code, cm.name ?? cm.code);
        }
      }
    }

    const results: FormulaResult[] = [];

    for (const [level1Key, tagRows] of byLevel1.entries()) {
      // "bottom": ordena por negative desc (los tags con más quejas primero) — igual que
      // compareWithNegativeDesc en el Java — y se queda con los primeros N.
      const sorted = tagRows
        .map(r => ({
          group: String(r.tag),
          groupId: String(r.tag),
          count: Number(r.count),
          positive: Number(r.positive),
          negative: Number(r.negative),
          neutral: Number(r.neutral),
        }))
        .sort((a, b) => b.negative - a.negative)
        .slice(0, DEFAULT_BOTTOM_SIZE);

      const tagsWithComments: SentimentTagResult[] = [];
      for (const t of sorted) {
        const comment = await getGroupComment(cmd, level1Column, codeLength, level1Key, t.group);
        tagsWithComments.push({ ...t, comments: comment ? [comment] : [] });
      }

      results.push({
        group: level1Names.get(level1Key) ?? level1Key,
        groupId: level1Key,
        count: sorted.reduce((s, t) => s + t.count, 0),
        value: 0, // no aplica un 'value' numérico único para esta fórmula
        tags: tagsWithComments,
      });
    }

    return results;
  }
}

// Replica SentimentCommentsProvider.getComments: solo comentarios de respuestas NEGATIVAS
// (number_answer = -1), 1 por combinación grupo+tag, del question_id fijo 999.
async function getGroupComment(
  cmd: FilterCommand,
  level1Column: typeof surveyResponse.criticalMomentCode,
  codeLength: number | undefined,
  level1Key: string,
  tag: string,
): Promise<string | null> {
  const conditions = [
    buildWhere(cmd),
    eq(questionResponse.questionId, COMMENT_QUESTION_ID),
    eq(questionResponse.numberAnswer, -1),
    eq(questionResponse.textAnswer, tag),
    isNotNull(questionResponse.commentAnswer),
  ];

  if (level1Key === 'sin_grupo') {
    conditions.push(isNull(level1Column));
  } else if (codeLength) {
    // level1Key es un código truncado (ej. "001") — compara con el mismo SUBSTRING
    // que se usó para agruparlo, no con igualdad directa contra la columna completa.
    conditions.push(eq(sql`SUBSTRING(${level1Column}, 1, ${codeLength})`, level1Key));
  } else {
    conditions.push(eq(level1Column, level1Key));
  }

  const [row] = await db
    .select({ comment: questionResponse.commentAnswer })
    .from(questionResponse)
    .innerJoin(surveyResponse, eq(questionResponse.surveyResponseId, surveyResponse.id))
    .where(and(...conditions))
    .orderBy(desc(questionResponse.createdAt))
    .limit(1);

  return row?.comment ?? null;
}
