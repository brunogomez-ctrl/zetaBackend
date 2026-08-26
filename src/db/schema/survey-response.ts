import { bigint, datetime, mysqlTable, varchar } from 'drizzle-orm/mysql-core';

// Solo las columnas que necesita el motor de indicadores.
// La tabla real tiene muchas más (ver src/db/migrations/schema.ts, generado por introspección).
export const surveyResponse = mysqlTable('survey_response', {
  id: bigint('id', { mode: 'number' }).notNull(),
  geoLocationCode: varchar('geo_location_code', { length: 255 }),
  logicalLocationCode: varchar('logical_location_code', { length: 255 }),
  answeredAt: datetime('answered_at', { mode: 'string' }),
  createdAt: datetime('created_at', { mode: 'string' }),
  status: varchar('status', { length: 255 }),
  criticalMomentId: bigint('critical_moment_id', { mode: 'number' }),
  criticalMomentCode: varchar('critical_moment_code', { length: 255 }),
});
