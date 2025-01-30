import { z } from 'zod';
import { optionalImageSchema, requiredImageSchema } from './common-validation';

/* ----------------------------------------------------------------
ファッションアイテム登録時詳細選択
------------------------------------------------------------------ */
export const fashionItemCreateFormSchema = z.object({
  sub_category: z.string().min(1, { message: '必須' }),
  brand: z.string().nullable().optional(),
  seasons: z.array(z.enum(['spring', 'summer', 'autumn', 'winter'])).optional(), // 任意選択可能
  design: z.string().nullable().optional(), // 任意選択可能
  price_range: z.string().nullable().optional(), // 任意選択可能
  main_color: z.string().nullable().optional(), // 任意選択可能
  image: requiredImageSchema,
  is_owned: z.boolean(),
  is_old_clothes: z.boolean(),
});

/* ----------------------------------------------------------------
ファッションアイテム更新時詳細選択
すべて任意選択
------------------------------------------------------------------ */
export const fashionItemUpdateFormSchema = z.object({
  sub_category: z.string().nullable().optional(),
  brand: z.string().nullable().optional(),
  seasons: z.array(z.enum(['spring', 'summer', 'autumn', 'winter'])).optional(),
  design: z.string().nullable().optional(),
  price_range: z.string().nullable().optional(),
  main_color: z.string().nullable().optional(),
  image: optionalImageSchema,
  is_owned: z.boolean(),
  is_old_clothes: z.boolean(),
});
