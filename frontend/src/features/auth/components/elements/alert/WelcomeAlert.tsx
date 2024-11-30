/*
デザイン、レイアウトは後々修正
*/

'use client';

import NormalLink from '@/components/elements/link/NormalLink';
import { MY_PAGE_URL } from '@/utils/constants';
import { X } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
const WelcomeAlert = () => {
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
    <div className="relative max-w-lg mb-8 rounded-lg border bg-white p-4 shadow-sm">
      <button
        onClick={handleClose}
        className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
        aria-label="Close welcome message"
      >
        <X className="size-5" />
      </button>

      <h2 className="text-lg font-semibold">Virtual Closetへようこそ!</h2>

      <div className="mt-2 mb-4 text-gray-700">
        <p>
          <NormalLink href={MY_PAGE_URL} label="マイページ" />
          のプローフィール編集から追加情報を入力してください。
          <br />
          パーソナライズされた機能提供が可能になります。
        </p>
      </div>
    </div>
  );
};
export default WelcomeAlert;
