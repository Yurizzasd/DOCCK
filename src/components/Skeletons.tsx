export function CardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl2 border border-white/[0.07] bg-ink-850" aria-hidden="true">
      <div className="skeleton aspect-[16/9]" />
      <div className="space-y-2 p-3.5">
        <div className="skeleton h-4 rounded" />
        <div className="skeleton h-4 w-2/3 rounded" />
      </div>
    </div>
  );
}

export function GridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8" aria-hidden="true">
      <div className="skeleton h-64 rounded-xl2 md:h-80" />
      <div className="skeleton mt-5 h-8 w-2/3 rounded" />
      <div className="skeleton mt-2 h-4 w-1/3 rounded" />
    </div>
  );
}
