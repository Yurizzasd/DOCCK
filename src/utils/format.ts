export function ratingToNumber(rating: string | undefined): number {
  if (!rating) return 0;
  const n = parseFloat(String(rating).replace(',', '.'));
  return Number.isFinite(n) ? Math.min(5, Math.max(0, n)) : 0;
}

export function formatRating(rating: string | undefined): string {
  const n = ratingToNumber(rating);
  return n ? n.toFixed(1) : '—';
}

export function buildDetailPath(id: string): string {
  return `/addon/${encodeURIComponent(id)}`;
}

export function categoryOf(item: { name?: string }, fallback = 'Addons'): string {
  void item;
  return fallback;
}

export function truncate(text: string, max = 220): string {
  if (!text) return '';
  const clean = text.replace(/\s+/g, ' ').trim();
  return clean.length > max ? clean.slice(0, max - 1).trimEnd() + '…' : clean;
}

export function friendlyDate(iso: string | undefined): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
}

// Instaladores do Minecraft (ex.: "Download Minecraft 26.51 APK") não são
// addons — a vitrine da home os exclui para mostrar conteúdo real.
export function isInstallerPost(name: string | undefined): boolean {
  if (!name) return true;
  return /\bapk\b/i.test(name);
}
