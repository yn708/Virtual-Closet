import { CONCERNS } from '@/utils/data/info';
import SectionHeader from '../ui/SectionHeader';
import SectionContainer from './SectionContainer';

const ConcernsSection = () => {
  return (
    <SectionContainer className="min-h-screen transition-all duration-1000">
      {/* セクションヘッダー */}
      <SectionHeader number="01" subtitle="use case" title="こんな悩みありませんか？" />

      {/* コンサーンカード */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
        {CONCERNS.map((concern) => (
          <div
            key={concern.id}
            className="bg-white/80 backdrop-blur-md rounded-xl p-6 hover:scale-105 transition-all duration-300 border border-gray-100 shadow-lg"
          >
            <h4 className="text-base md:text-lg text-gray-800 font-medium whitespace-pre-line text-center">
              {concern.title}
            </h4>
          </div>
        ))}
      </div>

      {/* セクションフッター */}
      <div className="pt-32 text-center space-y-6">
        <h3 className="text-2xl md:text-3xl font-bold text-gray-800">
          VIRTUAL CLOSET
          <br />
          <span className="text-xl">で解決できます</span>
        </h3>
        <p className="text-sm md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
          毎日のコーディネートから、クローゼットの管理までお任せください。
          <br />
          あなたのファッションライフをもっと楽しく、もっと便利にします。
        </p>
      </div>
    </SectionContainer>
  );
};

export default ConcernsSection;
