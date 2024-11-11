'use client';

import NormalLink from '@/components/elements/link/NormalLink';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { MY_PAGE_URL } from '@/utils/constants';
import { X } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function WelcomeAlert() {
  const { data: session, update: updateSession } = useSession();
  const router = useRouter();
  const handleClose = async () => {
    try {
      await updateSession({
        user: {
          ...session?.user,
          isNewUser: false,
        },
      });
      router.refresh();
    } catch (error) {
      console.error('Error updating session:', error);
    }
  };

  return (
    <Alert className="max-w-lg mb-8 relative">
      <button
        onClick={handleClose}
        className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
        aria-label="Close welcome message"
      >
        <X className="size-5" />
      </button>
      <AlertTitle className="text-lg font-semibold">Virtual Closetへようこそ!</AlertTitle>
      <AlertDescription>
        <p className="mt-2 mb-4">
          <NormalLink href={MY_PAGE_URL} label="マイページ" />
          のプローフィール編集から追加情報を入力してください。
          <br />
          パーソナライズされた機能提供が可能になります。
        </p>
      </AlertDescription>
    </Alert>
  );
}
