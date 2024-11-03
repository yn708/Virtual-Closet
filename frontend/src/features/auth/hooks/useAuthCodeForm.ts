'use client';
import { useGenericForm } from '@/hooks/form/useGenericForm';
import { useToast } from '@/hooks/use-toast';
import { confirmRegistrationAPI } from '@/lib/api/authApi';
import { TOP_URL } from '@/utils/constants';
import { authCodeFormSchema } from '@/utils/validations/user-validation';

import { signIn } from 'next-auth/react';
import type { AuthCodeFormSchema } from '../types';

export default function useAuthCodeForm(email: string) {
  const { toast } = useToast();
  const { form, onSubmit } = useGenericForm<AuthCodeFormSchema>({
    schema: authCodeFormSchema,
    defaultValues: { code: '' },

    onSubmitSuccess: async (data) => {
      const responseData = await confirmRegistrationAPI(email, data.code);
      await signIn('credentials', {
        email,
        token: responseData.key,
        callbackUrl: TOP_URL,
      });
    },

    onSubmitError: (error) => {
      if (error instanceof Error) {
        try {
          const parsedError = JSON.parse(error.message);
          if (parsedError.detail) {
            toast({
              title: 'エラー',
              description: parsedError.detail,
              variant: 'destructive',
            });
            return;
          }
        } catch {
          // JSON解析に失敗した場合はデフォルトのエラーメッセージを表示
        }
        // JSONでないエラーまたは detail がない場合はデフォルトメッセージを表示
        toast({
          title: 'エラー',
          description: '確認に失敗しました',
          variant: 'destructive',
        });
      }
    },
  });

  return { form, onSubmit };
}
