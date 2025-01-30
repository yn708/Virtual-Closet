'use server';

import { confirmRegistrationAPI } from '@/lib/api/authApi';
import type { FormStateWithToken } from '@/types';
import { authCodeFormSchema } from '@/utils/validations/auth-validation';

export async function sendCodeAction(_prevState: FormStateWithToken, formData: FormData) {
  // emailの存在チェック
  const email = formData.get('email')?.toString();
  if (!email) {
    return {
      message: 'バリデーションエラー',
      errors: { email: ['メールアドレスは必須です'] },
      success: false,
    };
  }
  const validatedFields = authCodeFormSchema.safeParse({
    code: formData.get('code'),
  });

  if (!validatedFields.success) {
    return {
      message: 'バリデーションエラー',
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
    };
  }

  const apiResponse = await confirmRegistrationAPI(email, validatedFields.data.code).catch(
    (error) => {
      if (error instanceof Error) {
        const errorData = JSON.parse(error.message);
        return {
          errors: {
            code: [errorData.detail],
          },
          message: null,
          success: false,
        };
      }
      return {
        errors: {
          _form: ['予期せぬエラーが発生しました。'],
        },
        message: 'エラーが発生しました。',
        success: false,
      };
    },
  );

  if ('errors' in apiResponse) {
    return apiResponse;
  }

  // APIが成功した場合、トークンを含めて返す
  return {
    message: null,
    errors: null,
    success: true,
    token: apiResponse.key, // トークンを返す
  };
}
