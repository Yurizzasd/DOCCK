// Servidor local de desenvolvimento da API (espelho das Functions do Cloudflare).
// Uso: npm run dev:api  (sobe em http://localhost:8788)
// O Vite faz proxy de /api -> 8788 (ver vite.config.ts).
// Em produção (Cloudflare Pages), as functions/api/*.ts assumem automaticamente.

import http from 'node:http';
import { load as cheerioLoad } from 'cheerio';

const BASE = 'https://mcpedl.org';
const UA = 'Mozilla/5.0 (compatible; DOCK/1.0; local-dev)';
const PORT = 8788;

let lastHit = 0;
async function throttle() {
  const wait = 900 - (Date.now() - lastHit);
  if (wait > 0) await new Promise((r) => setTimeout(r, wait));
  lastHit = Date.now();
}

const mem = new Map();
function cget(k) {
  const e = mem.get(k);
  if (!e || Date.now() > e.exp) { mem.delete(k); return null; }
  return e.body;
}
function cset(k, body, ttl) { mem.set(k, { body, exp: Date.now() + ttl }); }

async function fetchHtml(url, retries = 2) {
  let last;
  for (let a = 0; a <= retries; a++) {
    await throttle();
    try {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), 15000);
      const res = await fetch(url, { signal: ctrl.signal, headers: { 'User-Agent': UA } }).finally(() => clearTimeout(t));
      if (res.status === 404) throw Object.assign(new Error('Conteúdo não encontrado.'), { status: 404 });
      if (res.status === 429) throw Object.assign(new Error('Muitas requisições. Aguarde.'), { status: 429 });
      if (!res.ok) throw Object.assign(new Error('Falha ao consultar a origem.'), { status: res.status });
      return await res.text();
    } catch (e) { last = e; if (last?.status === 404 || last?.status === 429) throw last; if (a < retries) await new Promise((r) => setTimeout(r, 1200 * (a + 1))); }
  }
  throw last;
}

function parseSearchList($) {
  const list = [];
  const $next = $('a.next');
  $('.entries .g-grid .g-block article section').each((_, el) => {
    const $el = $(el);
    const href = $el.find('a').attr('href');
    const sid = href ? href.split('/').filter(Boolean).at(-1) || '' : '';
    if (!sid) return;
    const sname = $el.find('h2 a').text().trim() || $el.find('h2').text().trim() || $el.find('img').attr('alt')?.trim() || '';
    if (!sname) return;
    list.push({ name: sname, id: sid, img: $el.find('img').attr('src') || '', rating: $el.find('.rating-wrapper span').text().trim() });
  });
  const nh = $next.attr('href');
  return { list, hasNextPage: !!nh, nextPage: nh ? parseInt(nh.split('/').filter(Boolean).at(-1) || '0', 10) || undefined : undefined };
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  res.setHeader('content-type', 'application/json; charset=utf-8');
  res.setHeader('access-control-allow-origin', '*');
  try {
    if (url.pathname === '/api/latest') {
      const page = Math.max(1, parseInt(url.searchParams.get('page') || '1', 10) || 1);
      const key = `latest:${page}`;
      const hit = cget(key);
      if (hit) return res.end(hit);
      const html = await fetchHtml(`${BASE}/downloading/page/${page}/`);
      const $ = cheerioLoad(html);
      const quick = [];
      $('.archive .dwbuttonslist div[style*="solid"]').each((_, el) => {
        const $el = $(el);
        const href = $el.find('a').attr('href');
        if (href) quick.push({ name: $el.find('span[style*="font-weight: 900"]').text(), id: href.replace(/\//g, ''), file: parseInt($el.find('form').attr('action')?.split('/').filter(Boolean).at(-1) || '0', 10) });
      });
      const { list } = parseSearchList($);
      const body = JSON.stringify({ quick, list });
      cset(key, body, 5 * 60 * 1000);
      return res.end(body);
    }
    if (url.pathname === '/api/search') {
      const q = (url.searchParams.get('q') || '').trim();
      const page = Math.max(1, parseInt(url.searchParams.get('page') || '1', 10) || 1);
      if (!q) { res.statusCode = 400; return res.end(JSON.stringify({ error: 'Informe o termo da busca.' })); }
      const key = `search:${q.toLowerCase()}:${page}`;
      const hit = cget(key);
      if (hit) return res.end(hit);
      const html = await fetchHtml(`${BASE}/page/${page}/?s=${encodeURIComponent(q)}`);
      const body = JSON.stringify(parseSearchList(cheerioLoad(html)));
      cset(key, body, 2 * 60 * 1000);
      return res.end(body);
    }
    if (url.pathname === '/api/detail') {
      const id = (url.searchParams.get('id') || '').trim().replace(/^\/+|\/+$/g, '');
      if (!id) { res.statusCode = 400; return res.end(JSON.stringify({ error: 'Identificador inválido.' })); }
      const key = `detail:${id.toLowerCase()}`;
      const hit = cget(key);
      if (hit) return res.end(hit);
      const html = await fetchHtml(`${BASE}/${encodeURIComponent(id)}/`);
      const $ = cheerioLoad(html);
      const title = $('.entry-title').text().trim();
      if (!title) { res.statusCode = 404; return res.end(JSON.stringify({ error: 'Conteúdo não encontrado.' })); }
      const info = { category: $('.categories .single-cat').text().trim(), postDate: $('.date').attr('content') || $('.date').text().trim(), author: $('.meta-author-link .author').text().trim() };
      const gallery = [];
      $('.entry-gallery div div div').each((_, el) => { const $el = $(el); const img = $el.find('img').attr('src') || ''; if (img) gallery.push({ type: 'image', img }); });
      const faq = [];
      $('#faqs div details').each((_, el) => { const $el = $(el); const question = $el.find('summary h3').text(); const answer = $el.find('div p').text(); if (question) faq.push({ question, answer }); });
      const list = [];
      $('#download-link table tbody tr').each((j, el) => {
        const $el = $(el); const tds = $el.find('td');
        let name = null, version = 'N/A', fc = null;
        if (tds.length === 3) { name = $(tds[0]).text().trim(); version = $(tds[1]).text().trim(); fc = $(tds[2]); }
        else if (tds.length === 2) { name = $(tds[0]).text().trim(); fc = $(tds[1]); }
        const files = [];
        if (fc) fc.find('form').each((i, f) => { const $f = $(f); const rawId = (($f.find('input[name="file_id"]').val() || '') + '').trim() || ($f.attr('action') || '').split('/').filter(Boolean).at(-1) || '0'; files.push({ index: i + 1, type: $f.find('button').text().replace(/\s+/g, ' ').trim(), id: parseInt(rawId, 10), meta_title: $f.find('input[name="post_title"]').val() || null }); });
        if (name) list.push({ index: j + 1, name, version, files });
      });
      const body = JSON.stringify({ title, img: $('.post-thumbnail img').attr('src') || '', rating: { count: $('span[itemprop="ratingCount"]').text(), value: $('span[itemprop="ratingValue"]').text() }, comment: $('span.comment-count').text(), content: $('section.entry-content div').text().trim(), info, gallery, faq, list });
      cset(key, body, 30 * 60 * 1000);
      return res.end(body);
    }
    if (url.pathname === '/api/download') {
      const id = parseInt(url.searchParams.get('id') || '0', 10);
      if (!Number.isInteger(id) || id <= 0) { res.statusCode = 400; return res.end(JSON.stringify({ error: 'Arquivo inválido.' })); }
      const html = await fetchHtml(`${BASE}/dw_file.php?id=${id}`);
      const $ = cheerioLoad(html);
      const durl = $('a').attr('href');
      if (!durl) { res.statusCode = 502; return res.end(JSON.stringify({ error: 'Não foi possível gerar o download agora. Tente novamente em alguns instantes.' })); }
      return res.end(JSON.stringify({ url: durl }));
    }
    if (url.pathname === '/api/health') return res.end(JSON.stringify({ ok: true }));
    res.statusCode = 404;
    return res.end(JSON.stringify({ error: 'Rota não encontrada.' }));
  } catch (e) {
    res.statusCode = e?.status || 500;
    res.end(JSON.stringify({ error: e?.status && e.status < 500 ? e.message : 'Não conseguimos carregar os conteúdos agora.' }));
  }
});

server.listen(PORT, () => console.log(`[dock api] http://localhost:${PORT}`));
