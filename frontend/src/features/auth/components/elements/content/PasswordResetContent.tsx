'use client';
import NormalLink from '@/components/elements/link/NormalLink';
import TitleLayout from '@/components/layout/TitleLayout';
import type { PasswordResetContentProps } from '@/features/auth/types';
import { useToast } from '@/hooks/use-toast';
import { passwordResetConfirmAction } from '@/lib/actions/auth/passwordResetConfirmAction';
import { passwordResetRequestAction } from '@/lib/actions/auth/passwordResetRequestAction';
import type { FormState } from '@/types';
import { LOGIN_URL } from '@/utils/constants';
import { initialState } from '@/utils/data/initialState';
import { useEffect } from 'react';
import { useFormState } from 'react-dom';
import AuthForm from '../form/AuthForm';

const PasswordResetContent = ({ mode, uid = '', token = '' }: PasswordResetContentProps) => {
  const boundFormAction =
    mode === 'request'
      ? passwordResetRequestAction
      : (prevState: FormState, formData: FormData) =>
          passwordResetConfirmAction(prevState, formData, uid, token);

  const [state, formAction] = useFormState(boundFormAction, initialState);
  const { toast } = useToast();
  useEffect(() => {
    if (mode === 'request' && state.success && state.message) {
      toast({
        title: state.message,
      });
    }
  }, [state.success, state.message, mode, toast]);

  return (
    <main className="min-h-screen flex justify-center items-center">
      <TitleLayout
        title="パスワード再設定"
        description={
          mode === 'request'
            ? '登録済みのメールアドレス宛にパスワード再設定用のURLを通知いたします。'
            : '新しいパスワードを入力してください。'
        }
      >
        <div className="max-w-xl -ml-5">
          <AuthForm
            state={state}
            formAction={formAction}
            submitButtonLabel={mode === 'request' ? '送信' : '保存'}
            mode={mode === 'request' ? 'email-only' : 'password'}
            passwordLabel={mode === 'confirm' ? '新しい' : undefined}
          />
        </div>
        {mode === 'request' && <NormalLink href={LOGIN_URL} label="ログインに戻る" />}
      </TitleLayout>
    </main>
  );
};

export default PasswordResetContent;
