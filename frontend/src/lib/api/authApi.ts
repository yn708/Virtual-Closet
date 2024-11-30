'use server';
import type {
  LoginFormData,
  PasswordResetConfirmFormData,
  PasswordResetFormData,
  SignUpFormData,
} from '@/features/auth/types';
import {
  PASSWORD_RESET_CONFIRM_ENDPOINT,
  RESEND_AUTH_CODE_ENDPOINT,
  SEND_AUTH_CODE_ENDPOINT,
  SEND_PASSWORD_RESET_ENDPOINT,
  VERIFY_CODE_ENDPOINT,
} from '@/utils/constants';
import { baseFetchAPI } from './baseApi';

/* ----------------------------------------------------------------
sign-up（認証コード送信）
------------------------------------------------------------------ */
export async function signUpAPI(data: SignUpFormData) {
  return baseFetchAPI(SEND_AUTH_CODE_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: data.email,
      password1: data.password,
      password2: data.passwordConfirmation,
    }),
  });
}

/* ----------------------------------------------------------------
sign-up（認証コード検証）
------------------------------------------------------------------ */
export async function confirmRegistrationAPI(email: string, confirmationCode: string) {
  return baseFetchAPI(VERIFY_CODE_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, confirmation_code: confirmationCode }),
  });
}

/* ----------------------------------------------------------------
sign-up（認証コード再送信）
------------------------------------------------------------------ */
export async function resendCodeAPI(data: LoginFormData) {
  return baseFetchAPI(RESEND_AUTH_CODE_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
}

/* ----------------------------------------------------------------
パスワードリセットメールの送信
------------------------------------------------------------------ */
export async function sendPasswordResetAPI(data: PasswordResetFormData) {
  return baseFetchAPI(SEND_PASSWORD_RESET_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
}

/* ----------------------------------------------------------------
パスワードリセット
------------------------------------------------------------------ */
export async function passwordResetAPI(
  uid: string,
  token: string,
  data: PasswordResetConfirmFormData,
) {
  return baseFetchAPI(PASSWORD_RESET_CONFIRM_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      uid,
      token,
      new_password1: data.password,
      new_password2: data.passwordConfirmation,
    }),
  });
}
