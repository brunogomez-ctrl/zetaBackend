import { db } from '../db';
import { geoLocation } from '../db/schema/geo-location';
import { logicalLocation } from '../db/schema/logical-location';
import { criticalMoment } from '../db/schema/critical-moment';
import { inArray } from 'drizzle-orm';
import { FilterRequest, FilterCommand } from '../models/filter.model';
import { NODE_CODE_LENGTH } from '../config/constants';

export async function buildFilterCommand(filter: FilterRequest): Promise<FilterCommand> {
  const geoRanges = filter.geoLocationInclude?.length
    ? (await db.select({ from: geoLocation.searchCodeFrom, to: geoLocation.searchCodeTo })
        .from(geoLocation)
        .where(inArray(geoLocation.id, filter.geoLocationInclude)))
        .map((r: { from: string | null; to: string | null }) => ({ from: r.from ?? '', to: r.to ?? '' }))
    : [];

  const logicalRanges = filter.logicalLocationInclude?.length
    ? (await db.select({ from: logicalLocation.searchCodeFrom, to: logicalLocation.searchCodeTo })
        .from(logicalLocation)
        .where(inArray(logicalLocation.id, filter.logicalLocationInclude)))
        .map((r: { from: string | null; to: string | null }) => ({ from: r.from ?? '', to: r.to ?? '' }))
    : [];

  // Igual mecanismo que geo/lógica: critical_moment también tiene search_code_from/to
  // (materialized path). criticalMomentInclude=[113901] no filtra por ese id literal —
  // filtra por el rango jerárquico de ese nodo, incluyendo todos sus descendientes.
  const criticalMomentRanges = filter.criticalMomentInclude?.length
    ? (await db.select({ from: criticalMoment.searchCodeFrom, to: criticalMoment.searchCodeTo })
        .from(criticalMoment)
        .where(inArray(criticalMoment.id, filter.criticalMomentInclude)))
        .map((r: { from: string | null; to: string | null }) => ({ from: r.from ?? '', to: r.to ?? '' }))
    : [];

  // Java: getLocationGroupCodeLength = max(largo de los 'from' del filtro) + NODE_CODE_LENGTH.
  // Si no hay filtro, cae al default: solo NODE_CODE_LENGTH (nivel 1).
  const criticalMomentGroupCodeLength = criticalMomentRanges.length
    ? Math.max(...criticalMomentRanges.map(r => r.from.length)) + NODE_CODE_LENGTH
    : NODE_CODE_LENGTH;

  return {
    dateFrom: new Date(filter.dateFrom),
    dateTo: new Date(new Date(filter.dateTo).getTime() + 24 * 60 * 60 * 1000), // +1 día, igual que en Java
    geoLocationRanges: geoRanges,
    logicalLocationRanges: logicalRanges,
    criticalMomentRanges,
    criticalMomentGroupCodeLength,
    groupBy: filter.groupBy,
    groupCodeLength: filter.groupByLevel ? filter.groupByLevel * NODE_CODE_LENGTH : undefined,
  };
}