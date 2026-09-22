import { useEffect } from 'react';
import { setPageMeta } from '../utils/seo';

export default function About() {
  useEffect(() => {
    setPageMeta({ title: 'Sobre — DOCK', description: 'O DOCK é um catálogo independente de conteúdo para Minecraft Bedrock.', path: '/sobre' });
  }, []);
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="font-display text-3xl font-bold text-white">Sobre o DOCK</h1>
      <div className="prose-dock mt-5 rounded-xl2 border border-white/[0.08] bg-ink-850 p-6">
        <p>
          O DOCK é um catálogo independente de addons, mapas, texturas e scripts para Minecraft Bedrock.
          Não hospedamos arquivos: consultamos a fonte original através de API e redirecionamos o usuário
          para o download oficial, mantendo o crédito dos autores.
        </p>
        <p>
          DOCK é um projeto independente e não possui vínculo oficial com Mojang Studios, Microsoft ou MCPEDL.
        </p>
        <h2 id="contato" className="font-display mt-6 text-lg font-bold text-white">Contato</h2>
        <p>Para sugestões, correções de catálogo ou remoção de conteúdo, abra uma issue no repositório do projeto no GitHub.</p>
      </div>
    </main>
  );
}
