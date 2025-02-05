'use client';

import { useSearchParams } from 'next/navigation';

export default function LoginErrorMessage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  if (!error) return null;

  const getErrorMessage = (error: string) => {
    switch (error) {
      case 'unauthorized':
        return 'ログインしてください。';
      case 'session_expired':
        return 'セッションの有効期限が切れました。再度ログインしてください。';
      default:
        return 'エラーが発生しました。';
    }
  };

  return (
    <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
      {getErrorMessage(error)}
    </div>
  );
}
