'use server';

import { IMAGE_REMOVE_BG_ENDPOINT } from '@/utils/constants';
import { baseFetchAuthAPI } from './baseApi';

/* ----------------------------------------------------------------
画像背景除去
------------------------------------------------------------------ */
export async function removeBackgroundAPI(formData: FormData) {
  return baseFetchAuthAPI(IMAGE_REMOVE_BG_ENDPOINT, {
    method: 'POST',
    body: formData,
  });
}
