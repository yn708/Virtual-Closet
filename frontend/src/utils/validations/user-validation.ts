import { z } from 'zod';
import { optionalImageSchema } from './common-validation';

/* ----------------------------------------------------------------
プロフィールアップデート用
------------------------------------------------------------------ */
export const profileUpdateFormSchema = z
  .object({
    username: z
      .string()
      .min(5, { message: 'ユーザー名は5文字以上で入力してください。' })
      .max(30, { message: 'ユーザー名は30文字以内で入力してください。' }),
    name: z
      .string()
      .max(30, { message: '名前は30文字以内で入力してください。' })
      .optional()
      .nullable(),
    birth_year: z.string().optional().nullable(),
    birth_month: z.string().optional().nullable(),
    birth_day: z.string().optional().nullable(),
    gender: z
      .union([z.enum(['male', 'female', 'other', 'unanswered']), z.literal('')])
      .optional()
      .nullable(),
    profile_image: optionalImageSchema,
    height: z
      .string()
      .refine(
        (val) => {
          if (val === '') return true;
          const num = parseFloat(val);
          return !isNaN(num) && num >= 1 && num < 300;
        },
        { message: '身長は1cm以上300cm未満で入力してください。' },
      )
      .optional()
      .nullable(),
  })
  .superRefine((data, ctx) => {
    // いずれかの値が入力されている場合は全ての値が必要
    if (data.birth_year || data.birth_month || data.birth_day) {
      if (!data.birth_year || !data.birth_month || !data.birth_day) {
        // birth_yearにはメッセージ付きでエラーを追加
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: '設定する場合は年・月・日すべての入力が必要です',
          path: ['birth_year'],
        });
        // birth_month, birth_dayには空メッセージでエラーを追加
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: '',
          path: ['birth_month'],
        });
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: '',
          path: ['birth_day'],
        });
      }
    }
  });
