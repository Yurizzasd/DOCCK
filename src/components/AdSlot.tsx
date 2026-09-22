import { useEffect, useRef } from 'react';

// Slot de anúncio desacoplado por provedor.
// Como funciona:
//   1. No painel do provedor (AdCash hoje, AdSense no futuro) você cria a unidade
//      de anúncio e copia a TAG (o trecho <script> que eles fornecem).
//   2. Cola a URL do script em VITE_ADS_SCRIPT e o zone/slot id em VITE_ADS_ZONE
//      (variáveis de ambiente — na Cloudflare, em Settings → Environment variables).
//   3. Define VITE_ADS_PROVIDER=adcash (ou adsense) e faz rebuild.
// Sem configuração, renderiza um placeholder neutro que preserva o layout.
// Os slots ficam longe do botão de download de propósito.

interface AdSlotProps {
  slot: string;
  label?: string;
  format?: 'banner' | 'infeed' | 'sidebar';
}

export default function AdSlot({ slot, label = 'Espaço publicitário', format = 'banner' }: AdSlotProps) {
  const ref = useRef<HTMLDivElement>(null);
  const provider = import.meta.env.VITE_ADS_PROVIDER as string | undefined;
  const scriptSrc = import.meta.env.VITE_ADS_SCRIPT as string | undefined;
  const zone = import.meta.env.VITE_ADS_ZONE as string | undefined;
  const enabled = (provider === 'adcash' || provider === 'adsense') && !!scriptSrc;

  useEffect(() => {
    if (!enabled || !ref.current) return;
    const container = ref.current;
    container.innerHTML = '';
    const s = document.createElement('script');
    s.async = true;
    s.src = scriptSrc as string;
    if (zone) s.setAttribute('data-zone', zone);
    s.setAttribute('data-slot', slot);
    container.appendChild(s);
    return () => {
      container.innerHTML = '';
    };
  }, [enabled, scriptSrc, zone, slot]);

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

  return <div ref={ref} data-ad-slot={slot} data-ad-format={format} className="min-h-[90px]" />;
}
