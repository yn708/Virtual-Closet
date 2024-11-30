'use server';

import type { LoginFormState } from '@/types';
import { loginFormSchema } from '@/utils/validations/auth-validation';

export async function loginAction(
  _prevState: LoginFormState,
  formData: FormData,
): Promise<LoginFormState> {
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

  return {
    message: null,
    errors: null,
    success: true,
    email: validatedFields.data.email,
    password: validatedFields.data.password,
  };
}
