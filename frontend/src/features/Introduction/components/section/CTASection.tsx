import StyledLink from '@/components/elements/link/StyledLink';
import { SIGN_UP_URL } from '@/utils/constants';

const CTASection = () => {
  return (
    <section className="py-32 relative min-h-[60vh]">
      <div className="absolute inset-0 bg-white/90" />
      <div className="max-w-4xl mx-auto text-center space-y-8 relative">
        <h2 className="text-xl md:text-5xl font-extrabold text-gray-800">
          毎日のコーディネートを
          <br />
          もっと楽しく・もっと自由に
        </h2>
        <p className="text-base md:text-xl font-medium text-gray-600 max-w-2xl mx-auto">
          つながって広がる、自由な私のスタイル
        </p>
        <StyledLink href={SIGN_UP_URL} label="さっそく始める" className="inline-block w-64" />
      </div>
    </section>
  );
};

export default CTASection;
