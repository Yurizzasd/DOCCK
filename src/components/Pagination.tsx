export default function Pagination({
  page,
  hasNext,
  onPage
}: {
  page: number;
  hasNext: boolean;
  onPage: (p: number) => void;
}) {
  return (
    <div className="mt-8 flex items-center justify-center gap-2">
      <button
        disabled={page <= 1}
        onClick={() => onPage(page - 1)}
        className="rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-zinc-300 transition enabled:hover:border-brand-400/50 enabled:hover:text-white disabled:opacity-40"
      >
        ← Anterior
      </button>
      <span className="rounded-lg bg-white/[0.06] px-4 py-2 text-sm font-semibold text-white" aria-current="page">
        {page}
      </span>
      <button
        disabled={!hasNext}
        onClick={() => onPage(page + 1)}
        className="rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-zinc-300 transition enabled:hover:border-brand-400/50 enabled:hover:text-white disabled:opacity-40"
      >
        Próxima →
      </button>
    </div>
  );
}
