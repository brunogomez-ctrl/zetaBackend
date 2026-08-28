import { createGroupCountHandler } from './group-count-formula.handler';
import { questionResponse } from '../../db/schema/question-response';

export const countTextHandler = createGroupCountHandler(questionResponse.textAnswer);
