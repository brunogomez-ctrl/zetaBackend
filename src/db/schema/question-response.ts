import { bigint, datetime, decimal, int, mysqlTable, text, varchar } from 'drizzle-orm/mysql-core';

// La tabla real NO tiene geo_location_code / logical_location_code:
// esos viven en survey_response y se llega a ellos por join via surveyResponseId.
export const questionResponse = mysqlTable('question_response', {
  id: bigint('id', { mode: 'number' }).notNull(),
  surveyResponseId: bigint('survey_response_id', { mode: 'number' }),
  questionId: bigint('question_id', { mode: 'number' }),
  numberAnswer: int('number_answer'),
  decimalAnswer: decimal('decimal_answer', { precision: 13, scale: 6 }),
  commentAnswer: text('comment_answer'),
  textAnswer: varchar('text_answer', { length: 255 }),
  createdAt: datetime('created_at', { mode: 'string' }),
});
