import { Link } from 'react-router-dom';

export default function CtaBand() {
  return (
    <section className="mt-12 overflow-hidden rounded-2xl bg-brand-400 px-6 py-8 md:px-10" aria-label="Chamada">
      <div className="flex flex-col items-start justify-between gap-5 md:flex-row md:items-center">
        <div>
          <p className="font-display text-2xl font-bold leading-tight text-black md:text-3xl">
            Milhares de addons. Um só lugar.
          </p>
          <p className="mt-1 text-[15px] font-medium text-black/70">
            Mergulhe no catálogo completo e ache o ideal para o seu mundo.
          </p>
        </div>
        <Link
          to="/addons"
          className="shrink-0 rounded-xl bg-black px-7 py-3.5 text-[15px] font-bold text-brand-300 transition hover:bg-ink-800 active:scale-[0.98]"
        >
          Explorar catálogo →
        </Link>
      </div>
    </section>
  );
}
