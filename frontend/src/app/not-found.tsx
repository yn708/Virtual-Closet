import { CONTACT_URL, TOP_URL } from '@/utils/constants';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-dvh items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-lg text-center">
        <h1 className="w-full mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
          ページが見つかりませんでした
        </h1>
        <div className="mt-5 text-muted-foreground">
          <p>申し訳ございません。お探しのページは見つかりませんでした。</p>
          <p>ホームページに戻るか、お問い合わせください。</p>
        </div>

        <div className="mt-14 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href={TOP_URL}
            className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            トップページに戻る
          </Link>
          <Link
            href={CONTACT_URL}
            className="inline-flex items-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            prefetch={false}
          >
            お問い合わせ
          </Link>
        </div>
      </div>
    </div>
  );
}
