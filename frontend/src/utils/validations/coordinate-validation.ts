import { z } from 'zod';
import { optionalImageSchema, requiredImageSchema } from './common-validation';

/* ----------------------------------------------------------------
共通のスキーマ定義
------------------------------------------------------------------ */
const baseSeasonSchema = z
  .union([
    z.array(z.string()).max(4, {
      message: 'シーズンは4つまでしか選択できません',
    }),
    z.null(),
  ])
  .optional();
const baseAttributeSchema = z
  .union([
    z.array(z.string()).max(3, {
      message: 'テイストは3つまでしか選択できません',
    }),
    z.null(),
  ])
  .optional();

const createBaseCoordinateSchema = (imageSchema: z.ZodType) =>
  z.object({
    image: imageSchema,
    seasons: baseSeasonSchema,
    tastes: baseAttributeSchema,
    scenes: z
      .union([
        z.array(z.string()).max(3, {
          message: 'シーンは3つまでしか選択できません',
        }),
        z.null(),
      ])
      .optional(),
  });

/* ----------------------------------------------------------------
コーディネート登録時詳細選択
------------------------------------------------------------------ */
const baseCreateSchema = createBaseCoordinateSchema(requiredImageSchema);

// 画像投稿コーディネートスキーマ
export const photoCoordinateCreateFormSchema = baseCreateSchema;

// カスタムコーディネートスキーマ
export const customCoordinateCreateFormSchema = baseCreateSchema.extend({
  items: z.string(), // JSON文字列として受け取るため、string型で定義
});

/* ----------------------------------------------------------------
コーディネート更新時詳細選択
------------------------------------------------------------------ */
const baseUpdateSchema = createBaseCoordinateSchema(optionalImageSchema);

// 画像投稿コーディネートスキーマ
export const photoCoordinateUpdateFormSchema = baseUpdateSchema;

// カスタムコーディネートスキーマ
export const customCoordinateUpdateFormSchema = baseUpdateSchema.extend({
  items: z.string().nullable().optional(),
});
