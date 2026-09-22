import { useState } from 'react';
import type { FAQItem } from '../types/mcpedl';

export default function FaqAccordion({ faq }: { faq: FAQItem[] }) {
  const [open, setOpen] = useState(0);
  if (!faq.length) return null;
  return (
    <section aria-label="Perguntas frequentes">
      <h2 className="font-display mb-3 text-lg font-bold text-white">Perguntas frequentes</h2>
      <div className="divide-y divide-white/[0.07] rounded-xl2 border border-white/[0.08] bg-ink-850">
        {faq.map((f, i) => (
          <div key={i}>
            <button
              onClick={() => setOpen(open === i ? -1 : i)}
              aria-expanded={open === i}
              className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left text-[14.5px] font-medium text-zinc-100"
            >
              {f.question}
              <span className="text-brand-400">{open === i ? '−' : '+'}</span>
            </button>
            {open === i && <p className="px-4 pb-4 text-sm leading-relaxed text-zinc-400">{f.answer}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}
