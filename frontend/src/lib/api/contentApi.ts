'use server';
import type { ContactSubmitData } from '@/features/contact/types';
import { ANONYMOUS_CONTACT_ENDPOINT, AUTHENTICATED_CONTACT_ENDPOINT } from '@/utils/constants';
import { baseFetchAPI, baseFetchAuthAPI } from './baseApi';

/* ----------------------------------------------------------------
お問い合わせ送信API（認証済みユーザーとそうでないユーザーで分岐）
------------------------------------------------------------------ */
export const submitContactAPI = async (formData: ContactSubmitData, isAuthenticated: boolean) => {
  if (isAuthenticated) {
    return baseFetchAuthAPI(AUTHENTICATED_CONTACT_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        subject: formData.subject,
        message: formData.message,
      }),
    });
  } else {
    return baseFetchAPI(ANONYMOUS_CONTACT_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
      }),
    });
  }
};
