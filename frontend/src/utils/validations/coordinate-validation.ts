import { z } from 'zod';
import { requiredImageSchema } from './common-validation';

/* ----------------------------------------------------------------
コーディネート登録時詳細選択
------------------------------------------------------------------ */
// 画像投稿コーディネートスキーマ
export const photoCoordinateCreateFormSchema = z.object({
  image: requiredImageSchema,
  seasons: z.array(z.enum(['spring', 'summer', 'autumn', 'winter'])).optional(),
  tastes: z
    .union([
      z.array(z.string()).max(3, {
        message: 'テイストは3つまでしか選択できません',
      }),
      z.null(),
    ])
    .optional(),
  scenes: z
    .union([
      z.array(z.string()).max(3, {
        message: 'シーンは3つまでしか選択できません',
      }),
      z.null(),
    ])
    .optional(),
});

// カスタムコーディネートスキーマ
export const customCoordinateCreateFormSchema = z.object({
  preview_image: requiredImageSchema,
  items: z.string(), // JSON文字列として受け取るため、string型で定義
  seasons: z.array(z.enum(['spring', 'summer', 'autumn', 'winter'])).optional(),
  tastes: z
    .union([
      z.array(z.string()).max(3, {
        message: 'テイストは3つまでしか選択できません',
      }),
      z.null(),
    ])
    .optional(),
  scenes: z
    .union([
      z.array(z.string()).max(3, {
        message: 'シーンは3つまでしか選択できません',
      }),
      z.null(),
    ])
    .optional(),
});
