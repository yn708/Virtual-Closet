'use client';
import NormalLink from '@/components/elements/link/NormalLink';
import CenterTitleLayout from '@/components/layout/CenterTitleLayout';
import { useSendPasswordResetUrl } from '@/features/auth/hooks/useSendPasswordResetUrl';
import { LOGIN_URL } from '@/utils/constants';
import AuthForm from '../form/AuthForm';

const PasswordResetPageContent = () => {
  const { form, onSubmit } = useSendPasswordResetUrl();

  return (
    <CenterTitleLayout
      title="パスワード再設定"
      description="登録済みのメールアドレスを入力してください。"
      subDescription="パスワード再設定用のURLを通知いたします。"
    >
      <div className="max-w-xl -ml-5">
        <AuthForm form={form} onSubmit={onSubmit} submitButtonLabel="送信" mode="email-only" />
      </div>
      <NormalLink href={LOGIN_URL} label="ログインに戻る" />
    </CenterTitleLayout>
  );
};
export default PasswordResetPageContent;
