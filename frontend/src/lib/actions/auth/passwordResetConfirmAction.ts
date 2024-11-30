'use server';

import { passwordResetAPI } from '@/lib/api/authApi';
import type { FormState } from '@/types';
import { LOGIN_URL } from '@/utils/constants';
import { passwordResetConfirmFormSchema } from '@/utils/validations/auth-validation';
import { redirect } from 'next/navigation';

export async function passwordResetConfirmAction(
  _prevState: FormState,
  formData: FormData,
  uid: string,
  token: string,
) {
  // バリデーションと取得
  const validatedFields = passwordResetConfirmFormSchema.safeParse({
    password: formData.get('password'),
    passwordConfirmation: formData.get('passwordConfirmation'),
  });

  if (!validatedFields.success) {
    return {
      message: 'バリデーションエラー',
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
    };
  }

  // try-catch文を使用するとredirectが機能しないので以下の書き方
  const apiResponse = await passwordResetAPI(uid, token, validatedFields.data).catch((error) => {
    // API通信時のエラーを返す

    if (error instanceof Error) {
      const errorData = JSON.parse(error.message);

      return {
        errors: {
          email: [errorData.email],
        },
        message: null,
        success: false,
      };
    }
    // その他の予期せぬエラー
    return {
      errors: {
        _form: ['予期せぬエラーが発生しました。'],
      },
      message: 'エラーが発生しました。',
      success: false,
    };
  });

  // エラーの場合はエラーを返す
  if ('errors' in apiResponse) {
    return apiResponse;
  }

  redirect(LOGIN_URL); // ホームページにリダイレクト
}
