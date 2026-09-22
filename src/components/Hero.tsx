import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CATEGORIES, categoryPath } from '../utils/categories';

export default function Hero() {
  const [q, setQ] = useState('');
  const nav = useNavigate();

  return (
    <section className="relative overflow-hidden border-b border-white/[0.07]">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -top-32 left-1/4 h-80 w-[560px] bg-brand-400/[0.10] blur-3xl" />
        <div className="stripes absolute bottom-0 left-0 h-1.5 w-full opacity-40" />
      </div>

      <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 md:grid-cols-[1.15fr_.85fr] md:py-16">
        <div>
          <img src="/logo.png" alt="DOCK" className="mb-5 h-20 w-auto rounded-xl md:hidden" />
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-400/30 bg-brand-400/10 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.22em] text-brand-300">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-400" />
            Catálogo · Minecraft Bedrock
          </p>
          <h1 className="font-display text-[40px] font-bold leading-[1.03] tracking-tight text-white md:text-6xl">
            O próximo addon do seu mundo <span className="text-amber-gradient">está aqui.</span>
          </h1>
          <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-zinc-400 md:text-base">
            Busque, escolha e baixe da fonte original. Sem conta, sem enrolação.
          </p>

          <form
            className="mt-7 flex max-w-lg gap-2"
            role="search"
            onSubmit={(e) => {
              e.preventDefault();
              if (q.trim()) nav(`/search?q=${encodeURIComponent(q.trim())}`);
            }}
          >
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Ex.: vein miner, furniture, shaders…"
              aria-label="Buscar no catálogo"
              className="h-14 min-w-0 flex-1 rounded-xl border border-white/10 bg-ink-800/90 px-5 text-[15px] text-zinc-100 placeholder:text-zinc-500 outline-none focus:border-brand-400/70 focus:shadow-glow"
            />
            <button className="h-14 shrink-0 rounded-xl bg-brand-400 px-6 text-[15px] font-bold text-black shadow-glow transition hover:bg-brand-300 active:scale-[0.98] md:px-8">
              Buscar
            </button>
          </form>

          <div className="mt-5 flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <Link
                key={c.key}
                to={categoryPath(c.key)}
                className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-[13px] font-medium text-zinc-300 transition hover:border-brand-400/60 hover:text-white"
              >
                {c.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="relative hidden md:block" aria-hidden="true">
          <div className="stripes absolute -inset-3 -rotate-2 rounded-2xl opacity-25" />
          <div className="clip-corner relative bg-brand-400/20 p-[2px] shadow-glow">
            <img src="/logo.png" alt="" className="clip-corner block h-auto w-full bg-black" />
          </div>
        </div>
      </div>
    </section>
  );
}
