import { Link } from 'react-router-dom';

const CATS = [
  { key: 'addons', title: 'Addons', desc: 'Mobs, itens, mecânicas e gameplay', q: 'addon', accent: 'bg-brand-400' },
  { key: 'texturas', title: 'Texturas', desc: 'Resource packs e visuais', q: 'texture', accent: 'bg-ember-400' },
  { key: 'mapas', title: 'Mapas', desc: 'Mundos, aventuras e survival', q: 'map', accent: 'bg-ember-600' },
  { key: 'scripts', title: 'Scripts', desc: 'Automação e utilidades', q: 'script', accent: 'bg-zinc-100' },
  { key: 'outros', title: 'Outros', desc: 'Shaders, skins e mais', q: 'pack', accent: 'bg-zinc-500' }
];

export default function CategoryGrid() {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
      {CATS.map((c) => (
        <Link
          key={c.key}
          to={`/addons?cat=${c.key}&q=${encodeURIComponent(c.q)}`}
          className="card-lift group relative overflow-hidden rounded-xl2 border border-white/[0.08] bg-ink-850 p-4 hover:border-brand-400/40"
        >
          <span className={`mb-3 block h-1 w-8 rounded-full ${c.accent}`} aria-hidden="true" />
          <p className="font-display text-[15px] font-bold text-white">{c.title}</p>
          <p className="mt-1 text-[12.5px] leading-snug text-zinc-500">{c.desc}</p>
          <span className="mt-3 block text-[12px] font-semibold text-brand-400/90 group-hover:text-brand-300">
            Explorar →
          </span>
        </Link>
      ))}
    </div>
  );
}
