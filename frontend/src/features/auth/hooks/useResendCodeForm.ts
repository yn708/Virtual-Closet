'use client';

import { useGenericForm } from '@/hooks/form/useGenericForm';
import { useToast } from '@/hooks/use-toast';
import { resendCodeAPI } from '@/lib/api/authApi';

import { loginFormSchema } from '@/utils/validations/auth-validation';
import type { LoginFormData } from '../types';

export const useResendCodeForm = (email: string | null, onResendSuccess: () => void) => {
  const { toast } = useToast();
  const { form, onSubmit } = useGenericForm<LoginFormData>({
    schema: loginFormSchema,
    defaultValues: {
      email: '',
      password: '',
    },
    onBeforeSubmit: async (data) => {
      if (data.email !== email) {
        throw new Error('入力されたメールアドレスが一致しません。'); // エラーをキャッチに投げてあげる
      }
    },

    onSubmitSuccess: async (data) => {
      await resendCodeAPI(data);
      toast({
        title: '認証コード再送信',
        description: '新しい認証コードを送信しました。',
        duration: 3000,
      });
      onResendSuccess();
    },
    onSubmitError: (error) => {
      toast({
        title: 'エラー',
        description: error instanceof Error ? error.message : 'コードの再送信に失敗しました',
        variant: 'destructive',
      });
    },
  });

  return { form, onSubmit };
};
