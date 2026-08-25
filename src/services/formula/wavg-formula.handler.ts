import { and, eq, inArray, sql } from 'drizzle-orm';
import { db } from '../../db';
import { questionResponse } from '../../db/schema/question-response';
import { surveyResponse } from '../../db/schema/survey-response';
import { buildWhere } from '../../repositories/filter-predicate.builder';
import { FilterCommand } from '../../models/filter.model';
import { FormulaHandler, FormulaResult } from './formula-handler.interface';
import { resolveWavgConfig } from '../../config/tenant-config';

export class WavgFormulaHandler implements FormulaHandler {
  async compute(
    questionIds: number[],
    cmd: FilterCommand,
    formulaConfigName = 'wavg',
    indicatorName = '',
  ): Promise<FormulaResult[]> {
    if (questionIds.length === 0) return [];

    const { numericPrecision, multiplier, scalar } = resolveWavgConfig(indicatorName, formulaConfigName);

    if (scalar) {
      // El override trae una expresión (case()/between()) que todavía no interpretamos —
      // eso es el intérprete de expresiones que dejamos pendiente (punto B). Fallar explícito
      // es mejor que calcular un promedio silenciosamente incorrecto para este indicador.
      throw new Error(
        `El indicador "${indicatorName}" usa un scalar personalizado ("${scalar}") que aún no está soportado — pendiente el intérprete de expresiones.`
      );
    }

    const codeColumn = cmd.groupBy === 'logicalLocation'
      ? surveyResponse.logicalLocationCode
      : surveyResponse.geoLocationCode;

    const groupExpr = cmd.groupCodeLength
      ? sql`SUBSTRING(${codeColumn}, 1, ${cmd.groupCodeLength})`
      : codeColumn;

    const avgExpr = multiplier
      ? sql<number>`ROUND(AVG(${questionResponse.numberAnswer}) * ${multiplier}, ${numericPrecision})`
      : sql<number>`ROUND(AVG(${questionResponse.numberAnswer}), ${numericPrecision})`;

    const rows = await db
      .select({
        groupId: groupExpr,
        count: sql<number>`COUNT(*)`,
        value: avgExpr,
      })
      .from(questionResponse)
      .innerJoin(surveyResponse, eq(questionResponse.surveyResponseId, surveyResponse.id))
      .where(and(buildWhere(cmd), inArray(questionResponse.questionId, questionIds)))
      .groupBy(groupExpr);

    return rows.map(r => ({
      group: String(r.groupId),
      groupId: String(r.groupId),
      count: Number(r.count),
      value: Number(r.value),
    }));
  }
}
