'use server';

import type { CoordinateMetaDataType } from '@/types/coordinate';
import {
  COORDINATE_CREATE_CUSTOM_ENDPOINT,
  COORDINATE_CREATE_PHOTO_ENDPOINT,
  COORDINATE_METADATA_ENDPOINT,
} from '@/utils/constants';
import { baseFetchAuthAPI } from './baseApi';

/* ----------------------------------------------------------------
コーディネート登録時に必要なデータの取得
シーズン・シーン・テイストを取得する関数
------------------------------------------------------------------ */
export async function fetchCoordinateMetaDataAPI(): Promise<CoordinateMetaDataType> {
  return baseFetchAuthAPI(COORDINATE_METADATA_ENDPOINT, { cache: 'force-cache' });
}

/* ----------------------------------------------------------------
コーディネートの登録
------------------------------------------------------------------ */
export async function registerPhotoCoordinateAPI(formData: FormData) {
  return baseFetchAuthAPI(COORDINATE_CREATE_PHOTO_ENDPOINT, {
    method: 'POST',
    body: formData,
  });
}

/* ----------------------------------------------------------------
コーディネートの登録
------------------------------------------------------------------ */
export async function registerCustomCoordinateAPI(formData: FormData) {
  return baseFetchAuthAPI(COORDINATE_CREATE_CUSTOM_ENDPOINT, {
    method: 'POST',
    body: formData,
  });
}
