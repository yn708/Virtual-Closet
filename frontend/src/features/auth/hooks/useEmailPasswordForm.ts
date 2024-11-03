'use client';
import { useGenericForm } from '@/hooks/form/useGenericForm';
import { useToast } from '@/hooks/use-toast';
import { verifyEmailPasswordAPI } from '@/lib/api/authApi';

import { loginFormSchema } from '@/utils/validations/user-validation';
import type { LoginFormData } from '../types';

export const useEmailPasswordForm = (onEmailVerified: (email: string) => void) => {
  const { toast } = useToast();

  const { form, onSubmit } = useGenericForm<LoginFormData>({
    schema: loginFormSchema,
    defaultValues: {
      email: '',
      password: '',
    },
    onSubmitSuccess: async (data) => {
      await verifyEmailPasswordAPI(data);
      sessionStorage.setItem('email', data.email);
      onEmailVerified(data.email); // ここで確認されたメールアドレスを親に通知
      toast({
        title: '確認完了',
        description: 'メールアドレスとパスワードが確認されました。',
        duration: 3000,
      });
    },
    onSubmitError: (error) => {
      if (error instanceof Error) {
        const parsedError = JSON.parse(error.message);
        if (parsedError.detail) {
          toast({
            title: 'エラー',
            description: parsedError.detail,
            variant: 'destructive',
          });
        }
      } else {
        toast({
          title: 'エラー',
          description: '確認に失敗しました',
          variant: 'destructive',
        });
      }
    },
  });

  return { form, onSubmit };
};
