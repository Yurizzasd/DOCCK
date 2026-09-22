const SITE = (import.meta.env.VITE_SITE_URL as string) || '';

export function setPageMeta(opts: {
  title: string;
  description: string;
  path?: string;
  image?: string;
  jsonLd?: Record<string, unknown>;
}): void {
  document.title = opts.title;
  upsert('meta[name="description"]', { name: 'description', content: opts.description });
  upsert('meta[property="og:title"]', { property: 'og:title', content: opts.title });
  upsert('meta[property="og:description"]', { property: 'og:description', content: opts.description });
  if (opts.path && SITE) {
    upsert('link[rel="canonical"]', { rel: 'canonical', href: SITE.replace(/\/$/, '') + opts.path });
    upsert('meta[property="og:url"]', { property: 'og:url', content: SITE.replace(/\/$/, '') + opts.path });
  }
  if (opts.image) upsert('meta[property="og:image"]', { property: 'og:image', content: opts.image });
  const old = document.getElementById('dock-jsonld');
  if (old) old.remove();
  if (opts.jsonLd) {
    const s = document.createElement('script');
    s.type = 'application/ld+json';
    s.id = 'dock-jsonld';
    s.textContent = JSON.stringify(opts.jsonLd);
    document.head.appendChild(s);
  }
}

function upsert(selector: string, attrs: Record<string, string>): void {
  let el = document.head.querySelector(selector) as HTMLElement | null;
  if (!el) {
    el = document.createElement(selector.startsWith('link') ? 'link' : 'meta');
    document.head.appendChild(el);
  }
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
}
