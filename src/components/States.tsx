export function Empty({ title, hint, action }: { title: string; hint?: string; action?: React.ReactNode }) {
  return (
    <div className="grid place-items-center rounded-xl2 border border-white/[0.07] bg-ink-850 px-6 py-14 text-center">
      <div className="mb-3 flex gap-1.5" aria-hidden="true">
        <span className="h-2.5 w-2.5 bg-brand-400" />
        <span className="h-2.5 w-2.5 bg-ember-600" />
        <span className="h-2.5 w-2.5 bg-zinc-700" />
      </div>
      <p className="font-display text-lg font-bold text-white">{title}</p>
      {hint && <p className="mt-1 max-w-sm text-sm text-zinc-500">{hint}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function ErrorState({ hint, onRetry }: { hint?: string; onRetry?: () => void }) {
  return (
    <div className="grid place-items-center rounded-xl2 border border-ember-600/25 bg-ember-600/[0.06] px-6 py-14 text-center">
      <p className="font-display text-lg font-bold text-white">Não conseguimos carregar os conteúdos agora.</p>
      <p className="mt-1 max-w-sm text-sm text-zinc-400">{hint || 'Verifique sua conexão e tente novamente em alguns instantes.'}</p>
      {onRetry && (
        <button onClick={onRetry} className="mt-4 rounded-lg bg-brand-400 px-4 py-2 text-sm font-semibold text-black hover:bg-brand-300">
          Tentar novamente
        </button>
      )}
    </div>
  );
}
