import { useState } from 'react';

// Usa a logo oficial (public/logo.png) quando o arquivo existir.
// A arte já contém o nome DOCK, então é exibida sozinha, sem texto duplicado.
// Sem o arquivo, usa a marca SVG temporária.
export default function Logo({ compact = false }: { compact?: boolean }) {
  const [imgOk, setImgOk] = useState(true);
  if (imgOk) {
    return (
      <a href="/" className="flex items-center" aria-label="DOCK — início">
        <img
          src="/logo.png"
          alt="DOCK"
          onError={() => setImgOk(false)}
          className="h-11 w-auto rounded-lg object-contain"
        />
      </a>
    );
  }
  return (
    <a href="/" className="flex items-center gap-2.5" aria-label="DOCK — início">
      <span className="relative grid h-9 w-9 place-items-center rounded-[10px] bg-ink-800 ring-1 ring-white/10">
        <svg viewBox="0 0 64 64" className="h-6 w-6" aria-hidden="true">
          <path d="M20 10h22l8 8v30a4 4 0 0 1-4 4H20a4 4 0 0 1-4-4V14a4 4 0 0 1 4-4z" fill="#ffbe1a" />
          <path d="M42 10l8 8h-5a3 3 0 0 1-3-3v-5z" fill="#d21f26" />
          <rect x="22" y="25" width="20" height="3.6" rx="1.8" fill="#141419" />
          <rect x="22" y="31.5" width="20" height="3.6" rx="1.8" fill="#141419" />
          <rect x="22" y="38" width="12" height="3.6" rx="1.8" fill="#141419" />
        </svg>
        <span className="pointer-events-none absolute -right-0.5 -top-0.5 h-2 w-2 rounded-[2px] bg-ember-500" />
      </span>
      {!compact && (
        <span className="leading-none">
          <span className="font-display block text-[19px] font-bold tracking-[0.18em] text-white">
            DOCK
          </span>
          <span className="block text-[10px] font-medium uppercase tracking-[0.28em] text-zinc-500">
            Bedrock catalog
          </span>
        </span>
      )}
    </a>
  );
}
