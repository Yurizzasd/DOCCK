// Carregador único do AdCash AutoTag.
// O script aclib.js é injetado uma única vez por página; depois disso,
// runAutoTag({ zoneId }) detecta e preenche os slots automaticamente.
declare global {
  interface Window {
    aclib?: { runAutoTag: (opts: { zoneId: string }) => void };
    __dockAdcashLoaded?: boolean;
    __dockAdcashZone?: string;
  }
}

const ACLIB_SRC = 'https://acscdn.com/script/aclib.js';

export function ensureAdCash(zoneId: string): void {
  if (!zoneId) return;
  if (window.__dockAdcashLoaded && window.__dockAdcashZone === zoneId) {
    window.aclib?.runAutoTag({ zoneId });
    return;
  }
  window.__dockAdcashZone = zoneId;

  const run = () => {
    window.__dockAdcashLoaded = true;
    window.aclib?.runAutoTag({ zoneId });
  };

  if (window.aclib) {
    run();
    return;
  }
  if (document.getElementById('aclib')) return; // carregando em outro slot
  const s = document.createElement('script');
  s.id = 'aclib';
  s.async = true;
  s.src = ACLIB_SRC;
  s.onload = run;
  document.head.appendChild(s);
}
