interface Entry<T> {
  value: T;
  expires: number;
}

const mem = new Map<string, Entry<unknown>>();

export function cacheGet<T>(key: string): T | null {
  const e = mem.get(key) as Entry<T> | undefined;
  if (!e) {
    try {
      const raw = sessionStorage.getItem(key);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as Entry<T>;
      if (Date.now() > parsed.expires) {
        sessionStorage.removeItem(key);
        return null;
      }
      return parsed.value;
    } catch {
      return null;
    }
  }
  if (Date.now() > e.expires) {
    mem.delete(key);
    return null;
  }
  return e.value;
}

export function cacheSet<T>(key: string, value: T, ttlMs: number): void {
  mem.set(key, { value, expires: Date.now() + ttlMs });
  try {
    sessionStorage.setItem(key, JSON.stringify({ value, expires: Date.now() + ttlMs }));
  } catch {
    /* storage cheio — ignora */
  }
}

// TTLs conforme spec: recente/busca curto, detalhe maior, download nunca cachear.
export const TTL = {
  latest: 5 * 60 * 1000,
  search: 2 * 60 * 1000,
  detail: 30 * 60 * 1000
};
