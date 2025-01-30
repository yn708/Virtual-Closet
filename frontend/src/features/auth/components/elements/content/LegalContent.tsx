import NormalLink from '@/components/elements/link/NormalLink';
import { PRIVACY_URL, TERMS_URL } from '@/utils/constants';

const LegalContent = () => {
  return (
    <div className="text-sm text-muted-foreground pt-2">
      <p>
        登録で
        <NormalLink
          href={PRIVACY_URL}
          rel="nofollow"
          prefetch={false}
          target="_blank"
          label="プライバシーポリシー"
        />
        、
        <NormalLink
          href={TERMS_URL}
          rel="nofollow"
          prefetch={false}
          target="_blank"
          label="利用規約"
        />
        に同意したことになります。
      </p>
    </div>
  );
};

export default LegalContent;
