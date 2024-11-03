'use client';

import { useGenericForm } from '@/hooks/form/useGenericForm';
import { useToast } from '@/hooks/use-toast';
import { sendPasswordResetAPI } from '@/lib/api/authApi';
import { ERROR_DESCRIPTION_MESSAGE, ERROR_MESSAGE } from '@/utils/constants';
import { passwordResetFormSchema } from '@/utils/validations/user-validation';
import type { PasswordResetFormData } from '../types';

export const useSendPasswordResetUrl = () => {
  const { toast } = useToast();

  const { form, onSubmit, isLoading } = useGenericForm<PasswordResetFormData>({
    schema: passwordResetFormSchema,
    defaultValues: {
      email: '',
    },
    onSubmitSuccess: async (data) => {
      await sendPasswordResetAPI(data);
      toast({
        title: 'メールアドレス宛にパスワード再設定用のURLを送信しました。',
        description: 'ご確認をよろしくお願いします。',
      });
    },
    onSubmitError: (error) => {
      if (error instanceof Error) {
        const errorData = JSON.parse(error.message);
        form.setError('email', {
          type: 'server',
          message: errorData.email[0],
        });
      } else {
        toast({
          title: ERROR_MESSAGE,
          description: ERROR_DESCRIPTION_MESSAGE,
          variant: 'destructive',
        });
      }
    },
  });

  return { form, onSubmit, isLoading };
};
