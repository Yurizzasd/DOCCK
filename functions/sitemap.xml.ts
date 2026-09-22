import { cacheGet, cacheSet } from './api/_lib/cache';
import { mcpLatest } from './api/_lib/mcpedl';

// Sitemap dinâmico: rotas fixas + páginas individuais dos conteúdos mais
// recentes (indexáveis pelo Google). Cache de 6h no servidor + 1h no edge.
export async function onRequestGet(context: { request: Request }): Promise<Response> {
  const origin = new URL(context.request.url).origin;
  const hit = cacheGet('sitemap');
  if (hit) return xml(hit);

  const statics = ['/', '/addons', '/search', '/categorias', '/sobre'];
  let ids: string[] = [];
  try {
    const latest = await mcpLatest(1);
    ids = latest.list.map((i) => i.id).filter(Boolean).slice(0, 50);
  } catch {
    ids = [];
  }

  const urls = [
    ...statics.map((p) => `  <url><loc>${origin}${p}</loc><changefreq>hourly</changefreq><priority>${p === '/' ? '1.0' : '0.7'}</priority></url>`),
    ...ids.map((id) => `  <url><loc>${origin}/addon/${encodeURIComponent(id)}</loc><changefreq>daily</changefreq><priority>0.8</priority></url>`)
  ];
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>`;
  cacheSet('sitemap', body, 6 * 60 * 60 * 1000);
  return xml(body);
}

function xml(body: string): Response {
  return new Response(body, {
    headers: {
      'content-type': 'application/xml; charset=utf-8',
      'cache-control': 'public, max-age=3600'
    }
  });
}
