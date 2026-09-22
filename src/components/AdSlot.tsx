// Slot de anúncio desacoplado: troque AdCash por AdSense sem tocar nas páginas.
// Enquanto VITE_ADS_ENABLED=false (ou sem zone), renderiza um placeholder neutro
// que mantém o layout estável e não interfere no botão de download.

export default function AdSlot({ slot, label = 'Espaço publicitário' }: { slot: string; label?: string }) {
  const enabled = import.meta.env.VITE_ADS_ENABLED === 'true';
  if (!enabled) {
    return (
      <div
        className="grid min-h-[90px] place-items-center rounded-xl border border-dashed border-white/10 bg-white/[0.02] px-4 py-6 text-center"
        data-ad-slot={slot}
        role="complementary"
        aria-label={label}
      >
        <p className="text-[12px] uppercase tracking-[0.2em] text-zinc-600">{label} · {slot}</p>
      </div>
    );
  }
  // Com credenciais reais, injete aqui o script do provedor (AdCash/AdSense).
  return <div data-ad-slot={slot} className="min-h-[90px]" />;
}
