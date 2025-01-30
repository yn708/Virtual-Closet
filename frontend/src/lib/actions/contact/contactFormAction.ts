'use server';

import { submitContactAPI } from '@/lib/api/contentApi';
import { authOptions } from '@/lib/next-auth';
import type { FormState } from '@/types';
import {
  anonymousContactSchema,
  authenticatedContactSchema,
} from '@/utils/validations/contact-validation';
import { getServerSession } from 'next-auth';

// フォームデータの取得と整形
const getContactFormFields = (formData: FormData) => {
  return {
    name: formData.get('name'),
    email: formData.get('email'),
    subject: formData.get('subject'),
    message: formData.get('message'),
    privacyAgreed: formData.get('privacyAgreed') === 'true',
  };
};

// お問い合わせフォーム送信アクション
export async function contactFormAction(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  try {
    const session = await getServerSession(authOptions);
    const isAuthenticated = !!session;

    // フォームデータの取得
    const fields = getContactFormFields(formData);

    // バリデーション
    const schema = isAuthenticated ? authenticatedContactSchema : anonymousContactSchema;
    const validatedFields = schema.safeParse(fields);

    // バリデーションエラー時
    if (!validatedFields.success) {
      return {
        message: 'バリデーションエラー',
        errors: validatedFields.error.flatten().fieldErrors,
        success: false,
      };
    }

    // API送信
    await submitContactAPI(validatedFields.data, isAuthenticated);

    return {
      message: 'お問い合わせを受け付けました',
      errors: null,
      success: true,
    };
  } catch (error) {
    return {
      message: error instanceof Error ? error.message : '予期せぬエラーが発生しました',
      errors: null,
      success: false,
    };
  }
}
