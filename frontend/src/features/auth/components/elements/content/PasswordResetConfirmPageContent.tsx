'use client';
import CenterTitleLayout from '@/components/layout/CenterTitleLayout';
import type { PasswordResetConfirmFormData } from '@/features/auth/types';
import { useGenericForm } from '@/hooks/form/useGenericForm';
import { useToast } from '@/hooks/use-toast';
import { passwordResetAPI } from '@/lib/api/authApi';
import { ERROR_DESCRIPTION_MESSAGE, ERROR_MESSAGE, LOGIN_URL } from '@/utils/constants';
import { passwordResetConfirmFormSchema } from '@/utils/validations/user-validation';
import AuthForm from '../form/AuthForm';

type PasswordResetContentProps = {
  uid: string;
  token: string;
};

const PasswordResetConfirmPageContent = ({ uid, token }: PasswordResetContentProps) => {
  const { toast } = useToast();

  const { form, onSubmit, router } = useGenericForm<PasswordResetConfirmFormData>({
    schema: passwordResetConfirmFormSchema,
    defaultValues: {
      password: '',
      passwordConfirmation: '',
    },
    onSubmitSuccess: async (data) => {
      await passwordResetAPI(
        uid, // URLから取得したuidを追加
        token, // URLから取得したtokenを追加
        data,
      );
      toast({
        title: 'パスワードの再設定完了',
        description: 'ログイン画面に移動します。',
      });
      router.push(LOGIN_URL);
    },
    onSubmitError: (error) => {
      if (error instanceof Error) {
        const errorData = JSON.parse(error.message);

        toast({
          title: 'エラー',
          description: errorData.token,
          variant: 'destructive',
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

  return (
    <CenterTitleLayout title="パスワード再設定" description="新しいパスワードを入力してください。">
      <div className="max-w-xl -ml-5">
        <AuthForm
          form={form}
          onSubmit={onSubmit}
          submitButtonLabel="送信"
          mode="password"
          passwordLabel="新しい"
        />
      </div>
    </CenterTitleLayout>
  );
};
export default PasswordResetConfirmPageContent;
