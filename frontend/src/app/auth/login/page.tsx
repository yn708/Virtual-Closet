import LinkWithText from '@/components/elements/link/LinkWithText';
import DividerWithText from '@/components/elements/utils/DividerWithText';
import SocialAuthButtons from '@/features/auth/components/elements/button/SocialAuthButtons';
import LoginErrorMessage from '@/features/auth/components/elements/content/LoginErrorMessage';
import LoginForm from '@/features/auth/components/elements/form/LoginForm';
import AuthPageTemplate from '@/features/auth/components/layout/AuthPageTemplate';
import { SIGN_UP_URL } from '@/utils/constants';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ログイン',
};

export default function LoginPage() {
  return (
    <AuthPageTemplate title="ログイン" description="ログインして、virtual closetを始めましょう。">
      <div>
        <LoginErrorMessage />

        <SocialAuthButtons text="ログイン" />
        <DividerWithText className="text-sm font-medium py-4" text="または" />
        <LoginForm />

        <div className="space-y-4">
          <LinkWithText
            href="/auth/password/reset"
            text="パスワードをお忘れの方は"
            label="こちら"
            className="text-center text-sm text-gray-600"
          />
          <LinkWithText
            text="まだアカウントをお持ちでない方は"
            href={SIGN_UP_URL}
            label="新規登録"
          />
        </div>
      </div>
    </AuthPageTemplate>
  );
}
