import { and, eq, inArray, sql } from 'drizzle-orm';
import { db } from '../../db';
import { questionResponse } from '../../db/schema/question-response';
import { surveyResponse } from '../../db/schema/survey-response';
import { buildWhere } from '../../repositories/filter-predicate.builder';
import { FilterCommand } from '../../models/filter.model';
import { FormulaHandler, FormulaResult } from './formula-handler.interface';
import { resolveNpsConfig } from '../../config/tenant-config';

export class NpsFormulaHandler implements FormulaHandler {
  async compute(
    questionIds: number[],
    cmd: FilterCommand,
    formulaConfigName?: string,
  ): Promise<FormulaResult[]> {
    if (questionIds.length === 0) return [];

    const cfg = resolveNpsConfig(formulaConfigName);

    // Soporta dos formas: rango explícito (detractorRange/promoterRange, ej. escala -1/0/1 de OXXO)
    // o detractorMax/promoterMin (escala 0-10 clásica, default de IAMSA).
    const [detractorMin, detractorMax] = cfg.detractorRange ?? [0, cfg.detractorMax ?? 6];
    const [promoterMin, promoterMax] = cfg.promoterRange ?? [cfg.promoterMin ?? 9, 10];
    // fan: default de la clase NpsConfiguration.java (between(numberAnswer,10,10)) — no viene
    // de ningún yml de ningún tenant, SIEMPRE aplica salvo que el config lo sobreescriba explícito.
    const [fanMin, fanMax] = cfg.fanRange ?? [10, 10];

    const codeColumn = cmd.groupBy === 'logicalLocation'
      ? surveyResponse.logicalLocationCode
      : surveyResponse.geoLocationCode;

    const groupExpr = cmd.groupCodeLength
      ? sql`SUBSTRING(${codeColumn}, 1, ${cmd.groupCodeLength})`
      : codeColumn;

    const rows = await db
      .select({
        groupId: groupExpr,
        count: sql<number>`COUNT(*)`,
        promoterCount: sql<number>`SUM(CASE WHEN ${questionResponse.numberAnswer} BETWEEN ${promoterMin} AND ${promoterMax} THEN 1 ELSE 0 END)`,
        detractorCount: sql<number>`SUM(CASE WHEN ${questionResponse.numberAnswer} BETWEEN ${detractorMin} AND ${detractorMax} THEN 1 ELSE 0 END)`,
        fanCount: sql<number>`SUM(CASE WHEN ${questionResponse.numberAnswer} BETWEEN ${fanMin} AND ${fanMax} THEN 1 ELSE 0 END)`,
      })
      .from(questionResponse)
      .innerJoin(surveyResponse, eq(questionResponse.surveyResponseId, surveyResponse.id))
      .where(and(buildWhere(cmd), inArray(questionResponse.questionId, questionIds)))
      .groupBy(groupExpr);

    return rows.map(r => {
      const count = Number(r.count);
      const promoterCount = Number(r.promoterCount);
      const detractorCount = Number(r.detractorCount);
      const fanCount = Number(r.fanCount);
      const passiveCount = count - promoterCount - detractorCount;
      const promoterNoFanCount = promoterCount - fanCount;

      const pct = (n: number) => count > 0 ? round((n / count) * 100, cfg.numericPrecision) : 0;

      return {
        group: String(r.groupId),
        groupId: String(r.groupId),
        count,
        value: pct(promoterCount - detractorCount),
        promoters: pct(promoterCount),
        detractors: pct(detractorCount),
        passives: pct(passiveCount),
        fanCount,
        fans: pct(fanCount),
        promoterNoFanCount,
        promotersNoFan: pct(promoterNoFanCount),
      };
    });
  }
}

function round(n: number, precision: number): number {
  const factor = Math.pow(10, precision);
  return Math.round(n * factor) / factor;
}
