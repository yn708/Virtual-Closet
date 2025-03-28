'use server';

import type { Brand, CountDataType, FashionItem, MetaDataType } from '@/types';
import {
  BRAND_SEARCH_ENDPOINT,
  FASHION_ITEM_METADATA_ENDPOINT,
  FASHION_ITEMS_BY_CATEGORY_ENDPOINT,
  FASHION_ITEMS_COUNT_ENDPOINT,
  FASHION_ITEMS_ENDPOINT,
} from '@/utils/constants';
import { baseFetchAuthAPI } from './baseApi';

/* ----------------------------------------------------------------
ファッションアイテム登録時に必要なデータの取得
カテゴリー・シーズン・価格帯・柄・メインカラー・ブランド（人気）を取得する関数
------------------------------------------------------------------ */
export async function fetchFashionMetaDataAPI(): Promise<MetaDataType> {
  return baseFetchAuthAPI(FASHION_ITEM_METADATA_ENDPOINT, { cache: 'force-cache' });
}

/* ----------------------------------------------------------------
ブランド検索
------------------------------------------------------------------ */
export async function searchBrandsAPI(query: string): Promise<Brand[]> {
  const endpoint = `${BRAND_SEARCH_ENDPOINT}?query=${encodeURIComponent(query)}`;
  return await baseFetchAuthAPI(endpoint);
}

/* ----------------------------------------------------------------
ファッションアイテムの登録
------------------------------------------------------------------ */
export async function registerFashionItemAPI(formData: FormData) {
  return baseFetchAuthAPI(FASHION_ITEMS_ENDPOINT, {
    method: 'POST',
    body: formData,
  });
}

/* ----------------------------------------------------------------
カテゴリー別アイテムの取得
------------------------------------------------------------------ */
interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
export async function fetchFashionItemsByCategoryAPI(
  categoryId: string,
  page: number = 1,
): Promise<PaginatedResponse<FashionItem>> {
  const endpoint = `${FASHION_ITEMS_BY_CATEGORY_ENDPOINT}${categoryId}&page=${page}`;
  return await baseFetchAuthAPI(endpoint);
}

/* ----------------------------------------------------------------
ファッションアイテムの編集
------------------------------------------------------------------ */
export async function updateFashionItemAPI(id: string, formData: FormData) {
  const endpoint = `${FASHION_ITEMS_ENDPOINT}${id}/`;
  return await baseFetchAuthAPI(endpoint, {
    method: 'PUT',
    body: formData,
  });
}

/* ----------------------------------------------------------------
ファッションアイテムの削除
------------------------------------------------------------------ */
export async function deleteFashionItemAPI(id: string) {
  const endpoint = `${FASHION_ITEMS_ENDPOINT}${id}/`;
  return await baseFetchAuthAPI(endpoint, {
    method: 'DELETE',
  });
}

/* ----------------------------------------------------------------
ファッションアイテムの登録済み個数取得
------------------------------------------------------------------ */
export async function fetchFashionCountAPI(): Promise<CountDataType> {
  return await baseFetchAuthAPI(FASHION_ITEMS_COUNT_ENDPOINT);
}
