import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Gallery from '../components/Gallery';
import FaqAccordion from '../components/FaqAccordion';
import FileList from '../components/FileList';
import AdSlot from '../components/AdSlot';
import { DetailSkeleton } from '../components/Skeletons';
import { ErrorState } from '../components/States';
import { api } from '../services/api';
import type { DetailResult } from '../types/mcpedl';
import { friendlyDate, truncate } from '../utils/format';
import { setPageMeta } from '../utils/seo';

export default function Detail() {
  const { id = '' } = useParams();
  const [data, setData] = useState<DetailResult | null>(null);
  const [status, setStatus] = useState<'loading' | 'ok' | 'error' | 'notfound'>('loading');
  const [downloading, setDownloading] = useState(false);
  const [dlError, setDlError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    setStatus('loading');
    setDlError(null);
    api
      .detail(id)
      .then((d) => {
        if (!alive) return;
        setData(d);
        setStatus('ok');
        setPageMeta({
          title: `${d.title} — DOCK`,
          description: truncate(d.content || `Baixe ${d.title} para Minecraft Bedrock.`, 160),
          path: `/addon/${id}`,
          image: d.img || undefined,
          jsonLd: {
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: d.title,
            applicationCategory: 'GameMod',
            operatingSystem: 'Minecraft Bedrock',
            author: d.info?.author ? { '@type': 'Person', name: String(d.info.author) } : undefined,
            aggregateRating:
              d.rating?.value && d.rating?.count
                ? { '@type': 'AggregateRating', ratingValue: d.rating.value, ratingCount: d.rating.count }
                : undefined
          }
        });
      })
      .catch((e: Error & { status?: number }) => {
        if (!alive) return;
        setStatus(e?.status === 404 ? 'notfound' : 'error');
      });
    return () => {
      alive = false;
    };
  }, [id]);

  async function primaryDownload() {
    const firstFile = data?.list?.[0]?.files?.[0];
    if (!firstFile) {
      setDlError('Este conteúdo não possui arquivos para download no momento.');
      return;
    }
    setDlError(null);
    setDownloading(true);
    try {
      const { url } = await api.download(firstFile.id);
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch {
      setDlError('Não foi possível gerar o download agora. Tente novamente em alguns instantes.');
    } finally {
      setDownloading(false);
    }
  }

  if (status === 'loading') return <DetailSkeleton />;
  if (status === 'error') {
    return (
      <main className="mx-auto max-w-6xl px-4 py-10">
        <ErrorState onRetry={() => window.location.reload()} />
      </main>
    );
  }
  if (status === 'notfound' || !data) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-16 text-center">
        <p className="font-display text-3xl font-bold text-white">Conteúdo não encontrado</p>
        <p className="mx-auto mt-2 max-w-md text-sm text-zinc-500">
          O addon pode ter sido removido da fonte ou o endereço está incorreto.
        </p>
        <Link to="/addons" className="mt-6 inline-block rounded-lg bg-brand-400 px-5 py-2.5 text-sm font-semibold text-black">
          Voltar ao catálogo
        </Link>
      </main>
    );
  }

  const paragraphs = data.content ? data.content.split(/\n{2,}|\r\n\r\n/).slice(0, 6) : [];

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <nav className="mb-4 text-[13px] text-zinc-500" aria-label="Trilha">
        <Link to="/" className="hover:text-zinc-200">Início</Link>
        <span className="mx-2">/</span>
        <Link to="/addons" className="hover:text-zinc-200">Addons</Link>
        <span className="mx-2">/</span>
        <span className="text-zinc-300">{truncate(data.title, 48)}</span>
      </nav>

      <div className="overflow-hidden rounded-xl2 border border-white/[0.08] bg-ink-850">
        {data.img && (
          <div className="relative aspect-[21/9] overflow-hidden bg-ink-700">
            <img src={data.img} alt={data.title} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-850 via-transparent to-transparent" />
          </div>
        )}
        <div className="p-5 md:p-7">
          <div className="flex flex-wrap items-center gap-2 text-[12px]">
            {data.info?.category && (
              <span className="rounded-md bg-brand-400/15 px-2.5 py-1 font-semibold text-brand-300 ring-1 ring-brand-400/25">
                {String(data.info.category)}
              </span>
            )}
            <span className="rounded-md bg-white/[0.06] px-2.5 py-1 text-zinc-300">
              ★ {data.rating?.value || '—'} ({data.rating?.count || '0'})
            </span>
            {data.info?.postDate && (
              <span className="rounded-md bg-white/[0.06] px-2.5 py-1 text-zinc-400">
                {friendlyDate(String(data.info.postDate))}
              </span>
            )}
          </div>

          <h1 className="font-display mt-3 text-2xl font-bold leading-tight text-white md:text-[32px]">
            {data.title}
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            por <strong className="text-zinc-200">{String(data.info?.author || 'Autor desconhecido')}</strong>
            {data.comment && <span className="text-zinc-600"> · {data.comment} comentários</span>}
          </p>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              onClick={primaryDownload}
              disabled={downloading}
              className="h-12 rounded-xl bg-brand-400 px-8 text-[15px] font-bold text-black shadow-glow transition hover:bg-brand-300 active:scale-[0.98] disabled:opacity-60"
            >
              {downloading ? 'Gerando download…' : '⬇ DOWNLOAD'}
            </button>
            <p className="text-[12.5px] text-zinc-500">
              Download redirecionado para a fonte original. O DOCK não hospeda arquivos.
            </p>
          </div>
          {dlError && (
            <p className="mt-3 rounded-lg border border-ember-600/30 bg-ember-600/10 px-3 py-2.5 text-sm" role="alert">
              {dlError}
            </p>
          )}
        </div>
      </div>

      <div className="mt-6"><AdSlot slot="detail-top" /></div>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-8">
          <section aria-label="Descrição" className="rounded-xl2 border border-white/[0.08] bg-ink-850 p-5 md:p-6">
            <h2 className="font-display mb-3 text-lg font-bold text-white">Descrição</h2>
            <div className="prose-dock">
              {paragraphs.length ? paragraphs.map((p, i) => <p key={i}>{truncate(p, 1200)}</p>) : (
                <p>Descrição indisponível para este conteúdo.</p>
              )}
            </div>
          </section>
          <Gallery items={data.gallery} />
          <FaqAccordion faq={data.faq} />
        </div>
        <aside className="space-y-6">
          <div className="rounded-xl2 border border-white/[0.08] bg-ink-850 p-5">
            <h2 className="font-display mb-3 text-[15px] font-bold text-white">Informações</h2>
            <dl className="space-y-2.5 text-sm">
              {(() => {
                const priority = ['category', 'author', 'postdate', 'post_date', 'version', 'game_version', 'downloads'];
                const entries = Object.entries(data.info || {});
                const norm = (k: string) => k.toLowerCase().replace(/\s+/g, '_');
                const sorted = [...entries].sort((a, b) => {
                  const ia = priority.indexOf(norm(a[0]));
                  const ib = priority.indexOf(norm(b[0]));
                  return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
                });
                return sorted.slice(0, 6).map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-3 border-b border-white/[0.05] pb-2 last:border-0">
                    <dt className="capitalize text-zinc-500">{k.replace(/_/g, ' ')}</dt>
                    <dd className="text-right text-zinc-200">{truncate(String(v ?? '—'), 40)}</dd>
                  </div>
                ));
              })()}
            </dl>
          </div>
          <FileList files={data.list} />
          <AdSlot slot="detail-side" />
        </aside>
      </div>
    </main>
  );
}
