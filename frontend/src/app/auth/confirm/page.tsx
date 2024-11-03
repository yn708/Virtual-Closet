import ConfirmContent from '@/features/auth/components/elements/content/ConfirmContent';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '認証コード確認',
};
export default function ConfirmPage() {
  return <ConfirmContent />;
}
