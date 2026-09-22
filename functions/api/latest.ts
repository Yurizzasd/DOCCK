import { SERVER_TTL, cacheGet, cacheSet, errResponse, json } from './_lib/cache';
import { mcpLatest } from './_lib/mcpedl';

interface Env {}

export async function onRequestGet(context: { request: Request; env: Env }): Promise<Response> {
  try {
    const url = new URL(context.request.url);
    const page = Math.max(1, parseInt(url.searchParams.get('page') || '1', 10) || 1);
    const key = `latest:${page}`;
    const hit = cacheGet(key);
    if (hit) return json(JSON.parse(hit), 200, 300);
    const data = await mcpLatest(page);
    cacheSet(key, JSON.stringify(data), SERVER_TTL.latest);
    return json(data, 200, 300);
  } catch (e) {
    return errResponse(e);
  }
}
