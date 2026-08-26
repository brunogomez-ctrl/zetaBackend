export interface FilterRequest {
  dateFrom: string;
  dateTo: string;
  geoLocationInclude?: number[];
  logicalLocationInclude?: number[];
  criticalMomentInclude?: number[];
  groupBy?: 'geoLocation' | 'logicalLocation' | 'alertStatus' | 'criticalMoment';
  groupByLevel?: number;
  formulaConfig?: string;
}

export interface LocationRange {
  from: string;
  to: string;
}

export interface FilterCommand {
  dateFrom: Date;
  dateTo: Date;
  geoLocationRanges: LocationRange[];
  logicalLocationRanges: LocationRange[];
  // Simplificación deliberada respecto a producción: ahí criticalMomentInclude filtra por
  // rango jerárquico (search_code_from/to), igual que geo/lógica. Aquí filtramos por
  // critical_moment_id literal — más simple, documentado como pendiente en el markdown.
  criticalMomentIds?: number[];
  groupBy?: 'geoLocation' | 'logicalLocation' | 'alertStatus' | 'criticalMoment';
  groupCodeLength?: number;
}
