'use client';

import { useGenericForm } from '@/hooks/form/useGenericForm';
import { useToast } from '@/hooks/use-toast';
import { TOP_URL } from '@/utils/constants';
import { loginFormSchema } from '@/utils/validations/user-validation';
import { signIn } from 'next-auth/react';
import type { LoginFormData } from '../types';

export const useLogin = () => {
  const { toast } = useToast();

  const { form, onSubmit, isLoading, router } = useGenericForm<LoginFormData>({
    schema: loginFormSchema,
    defaultValues: {
      email: '',
      password: '',
    },
    onSubmitSuccess: async (data) => {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false, // Toast等のその後に行いたい処理があるため、falseに設定しておく
      });

      if (result?.error) {
        throw new Error(result.error);
      } else if (result?.ok) {
        router.push(TOP_URL);
      }
    },
    onSubmitError: () => {
      toast({
        title: 'ログイン失敗',
        description: 'メールアドレスまたはパスワードが正しくありません。',
        variant: 'destructive',
      });
    },
  });

  return { form, onSubmit, isLoading };
};
