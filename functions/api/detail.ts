import { SERVER_TTL, cacheGet, cacheSet, errResponse, json } from './_lib/cache';
import { mcpDetail } from './_lib/mcpedl';

export async function onRequestGet(context: { request: Request }): Promise<Response> {
  try {
    const url = new URL(context.request.url);
    const id = (url.searchParams.get('id') || '').trim();
    if (!id) return json({ error: 'Identificador inválido.' }, 400);
    const key = `detail:${id.toLowerCase()}`;
    const hit = cacheGet(key);
    if (hit) return json(JSON.parse(hit), 200, 1800);
    const data = await mcpDetail(id);
    cacheSet(key, JSON.stringify(data), SERVER_TTL.detail);
    return json(data, 200, 1800);
  } catch (e) {
    return errResponse(e);
  }
}
