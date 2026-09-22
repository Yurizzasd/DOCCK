import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import SectionHeading from '../components/SectionHeading';
import ContentCard from '../components/ContentCard';
import Pagination from '../components/Pagination';
import { GridSkeleton } from '../components/Skeletons';
import { Empty, ErrorState } from '../components/States';
import { api } from '../services/api';
import type { SearchResult } from '../types/mcpedl';
import { setPageMeta } from '../utils/seo';

export default function SearchResults() {
  const [params, setParams] = useSearchParams();
  const q = params.get('q') || '';
  const page = Math.max(1, parseInt(params.get('page') || '1', 10) || 1);
  const [data, setData] = useState<SearchResult | null>(null);
  const [status, setStatus] = useState<'loading' | 'ok' | 'error'>('loading');

  useEffect(() => {
    setPageMeta({ title: q ? `Busca: ${q} — DOCK` : 'Buscar — DOCK', description: `Resultados para ${q} no catálogo DOCK.`, path: '/search' });
  }, [q]);

  useEffect(() => {
    if (!q.trim()) {
      setStatus('ok');
      setData({ list: [], hasNextPage: false });
      return;
    }
    let alive = true;
    setStatus('loading');
    api
      .search(q, page)
      .then((d) => alive && (setData(d), setStatus('ok')))
      .catch(() => alive && setStatus('error'));
    return () => {
      alive = false;
    };
  }, [q, page]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <SectionHeading
        title={q ? `Resultados para “${q}”` : 'Buscar'}
        hint="Consulta em tempo real à fonte, com debounce e cache curto."
      />
      {status === 'loading' && <GridSkeleton count={8} />}
      {status === 'error' && <ErrorState onRetry={() => setParams(params)} />}
      {status === 'ok' && !data?.list.length && (
        <Empty title="Nenhum addon encontrado." hint="Tente outro termo, como o nome exato do addon em inglês." />
      )}
      {status === 'ok' && !!data?.list.length && (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {data.list.map((item) => (
              <ContentCard key={item.id} item={item} />
            ))}
          </div>
          <Pagination
            page={page}
            hasNext={!!data?.hasNextPage}
            onPage={(p) => {
              const next = new URLSearchParams(params);
              next.set('page', String(p));
              setParams(next);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        </>
      )}
    </main>
  );
}
