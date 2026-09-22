import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Logo from './Logo';
import { CATEGORIES, categoryPath } from '../utils/categories';

export default function Header() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const nav = useNavigate();
  const loc = useLocation();
  const params = new URLSearchParams(loc.search);
  const activeCat = loc.pathname === '/addons' ? params.get('cat') : null;

  const linkCls = (active: boolean) =>
    `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
      active ? 'bg-brand-400/10 text-brand-300' : 'text-zinc-400 hover:bg-white/[0.05] hover:text-zinc-100'
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.07] bg-ink-950/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4">
        <Logo />
        <nav className="ml-4 hidden items-center gap-1 lg:flex" aria-label="Principal">
          <Link to="/" className={linkCls(loc.pathname === '/')}>Início</Link>
          {CATEGORIES.slice(0, 4).map((c) => (
            <Link key={c.key} to={categoryPath(c.key)} className={linkCls(activeCat === c.key || (c.key === 'addons' && loc.pathname === '/addons' && !activeCat))}>
              {c.label}
            </Link>
          ))}
          <Link to="/categorias" className={linkCls(loc.pathname === '/categorias')}>Categorias</Link>
        </nav>
        <form
          className="ml-auto hidden min-w-0 flex-1 max-w-xs items-center md:flex"
          onSubmit={(e) => {
            e.preventDefault();
            if (q.trim()) nav(`/search?q=${encodeURIComponent(q.trim())}`);
          }}
          role="search"
        >
          <div className="relative w-full">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar addons…"
              className="h-9 w-full rounded-lg border border-white/10 bg-ink-800 pl-9 pr-3 text-sm text-zinc-200 placeholder:text-zinc-500 outline-none focus:border-brand-400/60"
              aria-label="Buscar"
            />
            <svg viewBox="0 0 20 20" className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="9" cy="9" r="6" /><path d="M13.5 13.5L17 17" />
            </svg>
          </div>
        </form>
        <Link
          to="/addons"
          className="ml-auto hidden rounded-lg bg-brand-400 px-4 py-2 text-sm font-semibold text-black transition hover:bg-brand-300 md:ml-0 md:block"
        >
          Explorar
        </Link>
        <button
          className="ml-auto grid h-10 w-10 place-items-center rounded-lg border border-white/10 text-zinc-300 lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label="Abrir menu"
        >
          <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? <path d="M5 5l10 10M15 5L5 15" /> : <path d="M3 6h14M3 10h14M3 14h14" />}
          </svg>
        </button>
      </div>
      {open && (
        <div className="border-t border-white/[0.07] bg-ink-950 px-4 pb-4 pt-2 lg:hidden">
          <form
            className="mb-2 flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              setOpen(false);
              if (q.trim()) nav(`/search?q=${encodeURIComponent(q.trim())}`);
            }}
          >
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar addons…"
              className="h-10 flex-1 rounded-lg border border-white/10 bg-ink-800 px-3 text-sm outline-none focus:border-brand-400/60"
              aria-label="Buscar"
            />
            <button className="h-10 rounded-lg bg-brand-400 px-4 text-sm font-semibold text-black">Ir</button>
          </form>
          <Link to="/" onClick={() => setOpen(false)} className={`${linkCls(loc.pathname === '/')} block px-3 py-2.5 text-[15px]`}>Início</Link>
          {CATEGORIES.map((c) => (
            <Link key={c.key} to={categoryPath(c.key)} onClick={() => setOpen(false)} className={`${linkCls(activeCat === c.key)} block px-3 py-2.5 text-[15px]`}>
              {c.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
