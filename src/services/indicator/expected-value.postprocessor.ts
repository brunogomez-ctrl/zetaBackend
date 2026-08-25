import { and, eq, gt, lte } from 'drizzle-orm';
import { db } from '../../db';
import { indicatorLocation } from '../../db/schema/indicator-location';
import { logicalLocation } from '../../db/schema/logical-location';
import { FormulaResult } from '../formula/formula-handler.interface';
import { FilterCommand } from '../../models/filter.model';

// Replica ExpectedValuePostProcessor + Indicator.getExpectedValue(searchCode) del Java.
//
// Regla real:
//  - 0 rangos de logicalLocation en el filtro -> expected = indicator.expectedValue (el default)
//  - 1 rango -> busca override en indicator_location cuya logical_location sea ancestro
//    (o la misma) del código pedido; si no hay override, cae al default
//  - >1 rango -> expected = null (no se calcula deviation, es ambiguo)
export async function resolveExpectedValue(
  indicatorId: number,
  defaultExpectedValue: number | null,
  cmd: FilterCommand,
): Promise<number | null> {
  if (cmd.logicalLocationRanges.length === 0) {
    return defaultExpectedValue;
  }
  if (cmd.logicalLocationRanges.length > 1) {
    return null;
  }

  const target = cmd.logicalLocationRanges[0]!.from;

  // Ancestro = logical_location cuyo rango [search_code_from, search_code_to) contiene 'target'.
  // NOTA: si hay varios ancestros que califican, esto no garantiza tomar el más específico
  // (el Java tampoco lo garantiza — itera un Set sin orden definido). Suficiente para el piloto.
  const [override] = await db
    .select({ expectedValue: indicatorLocation.expectedValue })
    .from(indicatorLocation)
    .innerJoin(logicalLocation, eq(indicatorLocation.logicalLocationId, logicalLocation.id))
    .where(and(
      eq(indicatorLocation.indicatorId, indicatorId),
      lte(logicalLocation.searchCodeFrom, target),
      gt(logicalLocation.searchCodeTo, target),
    ))
    .limit(1);

  if (override?.expectedValue != null) {
    return Number(override.expectedValue);
  }

  return defaultExpectedValue;
}

// deviation = value - expected (resta simple, no porcentaje) — igual que el Java.
export function attachDeviation(results: FormulaResult[], expected: number | null): FormulaResult[] {
  if (expected == null) {
    return results;
  }
  return results.map(r => ({
    ...r,
    expected,
    deviation: r.value - expected,
  }));
}
