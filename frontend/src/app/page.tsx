import { authOptions } from '@/lib/next-auth';
import { LOGIN_URL, SIGN_UP_URL } from '@/utils/constants';
import { getServerSession } from 'next-auth';
import Link from 'next/link';

export default async function IntroductionsPage() {
  const session = await getServerSession(authOptions);
  console.log(session);

  return (
    <div className="h-screen w-full flex items-center justify-center">
      <div className="">
        <h1>紹介ページ</h1>
        <Link href={LOGIN_URL}>ログイン</Link>
        <p></p>
        <Link href={SIGN_UP_URL}>サインアップ</Link>
      </div>
    </div>
  );
}
