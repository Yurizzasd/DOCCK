import { Link } from 'react-router-dom';

const CATS = [
  { key: 'addons', title: 'Addons', q: 'addon', bar: 'bg-brand-400' },
  { key: 'texturas', title: 'Texturas', q: 'texture', bar: 'bg-ember-400' },
  { key: 'mapas', title: 'Mapas', q: 'map', bar: 'bg-ember-600' },
  { key: 'scripts', title: 'Scripts', q: 'script', bar: 'bg-zinc-100' },
  { key: 'outros', title: 'Outros', q: 'pack', bar: 'bg-zinc-500' }
];

export default function CategoryGrid() {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
      {CATS.map((c) => (
        <Link
          key={c.key}
          to={`/addons?cat=${c.key}&q=${encodeURIComponent(c.q)}`}
          className="card-lift group rounded-2xl border border-white/[0.08] bg-ink-850 p-5 hover:border-brand-400/50"
        >
          <span className={`mb-4 block h-1.5 w-10 rounded-full ${c.bar}`} aria-hidden="true" />
          <p className="font-display text-lg font-bold text-white">{c.title}</p>
          <span className="mt-1 block text-sm font-semibold text-zinc-500 transition group-hover:text-brand-300">
            Explorar →
          </span>
        </Link>
      ))}
    </div>
  );
}
