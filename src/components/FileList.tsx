import { useState } from 'react';
import type { DownloadItem } from '../types/mcpedl';
import { api } from '../services/api';

export default function FileList({ files }: { files: DownloadItem[] }) {
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!files.length) return null;

  async function handleDownload(fileId: number) {
    setError(null);
    setLoadingId(fileId);
    try {
      const { url } = await api.download(fileId);
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch {
      setError('Não foi possível gerar o download agora. Tente novamente em alguns instantes.');
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <section aria-label="Arquivos disponíveis">
      <h2 className="font-display mb-3 text-lg font-bold text-white">Arquivos disponíveis</h2>
      <div className="space-y-3">
        {files.map((pack) => (
          <div key={pack.index} className="rounded-xl2 border border-white/[0.08] bg-ink-850 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-[15px] font-semibold text-white">{pack.name}</p>
              <span className="rounded-md bg-white/[0.06] px-2 py-1 text-[12px] font-medium text-zinc-400">
                {pack.version}
              </span>
            </div>
            <div className="mt-3 space-y-2">
              {pack.files.map((f) => (
                <div key={`${f.id}-${f.index}`} className="flex items-center justify-between gap-3 rounded-lg bg-ink-800 px-3 py-2.5">
                  <span className="min-w-0 truncate text-sm text-zinc-300">{f.type || 'Download'}</span>
                  {Number.isInteger(f.id) && f.id > 0 ? (
                    <button
                      onClick={() => handleDownload(f.id)}
                      disabled={loadingId === f.id}
                      className="shrink-0 rounded-lg bg-brand-400 px-4 py-2 text-[13px] font-semibold text-black transition hover:bg-brand-300 disabled:opacity-60"
                    >
                      {loadingId === f.id ? 'Gerando…' : 'Download'}
                    </button>
                  ) : (
                    <span className="shrink-0 text-[12px] text-zinc-600">indisponível</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      {error && (
        <p className="mt-3 rounded-lg border border-ember-600/30 bg-ember-600/10 px-3 py-2.5 text-sm text-zinc-200" role="alert">
          {error}
        </p>
      )}
      <p className="mt-3 text-[12.5px] text-zinc-600">
        Os arquivos são obtidos da fonte original via API e abertos em nova aba. O DOCK não hospeda os arquivos.
      </p>
    </section>
  );
}
