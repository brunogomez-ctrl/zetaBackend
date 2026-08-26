import { Request, Response } from 'express';
import { getIndicatorValues } from '../services/indicator-values.service';
import { getOrSetCache } from '../cache/ttl-cache';
import { FilterRequest } from '../models/filter.model';

// Separado de indicator.controller.ts a propósito: es su propia vista en el frontend
// (indicadores de alertas), aunque por debajo reusa el mismo motor genérico
// (getIndicatorValues sigue resolviendo por indicator.name -> formula -> handler,
// igual que para wavg/nps/etc. — no hay lógica duplicada, solo una ruta distinta).
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 min — mismo criterio que indicator.controller.ts

function buildCacheKey(idOrName: string, filter: FilterRequest): string {
  const geo = [...(filter.geoLocationInclude ?? [])].sort((a, b) => a - b).join(',');
  const logical = [...(filter.logicalLocationInclude ?? [])].sort((a, b) => a - b).join(',');
  const criticalMoment = [...(filter.criticalMomentInclude ?? [])].sort((a, b) => a - b).join(',');
  return [
    'alerts', // prefijo para que no choque con las llaves de indicator.controller.ts
    idOrName,
    filter.dateFrom,
    filter.dateTo,
    geo,
    logical,
    criticalMoment,
    filter.groupBy ?? '',
    filter.groupByLevel ?? '',
    filter.formulaConfig ?? '',
    filter.resultType ?? '',
  ].join('|');
}

export async function postAlertValues(req: Request, res: Response) {
  const idOrName = String(req.params.idOrName);
  const key = buildCacheKey(idOrName, req.body);

  const { value: result, hit } = await getOrSetCache(
    key,
    CACHE_TTL_MS,
    () => getIndicatorValues(idOrName, req.body),
  );

  res.set('X-Cache', hit ? 'HIT' : 'MISS');

  if (!result) return res.status(404).end();
  res.json(result);
}
