import { z } from 'zod';

/* ----------------------------------------------------------------
お問合せフォーム用
------------------------------------------------------------------ */
const baseContactSchema = {
  subject: z.string().min(1, { message: '選択してください' }),
  message: z
    .string()
    .min(10, { message: '10文字以上で入力してください' })
    .max(700, { message: '700文字以内で入力してください' }),
  privacyAgreed: z.literal(true, {
    errorMap: () => ({ message: 'プライバシーポリシーに同意してください' }),
  }),
};

export const anonymousContactSchema = z.object({
  ...baseContactSchema,
  name: z
    .string()
    .min(1, { message: 'お名前を入力してください' })
    .max(20, { message: '20文字以内で入力してください' }),
  email: z.string().email({ message: '有効なメールアドレスを入力してください' }),
});

export const authenticatedContactSchema = z.object(baseContactSchema);
