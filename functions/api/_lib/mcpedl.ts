// Núcleo de scraping — port fiel de terastudio-org/mcpedl (src/index.ts)
// para runtime Web (Cloudflare Workers / Pages Functions): usa fetch + cheerio,
// sem axios/bottleneck/p-retry (sem dependências Node-only).
// Endpoints originais preservados:
//   search  -> GET {base}/page/{page}/?s={query}
//   detail  -> GET {base}/{id}
//   download-> GET {base}/dw_file.php?id={id}  (extrai <a href>)
//   mclatest-> GET {base}/downloading/page/{page}/

import * as cheerio from 'cheerio';

export interface SearchItem { name: string; id: string; img: string; rating: string }
export interface SearchResult { list: SearchItem[]; hasNextPage: boolean; nextPage?: number }
export interface DetailResult {
  title: string; img: string;
  rating: { count: string; value: string };
  comment: string; content: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  info: { category: string; postDate: string; author: string; [k: string]: any };
  gallery: { type: 'image' | 'video'; img: string; name?: string; postTime?: string; duration?: string | null; video?: string | null }[];
  faq: { question: string; answer: string }[];
  list: { index: number; name: string; version: string; files: { index: number; type: string; id: number; meta_title?: string | null }[] }[];
}
export interface LatestResult { quick: { name: string; id: string; file: number }[]; list: SearchItem[] }

const BASE = 'https://mcpedl.org';
const UA = 'Mozilla/5.0 (compatible; DOCK/1.0; +https://github.com/dock)';

// Rate limit simples em memória: min 900ms entre requisições de scraping.
let lastHit = 0;
async function throttle(): Promise<void> {
  const now = Date.now();
  const wait = 900 - (now - lastHit);
  if (wait > 0) await new Promise((r) => setTimeout(r, wait));
  lastHit = Date.now();
}

async function fetchHtml(url: string, retries = 3): Promise<string> {
  let lastErr: unknown;
  for (let attempt = 0; attempt <= retries; attempt++) {
    await throttle();
    try {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), 15000);
      const res = await fetch(url, {
        signal: ctrl.signal,
        headers: {
          'User-Agent': UA,
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5'
        }
      }).finally(() => clearTimeout(t));
      if (res.status === 404) throw httpError(404, 'NOT_FOUND', 'Conteúdo não encontrado.');
      if (res.status === 429) throw httpError(429, 'RATE_LIMIT', 'Limite de requisições excedido.');
      if (res.status >= 500) throw httpError(res.status, 'SERVER_ERROR', 'Servidor de origem indisponível.');
      if (!res.ok) throw httpError(res.status, 'REQUEST_FAILED', 'Falha ao consultar a origem.');
      return await res.text();
    } catch (e) {
      lastErr = e;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const code = (e as any)?.code;
      if (code === 'NOT_FOUND' || code === 'RATE_LIMIT') throw e;
      if (attempt < retries) await new Promise((r) => setTimeout(r, 1200 * (attempt + 1)));
    }
  }
  throw lastErr;
}

export function httpError(status: number, code: string, message: string) {
  return Object.assign(new Error(message), { status, code });
}

function parseSearchList($: cheerio.CheerioAPI): SearchResult {
  const list: SearchItem[] = [];
  const $next = $('a.next');
  $('.entries .g-grid .g-block article section').each((_, el) => {
    const $el = $(el);
    const href = $el.find('a').attr('href');
    const id = href ? href.split('/').filter(Boolean).at(-1) || '' : '';
    if (!id) return;
    const name =
      $el.find('h2 a').text().trim() ||
      $el.find('h2').text().trim() ||
      $el.find('img').attr('alt')?.trim() ||
      '';
    if (!name) return;
    list.push({
      name,
      id,
      img: $el.find('img').attr('src') || '',
      rating: $el.find('.rating-wrapper span').text().trim()
    });
  });
  const nextHref = $next.attr('href');
  return {
    list,
    hasNextPage: !!nextHref,
    nextPage: nextHref ? parseInt(nextHref.split('/').filter(Boolean).at(-1) || '0', 10) || undefined : undefined
  };
}

export async function mcpSearch(query: string, page = 1): Promise<SearchResult> {
  if (!query || !query.trim()) throw httpError(400, 'INVALID_QUERY', 'Busca inválida.');
  if (!Number.isInteger(page) || page < 1) throw httpError(400, 'INVALID_PAGE', 'Página inválida.');
  const html = await fetchHtml(`${BASE}/page/${page}/?s=${encodeURIComponent(query.trim())}`);
  return parseSearchList(cheerio.load(html));
}

export async function mcpDetail(id: string): Promise<DetailResult> {
  if (!id || !id.trim()) throw httpError(400, 'INVALID_ID', 'Identificador inválido.');
  const clean = id.trim().replace(/^\/+|\/+$/g, '');
  const html = await fetchHtml(`${BASE}/${encodeURIComponent(clean)}/`);
  const $ = cheerio.load(html);
  const title = $('.entry-title').text().trim();
  if (!title) throw httpError(404, 'NOT_FOUND', 'Conteúdo não encontrado.');

  const info: DetailResult['info'] = {
    category: $('.categories .single-cat').text().trim(),
    postDate: $('.date').attr('content') || $('.date').text().trim(),
    author: $('.meta-author-link .author').text().trim()
  };

  const gallery: DetailResult['gallery'] = [];
  $('.entry-gallery div div div').each((_, el) => {
    const $el = $(el);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const isVideo = ((el as any).attribs?.itemtype || '').includes('Video');
    gallery.push({
      type: isVideo ? 'video' : 'image',
      img: $el.find('img').attr('src') || '',
      ...(isVideo
        ? {
            name: $el.find('[itemprop="name"]').attr('content') || '',
            postTime: $el.find('[itemprop="uploadDate"]').attr('content') || '',
            duration: $el.find('[itemprop="duration"]').attr('content') || null,
            video: $el.find('a[itemprop="embedUrl"]').attr('onclick')?.match(/src: '(.*?)'/)?.[1] || null
          }
        : {})
    });
  });

  const faq: DetailResult['faq'] = [];
  $('#faqs div details').each((_, el) => {
    const $el = $(el);
    faq.push({ question: $el.find('summary h3').text(), answer: $el.find('div p').text() });
  });

  $('.entry-footer-column').each((_, el) => {
    const $el = $(el);
    const $content = $el.find('.entry-footer-content');
    let label = $content.find('div').first().text().trim().replace(':', '');
    const value = $content.find('span').last().text().trim();
    if (!label) {
      label = $content
        .contents()
        .filter(function () {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          return (this as any).type === 'text';
        })
        .text()
        .trim()
        .replace(':', '');
    }
    if (label && value) {
      const key = label.toLowerCase().replace(/\s+/g, '_');
      if (!['categories', 'publication_date', 'author'].includes(key)) info[key] = value;
      if (label === 'Author' && info.author && value !== info.author) info['game_author'] = value;
    }
  });

  const list: DetailResult['list'] = [];
  $('#download-link table tbody tr').each((j, el) => {
    const $el = $(el);
    const tds = $el.find('td');
    let name: string | null = null;
    let version = 'N/A';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let formContainer: any = null;
    if (tds.length === 3) {
      name = $(tds[0]).text().trim();
      version = $(tds[1]).text().trim();
      formContainer = $(tds[2]);
    } else if (tds.length === 2) {
      name = $(tds[0]).text().trim();
      formContainer = $(tds[1]);
    }
    const files: DetailResult['list'][number]['files'] = [];
    if (formContainer) {
      formContainer.find('form').each((i: number, formEl: unknown) => {
        const $form = $(formEl as never);
        files.push({
          index: i + 1,
          type: $form.find('button').text().replace(/\s+/g, ' ').trim(),
          // O MCPEDL atual envia o id em <input name="file_id"> (POST p/ /show_file.php);
          // mantém-se o fallback p/ o formato antigo (id no action).
          id: parseInt(
            (($form.find('input[name="file_id"]').val() as string) || '').trim() ||
              $form.attr('action')?.split('/').filter(Boolean).at(-1) ||
              '0',
            10
          ),
          meta_title: ($form.find('input[name="post_title"]').val() as string) || null
        });
      });
    }
    if (name) list.push({ index: j + 1, name, version, files });
  });

  return {
    title,
    img: $('.post-thumbnail img').attr('src') || '',
    rating: {
      count: $('span[itemprop="ratingCount"]').text(),
      value: $('span[itemprop="ratingValue"]').text()
    },
    comment: $('span.comment-count').text(),
    content: $('section.entry-content div').text().trim(),
    info,
    gallery: gallery.filter((g) => g.img),
    faq: faq.filter((f) => f.question),
    list
  };
}

export async function mcpDownload(fileId: number): Promise<{ url: string }> {
  if (!Number.isInteger(fileId) || fileId <= 0) throw httpError(400, 'INVALID_DOWNLOAD_ID', 'Arquivo inválido.');
  const html = await fetchHtml(`${BASE}/dw_file.php?id=${fileId}`);
  const $ = cheerio.load(html);
  const url = $('a').attr('href');
  if (!url) throw httpError(502, 'DOWNLOAD_URL_NOT_FOUND', 'Não foi possível gerar o download agora.');
  return { url };
}

export async function mcpLatest(page = 1): Promise<LatestResult> {
  if (!Number.isInteger(page) || page < 1) throw httpError(400, 'INVALID_PAGE', 'Página inválida.');
  const html = await fetchHtml(`${BASE}/downloading/page/${page}/`);
  const $ = cheerio.load(html);
  const quick: LatestResult['quick'] = [];
  const list: SearchItem[] = [];
  $('.archive .dwbuttonslist div[style*="solid"]').each((_, el) => {
    const $el = $(el);
    const href = $el.find('a').attr('href');
    if (href) {
      quick.push({
        name: $el.find('span[style*="font-weight: 900"]').text(),
        id: href.replace(/\//g, ''),
        file: parseInt($el.find('form').attr('action')?.split('/').filter(Boolean).at(-1) || '0', 10)
      });
    }
  });
  $('.entries .g-grid .g-block article section').each((_, el) => {
    const $el = $(el);
    const href = $el.find('a').attr('href');
    const id = href ? href.split('/').filter(Boolean).at(-1) || '' : '';
    if (!id) return;
    const name =
      $el.find('h2 a').text().trim() ||
      $el.find('h2').text().trim() ||
      $el.find('img').attr('alt')?.trim() ||
      '';
    if (!name) return;
    list.push({
      name,
      id,
      img: $el.find('img').attr('src') || '',
      rating: $el.find('.rating-wrapper span').text().trim()
    });
  });
  return { quick, list };
}
