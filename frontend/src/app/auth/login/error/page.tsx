import LinkWithText from '@/components/elements/link/LinkWithText';
import { CONTACT_URL, LOGIN_URL } from '@/utils/constants';
import { CiCircleAlert } from 'react-icons/ci';

export default function GoogleAuthError() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-20 space-y-10">
      <div className="flex items-center justify-center gap-4">
        <CiCircleAlert className="size-12 text-red-500" />
        <div className="text-xl">
          <p>認証中にエラーが発生しました。</p>
          <p>お手数ですが、もう一度お試しください。</p>
        </div>
      </div>

      <div className="flex flex-col justify-center gap-4">
        <LinkWithText
          text="ログイン画面に"
          label="戻る"
          href={LOGIN_URL}
          className="text-base text-gray-600"
        />
        <LinkWithText
          text="問題が解決しない場合は、"
          label="お問い合わせ"
          href={CONTACT_URL}
          className="text-base text-gray-600"
        />
      </div>
    </div>
  );
}
