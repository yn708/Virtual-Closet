import { z } from 'zod';
import { AUTH_CODE_LENGTH, MIN_PASSWORD_LENGTH } from '../constants';
import { createPasswordSchema, emailSchema } from './common-validation';

/* ----------------------------------------------------------------
サインアップ
------------------------------------------------------------------ */
export const signUpFormSchema = z
  .object({
    email: emailSchema,
    password: createPasswordSchema,
    passwordConfirmation: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: 'パスワードが一致しません',
    path: ['passwordConfirmation'],
  });

/* ----------------------------------------------------------------
ログイン
------------------------------------------------------------------ */
export const loginFormSchema = z.object({
  email: emailSchema,
  password: z.string().min(MIN_PASSWORD_LENGTH, {
    message: `パスワードは${MIN_PASSWORD_LENGTH}文字以上である必要があります`,
  }),
});
/* ----------------------------------------------------------------
認証コード
------------------------------------------------------------------ */
export const authCodeFormSchema = z.object({
  code: z.string().length(AUTH_CODE_LENGTH, {
    message: `認証コードは${AUTH_CODE_LENGTH}桁で入力してください。`,
  }),
});

/* ----------------------------------------------------------------
パスワードリセット用
------------------------------------------------------------------ */
// Email送信
export const passwordResetFormSchema = z.object({
  email: emailSchema,
});

// パスワード設定
export const passwordResetConfirmFormSchema = z
  .object({
    password: createPasswordSchema,
    passwordConfirmation: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: 'パスワードが一致しません',
    path: ['passwordConfirmation'],
  });
