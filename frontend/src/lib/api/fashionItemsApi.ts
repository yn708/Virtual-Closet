'use server';

import type { Brand, MetaDataType } from '@/types';
import {
  BASE_FASHION_ITEMS_ENDPOINT,
  FASHION_ITEM_METADATA_ENDPOINT,
  FASHION_ITEM_REGISTER_ENDPOINT,
} from '@/utils/constants';
import { baseFetchAuthAPI } from './baseApi';

/* ----------------------------------------------------------------
ファッションアイテム登録時に必要なデータの取得
カテゴリー・シーズン・価格帯・柄・メインカラー・ブランド（人気）を取得する関数
------------------------------------------------------------------ */
export async function fetchFashionItemMetaDataAPI(): Promise<MetaDataType> {
  return baseFetchAuthAPI(FASHION_ITEM_METADATA_ENDPOINT, { cache: 'force-cache' });
}

/* ----------------------------------------------------------------
ブランド検索
------------------------------------------------------------------ */
export async function searchBrandsAPI(query: string): Promise<Brand[]> {
  const endpoint = `${BASE_FASHION_ITEMS_ENDPOINT}/brands/search/?query=${encodeURIComponent(
    query,
  )}`;
  return await baseFetchAuthAPI(endpoint);
}

/* ----------------------------------------------------------------
ファッションアイテムの登録
------------------------------------------------------------------ */
export async function registerFashionItem(formData: FormData) {
  return baseFetchAuthAPI(FASHION_ITEM_REGISTER_ENDPOINT, {
    method: 'POST',
    body: formData,
  });
}
