import PasswordResetConfirmPageContent from '@/features/auth/components/elements/content/PasswordResetConfirmPageContent';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'パスワード再設定',
};
// ページコンポーネントでルートパラメータを受け取る
export default function PasswordResetConfirmPage({
  params,
}: {
  params: { uid: string; token: string };
}) {
  return <PasswordResetConfirmPageContent uid={params.uid} token={params.token} />;
}
