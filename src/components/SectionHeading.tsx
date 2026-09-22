import { Link } from 'react-router-dom';

export default function SectionHeading({
  num,
  title,
  hint,
  linkTo,
  linkLabel
}: {
  num?: string;
  title: string;
  hint?: string;
  linkTo?: string;
  linkLabel?: string;
}) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <div>
        {num && (
          <p className="mb-1 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.24em]" aria-hidden="true">
            <span className="text-zinc-600">{num}</span>
            <span className="h-px w-8 bg-brand-400/60" />
            <span className="text-brand-400/90">DOCK</span>
          </p>
        )}
        <h2 className="font-display text-xl font-bold tracking-tight text-white md:text-2xl">{title}</h2>
        {hint && <p className="mt-1 text-sm text-zinc-500">{hint}</p>}
      </div>
      {linkTo && (
        <Link to={linkTo} className="clip-corner-sm shrink-0 bg-white/[0.06] px-4 py-2 text-[13px] font-semibold text-zinc-200 transition hover:bg-brand-400 hover:text-black">
          {linkLabel || 'Ver tudo →'}
        </Link>
      )}
    </div>
  );
}
