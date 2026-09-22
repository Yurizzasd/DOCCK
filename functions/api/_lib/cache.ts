// Cache em memória com TTL (Workers/Pages Functions).
// Download nunca passa por aqui.

interface Entry {
  body: string;
  expires: number;
}

const store = new Map<string, Entry>();

export function cacheGet(key: string): string | null {
  const e = store.get(key);
  if (!e) return null;
  if (Date.now() > e.expires) {
    store.delete(key);
    return null;
  }
  return e.body;
}

export function cacheSet(key: string, body: string, ttlMs: number): void {
  if (store.size > 300) {
    const first = store.keys().next().value;
    if (first) store.delete(first);
  }
  store.set(key, { body, expires: Date.now() + ttlMs });
}

export const SERVER_TTL = {
  latest: 5 * 60 * 1000,
  search: 2 * 60 * 1000,
  detail: 30 * 60 * 1000
};

export function json(data: unknown, status = 200, cacheSeconds = 0): Response {
  const headers: Record<string, string> = { 'content-type': 'application/json; charset=utf-8' };
  if (cacheSeconds > 0) headers['cache-control'] = `public, max-age=${cacheSeconds}`;
  return new Response(JSON.stringify(data), { status, headers });
}

export function errResponse(e: unknown): Response {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const anyE = e as any;
  const status = typeof anyE?.status === 'number' ? anyE.status : 500;
  const friendly =
    status === 404
      ? 'Conteúdo não encontrado.'
      : status === 429
        ? 'Muitas requisições. Aguarde alguns segundos e tente de novo.'
        : 'Não conseguimos carregar os conteúdos agora.';
  return json({ error: anyE?.message && status < 500 ? anyE.message : friendly, code: anyE?.code }, status);
}
