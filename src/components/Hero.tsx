import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CATEGORIES, categoryPath } from '../utils/categories';

export default function Hero() {
  const [q, setQ] = useState('');
  const nav = useNavigate();

  return (
    <section className="relative overflow-hidden border-b border-white/[0.07]">
      {/* fundo: só dois glows + uma faixa diagonal */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -top-32 left-1/3 h-80 w-[560px] bg-brand-400/[0.10] blur-3xl" />
        <div className="absolute -right-24 top-16 h-72 w-72 bg-ember-600/[0.10] blur-3xl" />
        <div className="absolute -bottom-10 -left-10 h-28 w-[120%] -rotate-2 bg-brand-400/[0.05]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 pb-14 pt-14 md:pb-20 md:pt-20">
        <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-400/30 bg-brand-400/10 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.22em] text-brand-300">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-400" />
          Minecraft Bedrock
        </p>
        <h1 className="font-display max-w-3xl text-[42px] font-bold leading-[1.02] tracking-tight text-white md:text-7xl">
          Encontre o <span className="text-amber-gradient">próximo addon</span> para o seu mundo.
        </h1>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-zinc-400 md:text-lg">
          Addons, mapas, texturas e scripts num catálogo rápido e direto ao ponto.
        </p>

        <form
          className="mt-8 flex max-w-xl gap-2"
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            if (q.trim()) nav(`/search?q=${encodeURIComponent(q.trim())}`);
          }}
        >
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="O que você procura?"
            aria-label="Buscar no catálogo"
            className="h-14 flex-1 rounded-2xl border border-white/10 bg-ink-800/90 px-5 text-base text-zinc-100 placeholder:text-zinc-500 outline-none focus:border-brand-400/70 focus:shadow-glow"
          />
          <button className="h-14 shrink-0 rounded-2xl bg-brand-400 px-7 text-base font-bold text-black shadow-glow transition hover:bg-brand-300 active:scale-[0.98]">
            Buscar
          </button>
        </form>

        <div className="mt-6 flex flex-wrap gap-2">
          {CATEGORIES.slice(0, 4).map((c) => (
            <Link
              key={c.key}
              to={categoryPath(c.key)}
              className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium text-zinc-300 transition hover:border-brand-400/60 hover:text-white"
            >
              {c.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
