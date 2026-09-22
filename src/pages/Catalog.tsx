import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import SectionHeading from '../components/SectionHeading';
import ContentCard from '../components/ContentCard';
import Pagination from '../components/Pagination';
import AdSlot from '../components/AdSlot';
import { GridSkeleton } from '../components/Skeletons';
import { Empty, ErrorState } from '../components/States';
import { api } from '../services/api';
import type { SearchItem } from '../types/mcpedl';
import { debounce } from '../utils/debounce';
import { ratingToNumber } from '../utils/format';
import { setPageMeta } from '../utils/seo';

type Sort = 'recent' | 'rating' | 'az';

export default function Catalog() {
  const [params, setParams] = useSearchParams();
  const q = params.get('q') || '';
  const page = Math.max(1, parseInt(params.get('page') || '1', 10) || 1);
  const sortParam = (params.get('sort') as Sort) || 'recent';

  const [draft, setDraft] = useState(q);
  const [items, setItems] = useState<SearchItem[]>([]);
  const [hasNext, setHasNext] = useState(false);
  const [status, setStatus] = useState<'loading' | 'ok' | 'error'>('loading');

  useEffect(() => {
    setPageMeta({ title: 'Addons — DOCK', description: 'Explore o catálogo de addons, mapas e texturas para Minecraft Bedrock.', path: '/addons' });
  }, []);

  useEffect(() => setDraft(q), [q]);

  const applySearch = useMemo(
    () =>
      debounce((value: string) => {
        const next = new URLSearchParams(params);
        if (value.trim()) next.set('q', value.trim());
        else next.delete('q');
        next.set('page', '1');
        setParams(next, { replace: false });
      }, 450),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [params.toString()]
  );

  useEffect(() => {
    let alive = true;
    setStatus('loading');
    api
      .catalog({ q, page })
      .then((d) => {
        if (!alive) return;
        setItems(d.list);
        setHasNext(d.hasNextPage);
        setStatus('ok');
      })
      .catch(() => alive && setStatus('error'));
    return () => {
      alive = false;
    };
  }, [q, page]);

  const visible = useMemo(() => {
    const arr = [...items];
    if (sortParam === 'rating') arr.sort((a, b) => ratingToNumber(b.rating) - ratingToNumber(a.rating));
    if (sortParam === 'az') arr.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
    return arr;
  }, [items, sortParam]);

  function set(key: string, value: string) {
    const next = new URLSearchParams(params);
    next.set(key, value);
    if (key !== 'page') next.set('page', '1');
    setParams(next);
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <SectionHeading kicker="Catálogo" title="Addons" hint="Grid performático com busca, ordenação e paginação." />

      <div className="mb-5 flex flex-col gap-3 rounded-xl2 border border-white/[0.08] bg-ink-850 p-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <input
            value={draft}
            onChange={(e) => {
              setDraft(e.target.value);
              applySearch(e.target.value);
            }}
            placeholder="Filtrar no catálogo… (ex.: vein miner)"
            aria-label="Filtrar catálogo"
            className="h-11 w-full rounded-lg border border-white/10 bg-ink-800 pl-10 pr-3 text-sm outline-none focus:border-brand-400/60"
          />
          <svg viewBox="0 0 20 20" className="absolute left-3 top-3.5 h-4 w-4 text-zinc-500" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="9" cy="9" r="6" /><path d="M13.5 13.5L17 17" />
          </svg>
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="sort" className="text-[13px] text-zinc-500">Ordenar</label>
          <select
            id="sort"
            value={sortParam}
            onChange={(e) => set('sort', e.target.value)}
            className="h-11 rounded-lg border border-white/10 bg-ink-800 px-3 text-sm text-zinc-200 outline-none"
          >
            <option value="recent">Mais recentes</option>
            <option value="rating">Melhor avaliados</option>
            <option value="az">A–Z</option>
          </select>
        </div>
      </div>

      {status === 'loading' && <GridSkeleton count={12} />}
      {status === 'error' && <ErrorState onRetry={() => setParams(params)} />}
      {status === 'ok' && !visible.length && (
        <Empty title="Nenhum addon encontrado." hint="Ajuste o termo da busca ou volte para a primeira página." />
      )}
      {status === 'ok' && !!visible.length && (
        <>
          <p className="mb-3 text-[13px] text-zinc-500" aria-live="polite">
            {visible.length} resultado(s) · página {page}
            {q && <> para “<strong className="text-zinc-300">{q}</strong>”</>}
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visible.map((item, i) => (
              <div key={item.id}>
                <ContentCard item={item} />
                {i === 3 && (
                  <div className="mt-4 sm:hidden"><AdSlot slot="catalog-infeed" label="Anúncio" /></div>
                )}
              </div>
            ))}
          </div>
          <Pagination page={page} hasNext={hasNext} onPage={(p) => { set('page', String(p)); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />
        </>
      )}
    </main>
  );
}
