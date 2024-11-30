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
// 共通の画像ファイル検証ロジック
const baseImageSchema = () => {
  // ファイルの基本的なバリデーション
  const fileValidation = z
    .instanceof(File)
    .refine((file) => ALLOWED_IMAGE_TYPES.includes(file.type), {
      message: 'JPEG, PNG, GIF、HEIC形式の画像のみがサポートされています。',
    })
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: `画像サイズは${MAX_FILE_SIZE / 1024 / 1024}MB以下にしてください。`,
    });

  // 共通の前処理
  const preprocess = (val: unknown) => {
    if (val instanceof File && val.name !== 'undefined') {
      return val;
    }
    return null;
  };

  return { fileValidation, preprocess };
};

// 任意の画像スキーマ
export const optionalImageSchema = z.preprocess(
  baseImageSchema().preprocess,
  z.union([baseImageSchema().fileValidation, z.null()]),
);

// 必須の画像スキーマ
export const requiredImageSchema = z.preprocess(
  baseImageSchema().preprocess,
  // 一時的にnull許容をしてエラーメッセージを表示
  z.union([baseImageSchema().fileValidation, z.null()]).refine((val) => val !== null, {
    message: '画像ファイルは必須です。',
  }),
);
