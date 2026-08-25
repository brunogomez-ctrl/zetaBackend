// import { db } from '../db';
// import { geoLocation } from '../db/schema/geo-location';
// import { logicalLocation } from '../db/schema/logical-location';
// import { inArray } from 'drizzle-orm';
// import { FilterRequest, FilterCommand } from '../models/filter.model';
// import { NODE_CODE_LENGTH } from '../config/constants';

// export async function buildFilterCommand(filter: FilterRequest): Promise<FilterCommand> {
//   const geoRanges = filter.geoLocationInclude?.length
//     ? (await db.select({ from: geoLocation.searchCodeFrom, to: geoLocation.searchCodeTo })
//         .from(geoLocation)
//         .where(inArray(geoLocation.id, filter.geoLocationInclude)))
//         .map(r => ({ from: r.from, to: r.to }))
//     : [];

//   const logicalRanges = filter.logicalLocationInclude?.length
//     ? (await db.select({ from: logicalLocation.searchCodeFrom, to: logicalLocation.searchCodeTo })
//         .from(logicalLocation)
//         .where(inArray(logicalLocation.id, filter.logicalLocationInclude)))
//         .map(r => ({ from: r.from, to: r.to }))
//     : [];

//   return {
//     dateFrom: new Date(filter.dateFrom),
//     dateTo: new Date(new Date(filter.dateTo).getTime() + 24 * 60 * 60 * 1000), // +1 día, igual que en Java
//     geoLocationRanges: geoRanges,
//     logicalLocationRanges: logicalRanges,
//     groupBy: filter.groupBy,
//     groupCodeLength: filter.groupByLevel ? filter.groupByLevel * NODE_CODE_LENGTH : undefined,
//   };
// }
import { db } from '../db';
import { geoLocation } from '../db/schema/geo-location';
import { logicalLocation } from '../db/schema/logical-location';
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

  return {
    dateFrom: new Date(filter.dateFrom),
    dateTo: new Date(new Date(filter.dateTo).getTime() + 24 * 60 * 60 * 1000), // +1 día, igual que en Java
    geoLocationRanges: geoRanges,
    logicalLocationRanges: logicalRanges,
    groupBy: filter.groupBy,
    groupCodeLength: filter.groupByLevel ? filter.groupByLevel * NODE_CODE_LENGTH : undefined,
  };
}