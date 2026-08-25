import { bigint, decimal, mysqlTable } from 'drizzle-orm/mysql-core';

// Override de expected_value por ubicación lógica, para un indicador específico.
export const indicatorLocation = mysqlTable('indicator_location', {
  id: bigint('id', { mode: 'number' }).notNull(),
  indicatorId: bigint('indicator_id', { mode: 'number' }).notNull(),
  logicalLocationId: bigint('logical_location_id', { mode: 'number' }).notNull(),
  expectedValue: decimal('expected_value', { precision: 13, scale: 6 }),
});
