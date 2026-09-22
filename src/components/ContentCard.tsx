import { Link } from 'react-router-dom';
import type { SearchItem } from '../types/mcpedl';
import { buildDetailPath, formatRating } from '../utils/format';

function Stars({ value }: { value: string }) {
  const n = parseFloat(String(value).replace(',', '.'));
  const filled = Number.isFinite(n) ? Math.round(n) : 0;
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`Avaliação ${value || '—'}`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} viewBox="0 0 12 12" className={`h-3 w-3 ${i <= filled ? 'text-brand-400' : 'text-zinc-700'}`} fill="currentColor" aria-hidden="true">
          <path d="M6 0l1.5 3.6 3.9.3-3 2.5.9 3.8L6 8.2 2.7 10.2l.9-3.8-3-2.5 3.9-.3z" />
        </svg>
      ))}
    </span>
  );
}

export default function ContentCard({ item }: { item: SearchItem }) {
  return (
    <article className="card-lift group overflow-hidden rounded-xl2 border border-white/[0.08] bg-ink-850 shadow-card hover:border-brand-400/40 hover:shadow-glow">
      <Link to={buildDetailPath(item.id)} className="block" aria-label={item.name}>
        <div className="relative aspect-[16/9] overflow-hidden bg-ink-700">
          {item.img ? (
            <img
              src={item.img}
              alt={item.name}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
            />
          ) : (
            <div className="grid h-full w-full place-items-center text-zinc-600">sem imagem</div>
          )}
          <span className="absolute left-2.5 top-2.5 rounded-md bg-black/70 px-2 py-1 text-[11px] font-semibold text-brand-300 ring-1 ring-white/10 backdrop-blur">
            {formatRating(item.rating)} ★
          </span>
        </div>
        <div className="p-3.5">
          <h3 className="line-clamp-2 min-h-[2.6em] text-[14.5px] font-semibold leading-snug text-zinc-100 group-hover:text-white">
            {item.name}
          </h3>
          <div className="mt-2 flex items-center justify-between">
            <Stars value={item.rating} />
            <span className="text-[12px] font-medium text-brand-400/90 transition group-hover:text-brand-300">
              Ver detalhes →
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
