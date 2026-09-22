import { Link } from 'react-router-dom';
import type { SearchItem } from '../types/mcpedl';
import { buildDetailPath, formatRating } from '../utils/format';

// As thumbs vêm do CDN do MCPEDL (qualidade e recorte de origem), então o card
// foi desenhado em volta delas: proporção 4/3 próxima da original, moldura com
// cantos cortados e overlay que ancora o selo de avaliação.
export default function ContentCard({ item }: { item: SearchItem }) {
  return (
    <article className="card-lift group">
      <Link to={buildDetailPath(item.id)} className="clip-corner-sm block bg-white/[0.09] p-px transition group-hover:bg-brand-400/60" aria-label={item.name}>
        <span className="clip-corner-sm block overflow-hidden bg-ink-850">
          <span className="relative block aspect-[4/3] overflow-hidden bg-ink-700">
            {item.img ? (
              <img
                src={item.img}
                alt={item.name}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.05]"
              />
            ) : (
              <span className="grid h-full w-full place-items-center text-zinc-600">sem imagem</span>
            )}
            <span className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" aria-hidden="true" />
            {item.rating && (
              <span className="absolute left-3 top-3 rounded-md bg-black/80 px-2.5 py-1 text-xs font-bold text-brand-300 ring-1 ring-brand-400/40 backdrop-blur">
                ★ {formatRating(item.rating)}
              </span>
            )}
            <span className="absolute bottom-3 right-3 grid h-9 w-9 place-items-center rounded-full bg-brand-400 text-base font-bold text-black opacity-0 transition group-hover:opacity-100" aria-hidden="true">
              →
            </span>
          </span>
          <span className="block p-4">
            <span className="line-clamp-2 block min-h-[2.7em] text-[15px] font-semibold leading-snug text-zinc-100 group-hover:text-white">
              {item.name}
            </span>
            <span className="mt-2 block text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-600">
              Minecraft Bedrock
            </span>
          </span>
        </span>
      </Link>
    </article>
  );
}
