import { Link } from 'react-router-dom';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-white/[0.07] bg-ink-900">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-zinc-500">
            Catálogo independente de addons, mapas, texturas e scripts para Minecraft Bedrock.
            Os arquivos pertencem aos seus autores e são baixados da fonte original.
          </p>
        </div>
        <nav aria-label="Mapa do site">
          <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.2em] text-zinc-500">Navegar</p>
          <ul className="space-y-2 text-sm">
            {[['/', 'Início'], ['/addons', 'Addons'], ['/addons?cat=texturas', 'Texturas'], ['/addons?cat=mapas', 'Mapas'], ['/categorias', 'Categorias']].map(([to, label]) => (
              <li key={to + label}><Link to={to} className="text-zinc-400 hover:text-white">{label}</Link></li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Institucional">
          <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.2em] text-zinc-500">DOCK</p>
          <ul className="space-y-2 text-sm">
            <li><Link to="/sobre" className="text-zinc-400 hover:text-white">Sobre</Link></li>
            <li><Link to="/sobre#contato" className="text-zinc-400 hover:text-white">Contato</Link></li>
            <li><span className="text-zinc-600">v1.0 · GitHub + Cloudflare</span></li>
          </ul>
        </nav>
      </div>
      <div className="border-t border-white/[0.06]">
        <p className="mx-auto max-w-6xl px-4 py-5 text-[12.5px] leading-relaxed text-zinc-600">
          DOCK é um catálogo independente e não possui vínculo oficial com Mojang Studios, Microsoft ou MCPEDL.
          Todo o crédito dos conteúdos pertence aos seus respectivos autores.
        </p>
      </div>
    </footer>
  );
}
