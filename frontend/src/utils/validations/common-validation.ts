import { z } from 'zod';
import { MIN_PASSWORD_LENGTH } from '../constants';

/* ----------------------------------------------------------------
認証系
------------------------------------------------------------------ */
// パスワード作成時
export const createPasswordSchema = z
  .string()
  .min(MIN_PASSWORD_LENGTH, {
    message: `パスワードは${MIN_PASSWORD_LENGTH}文字以上である必要があります`,
  })
  .regex(/[A-Z]/, {
    message: 'パスワードは少なくとも1つの大文字を含む必要があります',
  })
  .regex(/[a-z]/, {
    message: 'パスワードは少なくとも1つの小文字を含む必要があります',
  })
  .regex(/[0-9]/, {
    message: 'パスワードは少なくとも1つの数字を含む必要があります',
  })
  .refine((password) => !/(.)\1{2,}/.test(password), {
    message: 'パスワードに3回以上連続する文字を含めることはできません',
  });

// Email
export const emailSchema = z.string().email({ message: 'メールアドレスの形式ではありません' });
