const STEPS = [
  { n: '1', title: 'Busque', desc: 'Digite o nome ou navegue por categoria.' },
  { n: '2', title: 'Escolha', desc: 'Abra a página e confira versão e arquivos.' },
  { n: '3', title: 'Baixe', desc: 'Download direto da fonte original.' }
];

export default function HowItWorks() {
  return (
    <section className="mx-auto max-w-6xl px-4 pt-10" aria-label="Como funciona">
      <div className="grid gap-3 md:grid-cols-3">
        {STEPS.map((s) => (
          <div key={s.n} className="flex items-center gap-4 rounded-2xl border border-white/[0.08] bg-ink-850 px-5 py-4">
            <span className="font-display grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-400 text-lg font-bold text-black" aria-hidden="true">
              {s.n}
            </span>
            <div>
              <p className="font-display text-[15px] font-bold text-white">{s.title}</p>
              <p className="text-[13px] text-zinc-500">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
