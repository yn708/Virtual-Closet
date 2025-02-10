import LinkWithText from '@/components/elements/link/LinkWithText';
import { APP_ABOUT_URL, TOP_URL } from '@/utils/constants';

const CompletionStep = ({ isSession }: { isSession: boolean }) => {
  return (
    <div className="max-w-2xl mx-auto ">
      <div className="p-6 bg-green-100 text-green-800 rounded text-sm sm:text-base">
        お問い合わせありがとうございます。
        <br />
        内容を確認の上、担当者よりメールアドレス宛に連絡させていただきます。
      </div>

      <LinkWithText text="トップページに" label="戻る" href={isSession ? TOP_URL : APP_ABOUT_URL} />
    </div>
  );
};
export default CompletionStep;
