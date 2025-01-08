import type { FashionItem } from '@/types';

/*--------------------------------------------------------
ファションアイテム表示
--------------------------------------------------------*/
// 取得したアイテムキャッシュ用
export interface CategoryCache {
  [key: string]: FashionItem[];
}

/*--------------------------------------------------------
フィルター用
--------------------------------------------------------*/
export type Status = '' | 'owned' | 'used';
export interface FashionItemFilters {
  category: string;
  status: Status | Status[];
  season: string[];
  [key: string]: unknown;
}
