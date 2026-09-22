import type { DetailResult, DownloadResult, LatestResult, SearchResult } from '../types/mcpedl';
import { TTL, cacheGet, cacheSet } from '../utils/cache';

// Camada única de comunicação com o backend.
// O frontend NUNCA fala com mcpedl.org diretamente: sempre via /api/*
// (Cloudflare Pages Functions em produção, server/index.mjs em dev).

const BASE = (import.meta.env.VITE_API_URL as string) || '';

async function getJSON<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { headers: { Accept: 'application/json' } });
  if (res.status === 429) {
    const err = (await res.json().catch(() => ({}))) as { error?: string };
    throw Object.assign(new Error(err.error || 'Muitas requisições. Aguarde alguns segundos.'), { status: 429 });
  }
  if (!res.ok) {
    const err = (await res.json().catch(() => ({}))) as { error?: string };
    throw Object.assign(new Error(err.error || 'Não conseguimos carregar os conteúdos agora.'), { status: res.status });
  }
  return res.json() as Promise<T>;
}

export const api = {
  async latest(page = 1): Promise<LatestResult> {
    const key = `dock:latest:${page}`;
    const hit = cacheGet<LatestResult>(key);
    if (hit) return hit;
    const data = await getJSON<LatestResult>(`/api/latest?page=${page}`);
    cacheSet(key, data, TTL.latest);
    return data;
  },

  async search(q: string, page = 1): Promise<SearchResult> {
    const key = `dock:search:${q.toLowerCase().trim()}:${page}`;
    const hit = cacheGet<SearchResult>(key);
    if (hit) return hit;
    const data = await getJSON<SearchResult>(`/api/search?q=${encodeURIComponent(q)}&page=${page}`);
    cacheSet(key, data, TTL.search);
    return data;
  },

  async detail(id: string): Promise<DetailResult> {
    const key = `dock:detail:${id}`;
    const hit = cacheGet<DetailResult>(key);
    if (hit) return hit;
    const data = await getJSON<DetailResult>(`/api/detail?id=${encodeURIComponent(id)}`);
    cacheSet(key, data, TTL.detail);
    return data;
  },

  // Download NUNCA é cacheado: URLs podem ser temporárias.
  async download(fileId: number): Promise<DownloadResult> {
    return getJSON<DownloadResult>(`/api/download?id=${fileId}`);
  },

  async catalog(opts: { q?: string; page?: number }): Promise<SearchResult> {
    if (opts.q && opts.q.trim()) return this.search(opts.q, opts.page ?? 1);
    const latest = await this.latest(opts.page ?? 1);
    return { list: latest.list, hasNextPage: latest.list.length > 0, nextPage: (opts.page ?? 1) + 1 };
  }
};
