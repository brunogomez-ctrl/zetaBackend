import { bigint, int, mysqlTable, primaryKey, tinyint, varchar } from 'drizzle-orm/mysql-core';

  export const logicalLocation = mysqlTable("logical_location", {
    id: bigint("id", { mode: "number" }).notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    searchCodeFrom: varchar("search_code_from", { length: 255 }),
    searchCodeTo: varchar("search_code_to", { length: 255 }),
    searchOrder: int("search_order"),
    description: varchar("description", { length: 255 }).notNull(),
    parentId: bigint("parent_id", { mode: "number" }),
    code: varchar("code", { length: 16 }),
    brand: tinyint("brand").default(1).notNull(),
    level: varchar("level", { length: 255 }),
  },
  (table) => [
    primaryKey({ columns: [table.id], name: "logical_location_id"}),
  ]);