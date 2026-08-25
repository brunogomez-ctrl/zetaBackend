import { bigint, datetime, mysqlTable, varchar } from 'drizzle-orm/mysql-core';

export const alert = mysqlTable('alert', {
  id: bigint('id', { mode: 'number' }).notNull(),
  surveyResponseId: bigint('survey_response_id', { mode: 'number' }),
  alertType: varchar('alert_type', { length: 32 }),
  alertStatus: varchar('alert_status', { length: 255 }),
  createdAt: datetime('created_at', { mode: 'string' }),
  finalizedAt: datetime('finalized_at', { mode: 'string' }),
  firstUpdatedAt: datetime('first_updated_at', { mode: 'string' }),
});
