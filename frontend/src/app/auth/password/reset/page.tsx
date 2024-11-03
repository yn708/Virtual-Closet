import PasswordResetPageContent from '@/features/auth/components/elements/content/PasswordResetPageContent';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'パスワードリセット',
};
export default function PasswordResetPage() {
  return <PasswordResetPageContent />;
}
