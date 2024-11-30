import { privacyData } from '@/utils/data/privacy';
import { termsData } from '@/utils/data/terms';
import { LegalDialog } from '../dialog/LegalDialog';

const LegalContent = () => {
  return (
    <div className="text-sm text-muted-foreground pt-2">
      <p>
        登録で
        <LegalDialog data={privacyData} label="プライバシーポリシー" />
        、
        <LegalDialog data={termsData} label="利用規約" />
        に同意したことになります。
      </p>
    </div>
  );
};

export default LegalContent;
