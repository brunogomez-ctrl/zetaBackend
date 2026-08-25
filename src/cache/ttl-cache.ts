interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

// Caché en memoria del proceso — vive mientras el proceso vive, se pierde al reiniciar.
// Suficiente porque hoy es un proceso por tenant, no varias réplicas del mismo tenant
// compitiendo por el mismo caché (si eso cambia algún día, ahí sí hace falta Redis).
const store = new Map<string, CacheEntry<unknown>>();

export interface CacheResult<T> {
  value: T;
  hit: boolean;
}

export async function getOrSetCache<T>(
  key: string,
  ttlMs: number,
  compute: () => Promise<T>,
): Promise<CacheResult<T>> {
  const now = Date.now();
  const cached = store.get(key);

  if (cached && cached.expiresAt > now) {
    return { value: cached.value as T, hit: true };
  }

  const value = await compute();
  store.set(key, { value, expiresAt: now + ttlMs });
  return { value, hit: false };
}
