import { Link } from 'react-router-dom';

export default function SectionHeading({
  kicker,
  title,
  hint,
  linkTo,
  linkLabel
}: {
  kicker?: string;
  title: string;
  hint?: string;
  linkTo?: string;
  linkLabel?: string;
}) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <div>
        {kicker && (
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-400/90">{kicker}</p>
        )}
        <h2 className="font-display text-xl font-bold text-white md:text-2xl">{title}</h2>
        {hint && <p className="mt-1 text-sm text-zinc-500">{hint}</p>}
      </div>
      {linkTo && (
        <Link to={linkTo} className="shrink-0 rounded-lg border border-white/10 px-3 py-2 text-[13px] font-medium text-zinc-300 transition hover:border-brand-400/50 hover:text-white">
          {linkLabel || 'Ver tudo →'}
        </Link>
      )}
    </div>
  );
}
