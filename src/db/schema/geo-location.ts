import { mysqlTable, bigint, int, varchar } from 'drizzle-orm/mysql-core';

export const geoLocation = mysqlTable('geo_location', {
  id: bigint('id', { mode: 'number' }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  code: varchar('code', { length: 16 }),
  searchCodeFrom: varchar('search_code_from', { length: 255 }),
  searchCodeTo: varchar('search_code_to', { length: 255 }),
  parentId: bigint('parent_id', { mode: 'number' }),
});