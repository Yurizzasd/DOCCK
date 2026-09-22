import { useEffect, useState } from 'react';
import Hero from '../components/Hero';
import HowItWorks from '../components/HowItWorks';
import SectionHeading from '../components/SectionHeading';
import ContentCard from '../components/ContentCard';
import CategoryGrid from '../components/CategoryGrid';
import CtaBand from '../components/CtaBand';
import AdSlot from '../components/AdSlot';
import Pagination from '../components/Pagination';
import { GridSkeleton } from '../components/Skeletons';
import { Empty, ErrorState } from '../components/States';
import { api } from '../services/api';
import type { LatestResult } from '../types/mcpedl';
import { setPageMeta } from '../utils/seo';

export default function Home() {
  const [data, setData] = useState<LatestResult | null>(null);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<'loading' | 'ok' | 'error'>('loading');

  useEffect(() => {
    setPageMeta({
      title: 'DOCK — Addons, Mapas e Texturas para Minecraft Bedrock',
      description: 'DOCK é um catálogo independente de addons, mapas, texturas e scripts para Minecraft Bedrock. Encontre o próximo addon para o seu mundo.',
      path: '/'
    });
  }, []);

  useEffect(() => {
    let alive = true;
    setStatus('loading');
    api
      .latest(page)
      .then((d) => alive && (setData(d), setStatus('ok')))
      .catch(() => alive && setStatus('error'));
    return () => {
      alive = false;
    };
  }, [page]);

  const featured = data?.list.slice(0, 4) ?? [];
  const recent = data?.list.slice(4) ?? [];

  return (
    <div>
      <Hero />
      <HowItWorks />
      <main className="mx-auto max-w-6xl px-4">
        <section className="pt-10" aria-label="Destaques">
          <SectionHeading kicker="Curadoria" title="Destaques" hint="Seleção dos conteúdos mais recentes do catálogo." linkTo="/addons" />
          {status === 'loading' && <GridSkeleton count={4} />}
          {status === 'error' && <ErrorState onRetry={() => setPage((p) => p)} />}
          {status === 'ok' && !featured.length && <Empty title="Nenhum addon encontrado." hint="Tente novamente em alguns instantes." />}
          {status === 'ok' && !!featured.length && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {featured.map((item) => (
                <div key={item.id} className="reveal"><ContentCard item={item} /></div>
              ))}
            </div>
          )}
        </section>

        <div className="mt-8">
          <AdSlot slot="home-banner" />
        </div>

        <section className="pt-10" aria-label="Categorias">
          <SectionHeading kicker="Explorar" title="Categorias" hint="Atalhos visuais para cada tipo de conteúdo." />
          <CategoryGrid />
          <CtaBand />
        </section>

        <section className="pt-10" aria-label="Mais recentes">
          <SectionHeading kicker="Atualizado" title="Mais recentes" hint="Direto da fonte, com paginação progressiva." />
          {status === 'loading' && <GridSkeleton count={8} />}
          {status === 'ok' && (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {(recent.length ? recent : featured).map((item) => (
                  <ContentCard key={item.id} item={item} />
                ))}
              </div>
              <Pagination page={page} hasNext={(data?.list.length ?? 0) > 0} onPage={(p) => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />
            </>
          )}
        </section>
      </main>
    </div>
  );
}
