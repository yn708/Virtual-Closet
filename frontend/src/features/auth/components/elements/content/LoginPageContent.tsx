'use client';

import LinkWithText from '@/components/elements/link/LinkWithText';
import DividerWithText from '@/components/elements/utils/DividerWithText';
import { useLogin } from '@/features/auth/hooks/useLogin';
import type { LoginFormData } from '@/features/auth/types';
import { SIGN_UP_URL } from '@/utils/constants';
import SocialAuthButtons from '../button/SocialAuthButtons';
import AuthForm from '../form/AuthForm';

export default function LoginPageContent() {
  const { form, onSubmit } = useLogin();

  return (
    <div>
      <SocialAuthButtons text="ログイン" />
      <DividerWithText className="text-sm font-medium py-4" text="または" />
      <AuthForm<LoginFormData>
        form={form}
        onSubmit={onSubmit}
        submitButtonLabel="ログイン"
        mode="login"
      />
      <LinkWithText
        href="/auth/password/reset"
        text="パスワードをお忘れの方は"
        label="こちら"
        className="text-center text-sm text-gray-600"
      />
      <LinkWithText text="まだアカウントをお持ちでない方は" href={SIGN_UP_URL} label="新規登録" />
    </div>
  );
}
