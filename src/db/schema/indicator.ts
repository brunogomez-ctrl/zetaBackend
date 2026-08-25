import { bigint, decimal, mysqlTable, varchar } from 'drizzle-orm/mysql-core';

export const indicator = mysqlTable('indicator', {
  id: bigint('id', { mode: 'number' }).notNull(),
  name: varchar('name', { length: 255 }),
  formula: varchar('formula', { length: 255 }),
  formulaConfig: varchar('formula_config', { length: 255 }),
  expectedValue: decimal('expected_value', { precision: 13, scale: 6 }),
});

