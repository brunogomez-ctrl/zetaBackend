import { bigint, int, mysqlTable, varchar } from 'drizzle-orm/mysql-core';

export const criticalMoment = mysqlTable('critical_moment', {
  id: bigint('id', { mode: 'number' }).notNull(),
  name: varchar('name', { length: 255 }),
  description: varchar('description', { length: 255 }),
  searchCodeFrom: varchar('search_code_from', { length: 255 }),
  searchCodeTo: varchar('search_code_to', { length: 255 }),
  searchOrder: int('search_order'),
  parentId: bigint('parent_id', { mode: 'number' }),
  code: varchar('code', { length: 16 }),
});
