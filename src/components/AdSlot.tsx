import { useEffect } from 'react';
import { ensureAdCash } from '../ads/adcash';

// Slot de anúncio desacoplado por provedor.
// AdCash (atual): basta definir VITE_ADS_PROVIDER=adcash + VITE_ADS_ZONE=<zoneId>
// e o AutoTag preenche os slots sozinho. Nada de IDs no código.
// AdSense (futuro): trocar o provider e implementar a tag <ins> neste arquivo.
// Slots ficam longe do botão de download de propósito.

interface AdSlotProps {
  slot: string;
  label?: string;
  format?: 'banner' | 'infeed' | 'sidebar';
}

export default function AdSlot({ slot, label = 'Espaço publicitário', format = 'banner' }: AdSlotProps) {
  const provider = import.meta.env.VITE_ADS_PROVIDER as string | undefined;
  const zone = import.meta.env.VITE_ADS_ZONE as string | undefined;
  const enabled = provider === 'adcash' && !!zone;

  useEffect(() => {
    if (enabled && zone) ensureAdCash(zone);
  }, [enabled, zone]);

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

  return <div data-ad-slot={slot} data-ad-format={format} className="min-h-[90px]" />;
}
