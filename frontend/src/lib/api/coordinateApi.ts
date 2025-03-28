'use server';

import type { InitialItems } from '@/features/my-page/coordinate/types';
import type { CountDataType } from '@/types';
import type {
  BaseCoordinate,
  CoordinateMetaDataType,
  CustomCoordinateData,
} from '@/types/coordinate';
import {
  COORDINATE_COUNT_ENDPOINT,
  COORDINATE_CREATE_CUSTOM_ENDPOINT,
  COORDINATE_CREATE_PHOTO_ENDPOINT,
  COORDINATE_METADATA_ENDPOINT,
} from '@/utils/constants';
import { baseFetchAuthAPI } from './baseApi';

// コーディネートタイプ
type CoordinateType = 'photo' | 'custom';

// エンドポイントを取得する関数
function getEndpoint(type: CoordinateType, id?: string): string {
  const baseEndpoint =
    type === 'photo' ? COORDINATE_CREATE_PHOTO_ENDPOINT : COORDINATE_CREATE_CUSTOM_ENDPOINT;
  return id ? `${baseEndpoint}${id}/` : baseEndpoint;
}

/* ----------------------------------------------------------------
取得
------------------------------------------------------------------ */
// コーディネート登録時に必要なデータの取得（シーズン・シーン・テイスト）
export async function fetchCoordinateMetaDataAPI(): Promise<CoordinateMetaDataType> {
  return baseFetchAuthAPI(COORDINATE_METADATA_ENDPOINT, { cache: 'force-cache' });
}

// コーディネート編集時に必要なアイテムのポジションの取得
export async function fetchCustomCoordinateInitialDataAPI(id: string): Promise<InitialItems> {
  return baseFetchAuthAPI(getEndpoint('custom', id));
}

interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
// コーディネート一覧取得
export async function fetchCoordinateListAPI(
  type: CoordinateType,
  page: number = 1,
): Promise<PaginatedResponse<BaseCoordinate>> {
  return baseFetchAuthAPI(`${getEndpoint(type)}?page=${page}`);
}

/* ----------------------------------------------------------------
CREATE
------------------------------------------------------------------ */
// カスタムコーディネートの登録
export async function registerCustomCoordinateAPI(data: CustomCoordinateData) {
  return baseFetchAuthAPI(COORDINATE_CREATE_CUSTOM_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      data: data.data,
      seasons: data.seasons,
      scenes: data.scenes,
      tastes: data.tastes,
    }),
  });
}

// コーディネートの登録
export async function registerCoordinateAPI(type: CoordinateType, formData: FormData) {
  return baseFetchAuthAPI(getEndpoint(type), {
    method: 'POST',
    body: formData,
  });
}

/* ----------------------------------------------------------------
UPDATE
------------------------------------------------------------------ */
// コーディネートの更新
export async function updateCustomCoordinateAPI(id: string, data: CustomCoordinateData) {
  return baseFetchAuthAPI(`${COORDINATE_CREATE_CUSTOM_ENDPOINT}${id}/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      data: data.data,
      seasons: data.seasons,
      scenes: data.scenes,
      tastes: data.tastes,
    }),
  });
}

// コーディネートの更新
export async function updateCoordinateAPI(type: CoordinateType, id: string, formData: FormData) {
  return baseFetchAuthAPI(getEndpoint(type, id), {
    method: 'PUT',
    body: formData,
  });
}

/* ----------------------------------------------------------------
DELETE
------------------------------------------------------------------ */
// コーディネートの削除
export async function deleteCoordinateAPI(type: CoordinateType, id: string) {
  return baseFetchAuthAPI(getEndpoint(type, id), {
    method: 'DELETE',
  });
}

/* ----------------------------------------------------------------
コーディネートの登録済み個数取得
------------------------------------------------------------------ */
export async function fetchCoordinateCountAPI(): Promise<CountDataType> {
  return await baseFetchAuthAPI(COORDINATE_COUNT_ENDPOINT);
}
