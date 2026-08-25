import { bigint, mysqlTable } from 'drizzle-orm/mysql-core';

export const indicatorQuestion = mysqlTable('indicator_question', {
  indicatorId: bigint('indicator_id', { mode: 'number' }),
  questionId: bigint('question_id', { mode: 'number' }),
});
