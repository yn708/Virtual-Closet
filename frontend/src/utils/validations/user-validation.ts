import { z } from 'zod';
import { imageSchema } from './common-validation';

/* ----------------------------------------------------------------
プロフィールアップデート用
------------------------------------------------------------------ */
export const ProfileUpdateFormSchema = z
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

    profile_image: imageSchema.optional().nullable(),
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
  .refine(
    (data) => {
      const { birth_year, birth_month, birth_day } = data;
      // すべてnullの場合は有効
      if (!birth_year && !birth_month && !birth_day) return true;
      // 一部でも値がある場合は、すべての値が必要
      return !!birth_year && !!birth_month && !!birth_day;
    },
    {
      message: '生年月日は年、月、日のすべてを入力してください。',
      path: ['birth_year'],
    },
  );
