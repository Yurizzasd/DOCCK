// Tipos espelhados 1:1 com a API terastudio-org/mcpedl (src/index.ts).
// Não inventar campos: tudo que o frontend exibe vem destes tipos.

export interface SearchItem {
  name: string;
  id: string;
  img: string;
  rating: string;
}

export interface SearchResult {
  list: SearchItem[];
  hasNextPage: boolean;
  nextPage?: number;
}

export interface PostInfo {
  category: string;
  postDate: string;
  author: string;
  [key: string]: unknown;
}

export interface GalleryItem {
  type: 'image' | 'video';
  img: string;
  name?: string;
  postTime?: string;
  duration?: string | null;
  video?: string | null;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface DownloadFile {
  index: number;
  type: string;
  id: number;
  meta_title?: string | null;
}

export interface DownloadItem {
  index: number;
  name: string;
  version: string;
  files: DownloadFile[];
}

export interface DetailResult {
  title: string;
  img: string;
  rating: { count: string; value: string };
  comment: string;
  content: string;
  info: PostInfo;
  gallery: GalleryItem[];
  faq: FAQItem[];
  list: DownloadItem[];
}

export interface DownloadResult {
  url: string;
}

export interface QuickDownload {
  name: string;
  id: string;
  file: number;
}

export interface LatestResult {
  quick: QuickDownload[];
  list: SearchItem[];
}

export type CategoryKey = 'addons' | 'texturas' | 'mapas' | 'scripts' | 'outros';

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}
