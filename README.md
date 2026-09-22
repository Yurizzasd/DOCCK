# DOCK — Catálogo de Addons para Minecraft Bedrock

Catálogo profissional e independente de **addons, mapas, texturas e scripts** para Minecraft Bedrock.
Identidade própria (preto profundo + âmbar + vermelho), rápido, responsivo e pronto para **GitHub + Cloudflare**.

> DOCK é um catálogo independente e **não possui vínculo oficial** com Mojang Studios, Microsoft ou MCPEDL.
> Os arquivos pertencem aos seus autores — o DOCK apenas organiza e redireciona para a fonte original.

## Stack

- **Frontend:** React 18 + TypeScript + Vite + Tailwind CSS + React Router
- **Backend:** Cloudflare Pages Functions (`functions/api/*`) + servidor Node espelho (`server/index.mjs`) para dev local
- **Fonte de dados:** API não oficial `terastudio-org/mcpedl` (scraping de mcpedl.org via `search`, `detail`, `download`, `mclatest`)

## Estrutura

```
src/
  components/  Header, Hero, ContentCard, CategoryGrid, Gallery, FaqAccordion, FileList, AdSlot, Pagination, Skeletons, States, Footer, Logo, SectionHeading
  pages/       Home, Catalog (/addons), Detail (/addon/:id), SearchResults (/search), Categories, About, NotFound
  services/    api.ts        → única camada que fala com /api/* (com cache + TTL)
  types/       mcpedl.ts     → tipos 1:1 com a API (search/detail/download/mclatest)
  utils/       format, debounce, cache, seo
  styles/      index.css
functions/api/
  _lib/mcpedl.ts  → port fiel da API p/ Workers (fetch+cheerio, mesmos seletores)
  _lib/cache.ts   → cache em memória + respostas JSON padronizadas
  latest.ts / search.ts / detail.ts / download.ts
server/index.mjs  → mesma API em Node puro p/ `npm run dev:api`
```

## API — métodos (verificados em `terastudio-org/mcpedl/src/index.ts`)

| Método | Origem | Retorno |
|---|---|---|
| `search(query, page=1)` | `GET mcpedl.org/page/{page}/?s={query}` | `{ list: [{name,id,img,rating}], hasNextPage, nextPage? }` |
| `detail(id)` | `GET mcpedl.org/{id}` | `{ title, img, rating{count,value}, comment, content, info{category,postDate,author,…}, gallery, faq, list[{name,version,files[{type,id}]}] }` |
| `download(fileId)` | `GET mcpedl.org/dw_file.php?id={id}` → `<a href>` | `{ url }` |
| `mclatest(page=1)` | `GET mcpedl.org/downloading/page/{page}/` | `{ quick[{name,id,file}], list[] }` |

> **Nota de compatibilidade (verificado em 2026-09-22):** o MCPEDL mudou os formulários da
> página de detalhes para `POST /show_file.php` com o id em `<input name="file_id">`
> (antes o id vinha no `action` do form). O parser do DOCK lê `file_id` com fallback para o
> formato antigo. O endpoint `dw_file.php?id=` continua retornando a URL direta do arquivo.
> Títulos de cards usam fallback `h2 a → h2 → img alt`, pois alguns cards não têm `h2`.

Rate limit respeitado: ~1 req/900ms–1s, retry com backoff, timeout 15s.

## Instalação

```bash
npm install
cp .env.example .env   # opcional em dev
```

## Execução local

```bash
# terminal 1 — API local (porta 8788)
npm run dev:api
# terminal 2 — frontend (porta 5173, com proxy /api → 8788)
npm run dev
```

Acesse `http://localhost:5173`.

## Build / preview

```bash
npm run build
npm run preview
```

## Deploy — Cloudflare Pages (recomendado)

1. Suba o repo no GitHub.
2. Cloudflare Dashboard → **Pages → Create → Connect to Git**.
3. Build: `npm run build` · Output: `dist`.
4. As `functions/api/*` viram rotas `/api/*` automaticamente (sem servidor dedicado).
5. Variáveis (opcional): `VITE_SITE_URL`, `VITE_ADS_ENABLED=false`.

## Deploy alternativo — backend Node

Se preferir um backend tradicional, rode `server/index.mjs` (ou adapte p/ Express) e aponte
`VITE_API_URL=https://sua-api` no frontend. O contrato `/api/*` é idêntico.

## Anúncios (`<AdSlot />`)

- Componente: `src/components/AdSlot.tsx` — ponto único de troca AdCash ↔ AdSense.
- Placeholders neutros enquanto `VITE_ADS_ENABLED=false`; nunca cobrem o botão de download.
- Para ativar: implemente a injeção do script do provedor dentro de `AdSlot` e defina `VITE_ADS_ENABLED=true`.

## SEO

Title/description dinâmicos, canonical, Open Graph, Twitter Cards, JSON-LD (`SoftwareApplication`)
na página do addon, `robots.txt`, `sitemap.xml`, URLs amigáveis `/addon/:id`.

## Cache

| Camada | Recente/busca | Detalhe | Download |
|---|---|---|---|
| Backend | 5 min / 2 min | 30 min | **nunca** |
| Frontend | 5 min / 2 min (sessionStorage) | 30 min | **nunca** |

## Testes manuais (checklist)

- [ ] Home carrega destaques + recentes
- [ ] `/addons` pagina, filtra e ordena
- [ ] `/search?q=vein+miner` com debounce
- [ ] `/addon/:id` mostra galeria, FAQ, arquivos e informações
- [ ] Download abre URL real em nova aba; falha mostra mensagem amigável
- [ ] Estados loading/empty/error/404
- [ ] Mobile (menu, grid 1–2 col) e desktop
- [ ] `npm run build` sem erros
