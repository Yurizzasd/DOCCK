import { SERVER_TTL, cacheGet, cacheSet, errResponse, json } from './_lib/cache';
import { mcpSearch } from './_lib/mcpedl';

export async function onRequestGet(context: { request: Request }): Promise<Response> {
  try {
    const url = new URL(context.request.url);
    const q = (url.searchParams.get('q') || '').trim();
    const page = Math.max(1, parseInt(url.searchParams.get('page') || '1', 10) || 1);
    if (!q) return json({ error: 'Informe o termo da busca.' }, 400);
    const key = `search:${q.toLowerCase()}:${page}`;
    const hit = cacheGet(key);
    if (hit) return json(JSON.parse(hit), 200, 120);
    const data = await mcpSearch(q, page);
    cacheSet(key, JSON.stringify(data), SERVER_TTL.search);
    return json(data, 200, 120);
  } catch (e) {
    return errResponse(e);
  }
}
