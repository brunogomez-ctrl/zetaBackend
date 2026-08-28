import { db } from '../db';
import { indicator } from '../db/schema/indicator';
import { indicatorQuestion } from '../db/schema/indicator-question';
import { eq } from 'drizzle-orm';
import { buildFilterCommand } from './filter-command.builder';
import { getFormulaHandler } from './formula/formula-registry';
import { resolveExpectedValue, attachDeviation } from './indicator/expected-value.postprocessor';
import { FilterRequest } from '../models/filter.model';

export async function getIndicatorValues(idOrName: string, filter: FilterRequest) {
  const [ind] = await db.select().from(indicator).where(eq(indicator.name, idOrName));
  if (!ind) return null;

  // indicator <-> question es many-to-many (tabla indicator_question), no una columna directa
  const questionRows = await db
    .select({ questionId: indicatorQuestion.questionId })
    .from(indicatorQuestion)
    .where(eq(indicatorQuestion.indicatorId, ind.id));

  const questionIds = questionRows
    .map(r => r.questionId)
    .filter((id): id is number => id != null);

  const cmd = await buildFilterCommand(filter);
  // Java (IndicatorValuesCommand.getFormulaOrDefault): el 'formula' del request PISA
  // el formula guardado en indicator — no lo complementa, lo reemplaza por completo.
  const formulaName = filter.formula ?? ind.formula ?? '';
  const handler = getFormulaHandler(formulaName);

  const formulaConfigName = ind.formulaConfig ?? formulaName;
  const results = await handler.compute(questionIds, cmd, formulaConfigName, ind.name ?? '');

  const defaultExpectedValue = ind.expectedValue != null ? Number(ind.expectedValue) : null;
  const expectedValue = await resolveExpectedValue(ind.id, defaultExpectedValue, cmd);

  return attachDeviation(results, expectedValue);
}
