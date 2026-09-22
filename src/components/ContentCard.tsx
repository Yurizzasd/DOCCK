import { Link } from 'react-router-dom';
import type { SearchItem } from '../types/mcpedl';
import { buildDetailPath, formatRating } from '../utils/format';

export default function ContentCard({ item }: { item: SearchItem }) {
  return (
    <article className="card-lift group overflow-hidden rounded-2xl border border-white/[0.08] bg-ink-850 shadow-card hover:border-brand-400/50">
      <Link to={buildDetailPath(item.id)} className="block" aria-label={item.name}>
        <div className="relative aspect-[16/10] overflow-hidden bg-ink-700">
          {item.img ? (
            <img
              src={item.img}
              alt={item.name}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.05]"
            />
          ) : (
            <div className="grid h-full w-full place-items-center text-zinc-600">sem imagem</div>
          )}
          {item.rating && (
            <span className="absolute left-3 top-3 rounded-lg bg-black/75 px-2.5 py-1 text-xs font-bold text-brand-300 ring-1 ring-white/10 backdrop-blur">
              ★ {formatRating(item.rating)}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between gap-3 p-4">
          <h3 className="line-clamp-2 min-h-[2.7em] flex-1 text-[15px] font-semibold leading-snug text-zinc-100 group-hover:text-white">
            {item.name}
          </h3>
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/10 text-zinc-400 transition group-hover:border-brand-400 group-hover:bg-brand-400 group-hover:text-black" aria-hidden="true">
            →
          </span>
        </div>
      </Link>
    </article>
  );
}
