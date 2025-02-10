import { CheckCircle2 } from 'lucide-react';
import SectionContainer from './SectionContainer';

const PricingSection = () => {
  return (
    <SectionContainer className="min-h-screen transition-all duration-1000">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-800 mb-4">お知らせ</h3>
          <p className="text-base md:text-lg text-gray-700">
            現在、画像のアップロードに枚数制限をかけています。
            <br />
            （無制限プランは今後追加予定）
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Free Plan */}
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-8 border border-gray-100 shadow-lg hover:scale-[1.02] transition-all duration-300">
            <div className="text-center mb-8">
              <h4 className="text-2xl font-bold text-gray-800">スタンダードプラン</h4>
              <p className="text-blue-500 font-semibold mt-2">無料</p>
            </div>
            <ul className="space-y-4">
              {[
                'ファッションアイテムの登録（最大:100）',
                'コーディネート画像の保存（最大:100）',
              ].map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="size-5 text-blue-500 shrink-0 mt-1" />
                  <span className="text-gray-600">{feature}</span>
                </li>
              ))}
              <p className="pt-4 pl-2 text-xs text-gray-600">基本的に不便なく使用可能です。</p>
            </ul>
          </div>

          {/* Premium Plan */}
          <div className="bg-gradient-to-br from-blue-50 to-white backdrop-blur-sm rounded-xl p-8 border border-blue-200 shadow-lg hover:scale-[1.02] transition-all duration-300">
            <div className="text-center mb-8">
              <div className="bg-blue-500 text-white text-sm px-4 py-1 rounded-full inline-block mb-2">
                追加予定
              </div>
              <h4 className="text-2xl font-bold text-gray-800">無制限プラン</h4>
            </div>
            <ul className="space-y-4">
              {['ファッションアイテムの登録（無制限）', 'コーディネート画像の保存（無制限）'].map(
                (feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="size-5 text-blue-500 shrink-0 mt-1" />
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ),
              )}
            </ul>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-500">
            ※ リリース時期や詳細は追ってお知らせいたします。 内容の変更がある可能性があります。
          </p>
        </div>
      </div>
    </SectionContainer>
  );
};

export default PricingSection;
