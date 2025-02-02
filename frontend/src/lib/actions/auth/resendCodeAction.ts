'use server';

import { resendCodeAPI } from '@/lib/api/authApi';
import type { FormState } from '@/types';
import { loginFormSchema } from '@/utils/validations/auth-validation';

export async function resendCodeAction(
  currentEmail: string,
  _prevState: FormState,
  formData: FormData,
) {
  // バリデーションと取得
  const validatedFields = loginFormSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!validatedFields.success) {
    return {
      message: 'バリデーションエラー',
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
    };
  }

  // 入力されたメールアドレスと現在のメールアドレスを比較
  if (validatedFields.data.email !== currentEmail) {
    return {
      message: 'メールアドレスが一致しません',
      errors: {
        email: ['認証を受けたメールアドレスを入力してください。'],
      },
      success: false,
    };
  }

  // try-catch文を使用するとredirectが機能しないので以下の書き方
  const apiResponse = await resendCodeAPI(validatedFields.data).catch((error) => {
    // API通信時のエラーを返す
    if (error instanceof Error) {
      const errorData = JSON.parse(error.message);
      return {
        errors: {
          email: [errorData.detail],
        },
        message: errorData.detail,
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

  // 成功時は success: true を返す
  return {
    message: '確認コードを送信しました',
    errors: null,
    success: true,
  };
}
