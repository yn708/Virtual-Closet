'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // クリティカルなエラーをログに記録
    console.error('Critical error:', error);
  }, [error]);

  return (
    <html lang="ja">
      <body>
        <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-lg text-center">
            <div className="mx-auto size-12 text-primary" />
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              内部エラーが発生しました。
            </h1>
            <div className="mt-5 text-muted-foreground">
              <p>申し訳ありませんが、予期せぬエラーが発生しました。</p>
              <p>しばらくしてから再度お試しください。</p>
            </div>
            <div className="mt-14 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <button
                className="inline-flex items-center rounded-md bg-background px-4 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                onClick={() => reset()}
              >
                リロード
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
