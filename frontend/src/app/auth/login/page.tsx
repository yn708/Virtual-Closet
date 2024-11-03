import LoginPageContent from '@/features/auth/components/elements/content/LoginPageContent';
import AuthPageTemplate from '@/features/auth/components/layout/AuthPageTemplate';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ログイン',
};

export default function LoginPage() {
  return (
    <AuthPageTemplate title="ログイン" description="ログインして、virtual closetを始めましょう。">
      <LoginPageContent />
    </AuthPageTemplate>
  );
}
