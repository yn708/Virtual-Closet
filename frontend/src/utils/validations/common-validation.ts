import { z } from 'zod';
import { ALLOWED_IMAGE_TYPES, MAX_FILE_SIZE, MIN_PASSWORD_LENGTH } from '../constants';

/* ----------------------------------------------------------------
認証系
------------------------------------------------------------------ */
// パスワード作成時
export const createPasswordSchema = z
  .string()
  .min(MIN_PASSWORD_LENGTH, {
    message: `${MIN_PASSWORD_LENGTH}文字以上である必要があります。`,
  })
  .regex(/[A-Z]/, {
    message: '大文字を含む必要があります。',
  })
  .regex(/[a-z]/, {
    message: '小文字を含む必要があります。',
  })
  .regex(/[0-9]/, {
    message: '数字を含む必要があります。',
  })
  .refine((password) => !/(.)\1{2,}/.test(password), {
    message: '3回以上連続する文字を含めることはできません。',
  });

// Email
export const emailSchema = z.string().email({ message: 'メールアドレスの形式ではありません' });

/* ----------------------------------------------------------------
画像関連
------------------------------------------------------------------ */
// 任意の画像スキーマ
export const optionalImageSchema = z.union([
  z.instanceof(File).superRefine((file, ctx) => {
    if (file?.size === 0) {
      // ファイルサイズが0の場合にFileがないと判断し、検証をスキップ
      return true;
    }

    // 画像の形式チェック
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      ctx.addIssue({
        code: 'custom',
        message: 'JPEG, PNG, GIF、HEIC, WebP形式の画像のみがサポートされています。',
      });
    }

    // 画像サイズのチェック
    if (file.size > MAX_FILE_SIZE) {
      ctx.addIssue({
        code: 'custom',
        message: `画像サイズは${MAX_FILE_SIZE / 1024 / 1024}MB以下にしてください。`,
      });
    }
  }),
  z.null(),
]);

// 必須の画像スキーマ
export const requiredImageSchema = z
  .instanceof(File)
  .refine((file) => file && file.size > 0, {
    message: '画像を選択してください。',
  })
  .refine((file) => ALLOWED_IMAGE_TYPES.includes(file.type), {
    message: 'JPEG, PNG, GIF、HEIC, WebP形式の画像のみがサポートされています。',
  })
  .refine((file) => file.size <= MAX_FILE_SIZE, {
    message: `画像サイズは${MAX_FILE_SIZE / 1024 / 1024}MB以下にしてください。`,
  });
