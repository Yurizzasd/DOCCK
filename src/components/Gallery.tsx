import { useState } from 'react';
import type { GalleryItem } from '../types/mcpedl';

export default function Gallery({ items }: { items: GalleryItem[] }) {
  const [active, setActive] = useState<number | null>(null);
  if (!items.length) return null;
  return (
    <section aria-label="Galeria">
      <h2 className="font-display mb-3 text-lg font-bold text-white">Galeria</h2>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {items.slice(0, 8).map((g, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className="group overflow-hidden rounded-xl border border-white/[0.08] bg-ink-800"
            aria-label={`Ampliar imagem ${i + 1}`}
          >
            <img src={g.img} alt="" loading="lazy" onError={(e) => { e.currentTarget.style.display = 'none'; }} className="aspect-[4/3] w-full object-cover transition group-hover:scale-[1.03]" />
          </button>
        ))}
      </div>
      {active !== null && items[active] && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/85 p-4"
          onClick={() => setActive(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Visualização ampliada"
        >
          <img src={items[active].img} alt="" className="max-h-[85vh] max-w-full rounded-xl border border-white/10" />
        </div>
      )}
    </section>
  );
}
