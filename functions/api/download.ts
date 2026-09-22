import { errResponse, json } from './_lib/cache';
import { mcpDownload } from './_lib/mcpedl';

// Sem cache: URLs de download podem ser temporárias.
export async function onRequestGet(context: { request: Request }): Promise<Response> {
  try {
    const url = new URL(context.request.url);
    const id = parseInt(url.searchParams.get('id') || '0', 10);
    if (!Number.isInteger(id) || id <= 0) return json({ error: 'Arquivo inválido.' }, 400);
    const data = await mcpDownload(id);
    return json(data, 200, 0);
  } catch (e) {
    return errResponse(e);
  }
}
