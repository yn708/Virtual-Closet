'use client';
import { useGenericForm } from '@/hooks/form/useGenericForm';
import { signUpAPI } from '@/lib/api/authApi';
import { CONFIRM_CODE_URL } from '@/utils/constants';
import { signUpFormSchema } from '@/utils/validations/auth-validation';
import type { SignUpFormData } from '../types';

export const useSignUp = (onSuccess?: () => void) => {
  const { form, onSubmit, isLoading, router } = useGenericForm<SignUpFormData>({
    schema: signUpFormSchema,
    defaultValues: {
      email: '',
      password: '',
      passwordConfirmation: '',
    },
    onSubmitSuccess: async (data) => {
      await signUpAPI(data);
      sessionStorage.setItem('email', data.email);
      router.push(CONFIRM_CODE_URL);
      onSuccess?.();
    },
    onSubmitError: (error) => {
      if (error instanceof Error) {
        const errorData = JSON.parse(error.message);
        form.setError('email', {
          type: 'server',
          message: errorData.detail,
        });
      }
    },
  });

  return { form, onSubmit, isLoading };
};
