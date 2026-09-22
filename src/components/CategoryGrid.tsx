import { Link } from 'react-router-dom';
import { CATEGORIES, categoryPath } from '../utils/categories';

export default function CategoryGrid() {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
      {CATEGORIES.map((c) => (
        <Link
          key={c.key}
          to={categoryPath(c.key)}
          className="card-lift group rounded-2xl border border-white/[0.08] bg-ink-850 p-5 hover:border-brand-400/50"
        >
          <span className={`mb-4 block h-1.5 w-10 rounded-full ${c.bar}`} aria-hidden="true" />
          <p className="font-display text-lg font-bold text-white">{c.label}</p>
          <span className="mt-1 block text-sm font-semibold text-zinc-500 transition group-hover:text-brand-300">
            Explorar →
          </span>
        </Link>
      ))}
    </div>
  );
}
