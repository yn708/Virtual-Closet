'use server';

import { signUpAPI } from '@/lib/api/authApi';
import type { FormStateWithEmail } from '@/types';
import { ERROR_DESCRIPTION_MESSAGE, ERROR_MESSAGE } from '@/utils/constants';

import { signUpFormSchema } from '@/utils/validations/auth-validation';

export async function signUpAction(_prevState: FormStateWithEmail, formData: FormData) {
  // バリデーションと取得
  const validatedFields = signUpFormSchema.safeParse({
    email: formData.get('email'),
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
  const apiResponse = await signUpAPI(validatedFields.data).catch((error) => {
    // API通信時のエラーを返す
    if (error instanceof Error) {
      const errorData = JSON.parse(error.message);
      return {
        errors: {
          email: [errorData.detail],
        },
        message: null,
        success: false,
      };
    }
    // その他の予期せぬエラー
    return {
      errors: {
        _form: [ERROR_MESSAGE],
      },
      message: ERROR_DESCRIPTION_MESSAGE,
      success: false,
    };
  });

  // エラーの場合はエラーを返す
  if ('errors' in apiResponse) {
    return apiResponse;
  }

  return {
    message: '確認コードを送信しました',
    errors: null,
    success: true,
    email: validatedFields.data.email, // emailを追加
  };
}
