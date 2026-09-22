// Definição única de categorias do DOCK.
// Limitação honesta da API terastudio-org/mcpedl: ela só tem search/latest/detail/download,
// sem endpoint de categoria. Então cada categoria é um filtro de busca curado (query padrão)
// aplicado sobre o /api/search. Quando o usuário digita um termo próprio, ele prevalece.

export interface CategoryDef {
  key: string;
  label: string;
  query: string;
  bar: string;
}

export const CATEGORIES: CategoryDef[] = [
  { key: 'addons', label: 'Addons', query: '', bar: 'bg-brand-400' },
  { key: 'texturas', label: 'Texturas', query: 'texture pack', bar: 'bg-ember-400' },
  { key: 'mapas', label: 'Mapas', query: 'map', bar: 'bg-ember-600' },
  { key: 'scripts', label: 'Scripts', query: 'script', bar: 'bg-zinc-100' },
  { key: 'outros', label: 'Outros', query: 'shaders', bar: 'bg-zinc-500' }
];

export function categoryByKey(key: string | null): CategoryDef | null {
  if (!key) return null;
  return CATEGORIES.find((c) => c.key === key) ?? null;
}

export function categoryPath(key: string): string {
  return `/addons?cat=${encodeURIComponent(key)}`;
}
