import { FormulaHandler } from './formula-handler.interface';
import { WavgFormulaHandler } from './wavg-formula.handler';
import { NpsFormulaHandler } from './nps-formula.handler';
import { CommentsFormulaHandler } from './comments-formula.handler';
import { SentimentCommentsHandler } from './sentiment-comments.handler';
import { SurveyResponseCountersHandler } from './survey-response-counters.handler';
import { AlertCountersHandler } from './alert-counters.handler';
import { AlertFirstResponseTimeHandler } from './alert-first-response-time.handler';

const registry: Record<string, FormulaHandler> = {
  wavg: new WavgFormulaHandler(),
  // 'wavg-5' registrado como su propio nombre de fórmula, igual que el Java real
  // (WavgFiveFormulaHandler extends WavgFormulaHandler, super("wavg-5")) — no depende
  // de formula_config, el fallback formulaConfigName = formula_config ?? formula ya
  // resuelve 'wavg-5' solo con esto.
  'wavg-5': new WavgFormulaHandler(),
  nps: new NpsFormulaHandler(),
  comments: new CommentsFormulaHandler(),
  'sentiment-comments': new SentimentCommentsHandler(),
  surveyResponseCounters: new SurveyResponseCountersHandler(),
  alertCounters: new AlertCountersHandler(),
  alertFirstResponseTime: new AlertFirstResponseTimeHandler(),
};

export function getFormulaHandler(formulaName: string): FormulaHandler {
  const handler = registry[formulaName];
  if (!handler) throw new Error(`No hay handler para la fórmula: ${formulaName}`);
  return handler;
}