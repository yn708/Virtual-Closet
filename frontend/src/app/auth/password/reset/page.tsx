import PasswordResetContent from '@/features/auth/components/elements/content/PasswordResetContent';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'パスワードリセット',
};
export default function PasswordResetPage() {
  return <PasswordResetContent mode="request" />;
}
