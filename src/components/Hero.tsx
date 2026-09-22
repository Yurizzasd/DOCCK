import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Hero() {
  const [q, setQ] = useState('');
  const nav = useNavigate();

  return (
    <section className="relative overflow-hidden border-b border-white/[0.07]">
      {/* fundo geométrico sutil */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -top-24 left-1/4 h-72 w-[520px] -skew-x-12 bg-brand-400/[0.07] blur-2xl" />
        <div className="absolute -right-20 top-10 h-64 w-64 rotate-12 border border-ember-600/20" />
        <div className="absolute bottom-6 left-8 flex gap-1.5 opacity-60">
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className={`h-2 w-2 ${i === 1 ? 'bg-ember-600' : 'bg-brand-400/80'}`} />
          ))}
        </div>
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,.045) 1px, transparent 1px)',
            backgroundSize: '100% 44px'
          }}
        />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 pb-12 pt-12 md:pb-16 md:pt-16">
        <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-brand-400/25 bg-brand-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-300">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-400" />
          Catálogo · Minecraft Bedrock
        </p>
        <h1 className="font-display max-w-2xl text-4xl font-bold leading-[1.05] text-white md:text-[52px]">
          Encontre o próximo addon para o seu mundo.
        </h1>
        <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-zinc-400 md:text-base">
          O DOCK organiza addons, mapas, texturas e scripts para Bedrock em um só lugar:
          busca rápida, páginas individuais e download direto da fonte original.
        </p>

        <form
          className="mt-7 flex max-w-xl gap-2"
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            if (q.trim()) nav(`/search?q=${encodeURIComponent(q.trim())}`);
          }}
        >
          <div className="relative flex-1">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder='Tente "vein miner", "furniture", "shaders"…'
              aria-label="Buscar no catálogo"
              className="h-12 w-full rounded-xl border border-white/10 bg-ink-800/90 pl-11 pr-4 text-[15px] text-zinc-100 placeholder:text-zinc-500 outline-none focus:border-brand-400/70 focus:shadow-glow"
            />
            <svg viewBox="0 0 20 20" className="absolute left-3.5 top-3.5 h-5 w-5 text-zinc-500" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="9" cy="9" r="6" /><path d="M13.5 13.5L17 17" />
            </svg>
          </div>
          <button className="h-12 shrink-0 rounded-xl bg-brand-400 px-5 text-[15px] font-semibold text-black transition hover:bg-brand-300 active:scale-[0.98]">
            Buscar
          </button>
        </form>

        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px] text-zinc-500">
          <span><strong className="text-zinc-200">Busca</strong> com debounce</span>
          <span><strong className="text-zinc-200">Páginas</strong> indexáveis por addon</span>
          <span><strong className="text-zinc-200">Download</strong> via fonte original</span>
        </div>
      </div>
    </section>
  );
}
