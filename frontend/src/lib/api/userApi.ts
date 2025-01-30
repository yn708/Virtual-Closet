'use server';
import { USER_DETAIL_ENDPOINT, USER_UPDATE_ENDPOINT } from '@/utils/constants';
import { baseFetchAuthAPI } from './baseApi';

/* ----------------------------------------------------------------
User情報取得
------------------------------------------------------------------ */
export async function fetchUserDataAPI() {
  return baseFetchAuthAPI(USER_DETAIL_ENDPOINT);
}

/* ----------------------------------------------------------------
プロフィール更新
------------------------------------------------------------------ */
export async function updateUserProfileAPI(data: FormData) {
  return baseFetchAuthAPI(USER_UPDATE_ENDPOINT, {
    method: 'PUT',
    body: data,
  });
}
