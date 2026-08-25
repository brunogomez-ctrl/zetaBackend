import { Request, Response } from 'express';
import { getIndicatorValues } from '../services/indicator-values.service';
import { getOrSetCache } from '../cache/ttl-cache';
import { FilterRequest } from '../models/filter.model';

const CACHE_TTL_MS = 30 * 60 * 1000; // 30 min

// La llave debe capturar TODO lo que cambia el resultado — no solo idOrName.
// Los arrays de ubicación se ordenan para que [19,20] y [20,19] compartan caché
// (representan el mismo filtro, solo llegaron en distinto orden desde el cliente).
function buildCacheKey(idOrName: string, filter: FilterRequest): string {
  const geo = [...(filter.geoLocationInclude ?? [])].sort((a, b) => a - b).join(',');
  const logical = [...(filter.logicalLocationInclude ?? [])].sort((a, b) => a - b).join(',');
  return [
    idOrName,
    filter.dateFrom,
    filter.dateTo,
    geo,
    logical,
    filter.groupBy ?? '',
    filter.groupByLevel ?? '',
    filter.formulaConfig ?? '',
  ].join('|');
}

export async function postIndicatorValues(req: Request, res: Response) {
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
