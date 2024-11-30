import LinkWithText from '@/components/elements/link/LinkWithText';
import EmailSignUpButton from '@/features/auth/components/elements/button/EmailSignUpButton';
import SocialAuthButtons from '@/features/auth/components/elements/button/SocialAuthButtons';
import LegalContent from '@/features/auth/components/elements/content/LegalContent';
import AuthPageTemplate from '@/features/auth/components/layout/AuthPageTemplate';
import { LOGIN_URL } from '@/utils/constants';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '新規登録',
};

export default async function SignUpPage() {
  return (
    <AuthPageTemplate
      isReversed={true}
      title="新規登録"
      description="アカウントを作成して、virtual closetを始めましょう。"
      subDescription={<LegalContent />}
    >
      {/* 認証プロバイダー選択 */}
      <div className="space-y-3">
        <SocialAuthButtons text="登録" />
        <EmailSignUpButton />
      </div>

      <LinkWithText text="すでにアカウントをお持ちの方は" href={LOGIN_URL} label="ログイン" />
    </AuthPageTemplate>
  );
}
