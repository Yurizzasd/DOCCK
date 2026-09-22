import { Link } from 'react-router-dom';
import type { SearchItem } from '../types/mcpedl';
import { buildDetailPath, formatRating } from '../utils/format';

// As thumbs vêm do CDN do MCPEDL (não temos como trocá-las), então o card
// valoriza ao máximo a apresentação: título sobre a imagem com overlay,
// selo de avaliação e zoom no hover.
export default function ContentCard({ item }: { item: SearchItem }) {
  return (
    <article className="card-lift group overflow-hidden rounded-2xl border border-white/[0.08] bg-ink-850 shadow-card hover:border-brand-400/50 hover:shadow-glow">
      <Link to={buildDetailPath(item.id)} className="block" aria-label={item.name}>
        <div className="relative aspect-[16/10] overflow-hidden bg-ink-700">
          {item.img ? (
            <img
              src={item.img}
              alt={item.name}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.06]"
            />
          ) : (
            <div className="grid h-full w-full place-items-center text-zinc-600">sem imagem</div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" aria-hidden="true" />
          {item.rating && (
            <span className="absolute left-3 top-3 rounded-lg bg-black/75 px-2.5 py-1 text-xs font-bold text-brand-300 ring-1 ring-brand-400/30 backdrop-blur">
              ★ {formatRating(item.rating)}
            </span>
          )}
          <h3 className="line-clamp-2 absolute inset-x-4 bottom-3 text-[15px] font-bold leading-snug text-white drop-shadow-md">
            {item.name}
          </h3>
        </div>
        <div className="flex items-center justify-between px-4 py-3">
          <span className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-500">
            Minecraft Bedrock
          </span>
          <span className="grid h-8 w-8 place-items-center rounded-full border border-white/10 text-sm text-zinc-400 transition group-hover:border-brand-400 group-hover:bg-brand-400 group-hover:text-black" aria-hidden="true">
            →
          </span>
        </div>
      </Link>
    </article>
  );
}
