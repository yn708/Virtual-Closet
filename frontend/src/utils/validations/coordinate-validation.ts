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

const createBaseCoordinateSchema = () =>
  z.object({
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

export const baseCoordinateSchema = createBaseCoordinateSchema();

/* ----------------------------------------------------------------
コーディネート登録時詳細選択
------------------------------------------------------------------ */
// 画像投稿コーディネートスキーマ
export const photoCoordinateCreateFormSchema = baseCoordinateSchema.extend({
  image: requiredImageSchema,
});

/* ----------------------------------------------------------------
コーディネート更新時詳細選択
------------------------------------------------------------------ */
// 画像投稿コーディネートスキーマ
export const photoCoordinateUpdateFormSchema = baseCoordinateSchema.extend({
  image: optionalImageSchema,
});
