import { useEffect } from 'react';
import SectionHeading from '../components/SectionHeading';
import CategoryGrid from '../components/CategoryGrid';
import { setPageMeta } from '../utils/seo';

export default function Categories() {
  useEffect(() => {
    setPageMeta({ title: 'Categorias — DOCK', description: 'Navegue por addons, texturas, mapas, scripts e outros conteúdos.', path: '/categorias' });
  }, []);
  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <SectionHeading title="Categorias" hint="Cada categoria aplica um filtro de busca otimizado." />
      <CategoryGrid />
    </main>
  );
}
