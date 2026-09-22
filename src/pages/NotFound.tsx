import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-20 text-center">
      <p className="font-display text-5xl font-bold text-white">404</p>
      <p className="mt-2 text-zinc-400">Página não encontrada.</p>
      <Link to="/" className="mt-6 inline-block rounded-lg bg-brand-400 px-5 py-2.5 text-sm font-semibold text-black">
        Voltar ao início
      </Link>
    </main>
  );
}
