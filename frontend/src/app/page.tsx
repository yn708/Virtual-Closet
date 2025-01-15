import ConcernsSection from '@/features/Introduction/components/section/ConcernsSection';
import CTASection from '@/features/Introduction/components/section/CTASection';
import FeaturesSection from '@/features/Introduction/components/section/FeaturesSection';
import HeroSection from '@/features/Introduction/components/section/HeroSection';
import BackgroundSlider from '@/features/Introduction/components/ui/BackgroundSlider';
import Footer from '@/features/navItems/components/layout/Footer';

export default function IntroductionPage() {
  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
        <BackgroundSlider /> {/* 背景画像アニメーション */}
        {/* メインコンテンツ */}
        <div className="relative z-20">
          <HeroSection /> {/* Hero Section  */}
          <ConcernsSection /> {/* 問いかけ Section */}
          <FeaturesSection /> {/* 機能セクション */}
          <CTASection /> {/* CTA Section */}
        </div>
      </div>
      <Footer className="relative" />
    </>
  );
}
