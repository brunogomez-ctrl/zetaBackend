import { FilterCommand } from '../../models/filter.model';

export interface CommentEntry {
  comment: string;
  createdAt: string;
  surveyResponseId: number;
  type?: number | null;
  score?: number | null;
}

export interface SentimentTagResult {
  group: string;
  groupId: string;
  count: number;
  positive: number;
  negative: number;
  neutral: number;
  comments: string[];
}

export interface FormulaResult {
  group: string;
  groupId: string;
  count: number;
  value: number;
  expected?: number | null;
  deviation?: number | null;
  promoters?: number;
  detractors?: number;
  passives?: number;
  comments?: CommentEntry[];
  answeredCount?: number;
  notHandledCount?: number;
  inProgressCount?: number;
  invalidCount?: number;
  closedCount?: number;
  fakeCount?: number;
  externalSourceCount?: number;
  notAnsweredCount?: number;
  answeredPerc?: number;
  handledPerc?: number;
  invalidPerc?: number;
  validPerc?: number;
  totalCount?: number;
  positiveCount?: number;
  negativeCount?: number;
  positivePercentage?: number;
  negativePercentage?: number;
  fastCount?: number;
  slowCount?: number;
  fastPerc?: number;
  slowPerc?: number;
  tags?: SentimentTagResult[]; // para 'sentiment' / diagrama de Ishikawa
}

export interface FormulaHandler {
  compute(
    questionIds: number[],
    cmd: FilterCommand,
    formulaConfigName?: string,
    indicatorName?: string,
  ): Promise<FormulaResult[]>;
}