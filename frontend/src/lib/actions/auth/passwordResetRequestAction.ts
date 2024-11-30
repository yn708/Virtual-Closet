'use server';

import { sendPasswordResetAPI } from '@/lib/api/authApi';
import type { FormStateWithEmail } from '@/types';
import { passwordResetFormSchema } from '@/utils/validations/auth-validation';

export async function passwordResetRequestAction(
  _prevState: FormStateWithEmail,
  formData: FormData,
) {
  // バリデーションと取得
  const validatedFields = passwordResetFormSchema.safeParse({
    email: formData.get('email'),
  });

  if (!validatedFields.success) {
    return {
      message: 'バリデーションエラー',
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
    };
  }

  // try-catch文を使用するとredirectが機能しないので以下の書き方
  const apiResponse = await sendPasswordResetAPI(validatedFields.data).catch((error) => {
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

  // 成功時は success: true を返す
  return {
    message: 'メールアドレス宛にパスワード再設定用のURLを送信しました。',
    errors: null,
    success: true,
  };
}
