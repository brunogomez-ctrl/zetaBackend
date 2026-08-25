export interface FilterRequest {
  dateFrom: string;
  dateTo: string;
  geoLocationInclude?: number[];
  logicalLocationInclude?: number[];
  groupBy?: 'geoLocation' | 'logicalLocation' | 'alertStatus';
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
  groupBy?: 'geoLocation' | 'logicalLocation' | 'alertStatus';
  groupCodeLength?: number;
}