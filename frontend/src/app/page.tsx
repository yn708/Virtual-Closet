import { LOGIN_URL, SIGN_UP_URL, TOP_URL } from '@/utils/constants';
import Link from 'next/link';

export default async function IntroductionsPage() {
  return (
    <div className="h-screen w-full flex items-center justify-center">
      <div className="">
        <h1>紹介ページ</h1>
        <Link href={LOGIN_URL}>ログイン</Link>
        <p></p>
        <Link href={SIGN_UP_URL}>サインアップ</Link>
        <p></p>
        <Link href={TOP_URL}>トップページ</Link>
      </div>
    </div>
  );
}
