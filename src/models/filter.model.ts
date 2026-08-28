export interface FilterRequest {
  dateFrom: string;
  dateTo: string;
  geoLocationInclude?: number[];
  logicalLocationInclude?: number[];
  criticalMomentInclude?: number[];
  groupBy?: string; // ej. 'geoLocation' | 'logicalLocation' | 'alertStatus' | 'criticalMoment,tag'
  groupByLevel?: number;
  formula?: string; // pisa indicator.formula si viene — confirmado en Java (getFormulaOrDefault)
  formulaConfig?: string;
  resultType?: 'bottom' | 'top'; // solo 'bottom' implementado hoy (lo único que usa el Ishikawa real)
  groupNameFormat?: string; // aceptado pero aún no resuelve etiquetas (pendiente, ver count-number)
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
  criticalMomentRanges: LocationRange[];
  // Java: getLocationGroupCodeLength = max(largo de los 'from' del filtro) + NODE_CODE_LENGTH,
  // se calcula solo, el cliente no lo manda. Igual para las 3 dimensiones jerárquicas.
  criticalMomentGroupCodeLength: number;
  groupBy?: string;
  groupCodeLength?: number;
}
