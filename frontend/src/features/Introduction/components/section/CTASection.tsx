import StyledLink from '@/components/elements/link/StyledLink';
import { SIGN_UP_URL } from '@/utils/constants';
import SectionContainer from './SectionContainer';

const CTASection = () => {
  return (
    <SectionContainer className="min-h-[60vh]" ContentClassName="text-center space-y-8 ">
      <h2 className="text-xl md:text-5xl font-extrabold text-gray-800">
        毎日のコーディネートを
        <br />
        もっと楽しく・もっと自由に
      </h2>
      <p className="text-base md:text-xl font-medium text-gray-600 max-w-2xl mx-auto">
        つながって広がる、自由な私のスタイル
      </p>
      <StyledLink href={SIGN_UP_URL} label="さっそく始める" className="inline-block w-64" />
    </SectionContainer>
  );
};

export default CTASection;
