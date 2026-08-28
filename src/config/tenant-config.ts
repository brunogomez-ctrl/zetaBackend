import iamsaConfig from './tenants/iamsa.json';
import oxxoConfig from './tenants/oxxo.json';

export interface WavgConfigEntry {
  numericPrecision: number;
  multiplier?: number;
  scalar?: string; // expresión tipo case()/between() — AÚN NO SE INTERPRETA (ver punto B, pendiente)
}

export interface NpsConfigEntry {
  numericPrecision: number;
  detractorMax?: number;
  promoterMin?: number;
  detractorRange?: [number, number];
  promoterRange?: [number, number];
  passiveRange?: [number, number];
  fanRange?: [number, number]; // default real de Java: [10,10], siempre aplica salvo override
}

export interface TenantConfig {
  tenantId: string;
  wavg: {
    configs: Record<string, WavgConfigEntry>;
    indicators: Record<string, WavgConfigEntry>;
  };
  nps: {
    default: NpsConfigEntry;
    configs: Record<string, NpsConfigEntry>;
  };
}

// Registro de tenants conocidos. Cargado una sola vez al importar este módulo (boot-time),
// igual que @ConfigurationProperties en el Java real — nunca se relee por request.
const TENANT_REGISTRY: Record<string, TenantConfig> = {
  iamsa: iamsaConfig as unknown as TenantConfig,
  oxxo: oxxoConfig as unknown as TenantConfig,
};

const ACTIVE_TENANT = process.env.TENANT ?? 'iamsa';

const activeConfig = TENANT_REGISTRY[ACTIVE_TENANT];
if (!activeConfig) {
  // Fallar rápido en boot, no en el primer request — mismo principio que ya acordamos.
  throw new Error(
    `No hay config para el tenant "${ACTIVE_TENANT}". Tenants conocidos: ${Object.keys(TENANT_REGISTRY).join(', ')}`
  );
}

export function getActiveTenantConfig(): TenantConfig {
  return activeConfig;
}

// Algoritmo de 4 pasos que acordamos:
// 1) override por nombre de indicador -> 2) config por nombre -> 3) default del tenant -> (4 ya cubierto por el default)
export function resolveWavgConfig(indicatorName: string, configName: string): WavgConfigEntry {
  const cfg = getActiveTenantConfig();

  const byIndicator = cfg.wavg.indicators[indicatorName];
  if (byIndicator) return byIndicator;

  const byConfigName = cfg.wavg.configs[configName];
  if (byConfigName) return byConfigName;

  return { numericPrecision: 2 }; // default de última instancia
}

export function resolveNpsConfig(configName?: string): NpsConfigEntry {
  const cfg = getActiveTenantConfig();
  if (configName && cfg.nps.configs[configName]) {
    return cfg.nps.configs[configName];
  }
  return cfg.nps.default;
}
