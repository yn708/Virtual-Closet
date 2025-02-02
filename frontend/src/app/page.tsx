import ConcernsSection from '@/features/Introduction/components/section/ConcernsSection';
import CTASection from '@/features/Introduction/components/section/CTASection';
import FeaturesSection from '@/features/Introduction/components/section/FeaturesSection';
import HeroSection from '@/features/Introduction/components/section/HeroSection';
import PricingSection from '@/features/Introduction/components/section/PricingSection';
import BackgroundSlider from '@/features/Introduction/components/ui/BackgroundSlider';
import Footer from '@/features/navItems/components/layout/Footer';

export default function IntroductionPage() {
  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
        <BackgroundSlider />
        <div className="relative z-20">
          <HeroSection />
          <ConcernsSection />
          <FeaturesSection />
          <PricingSection />
          <CTASection />
        </div>
      </div>
      <Footer className="relative" />
    </>
  );
}
