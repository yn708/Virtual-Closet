import { FEATURES, UPCOMING_FEATURES } from '@/utils/data/info';
import Image from 'next/image';
import SectionHeader from '../ui/SectionHeader';
import SectionContainer from './SectionContainer';

const FeaturesSection = () => {
  return (
    <SectionContainer className="min-h-screen">
      <SectionHeader number="02" subtitle="functions" title="こんな機能があります" />

      <div className="grid lg:grid-cols-2 gap-12">
        {FEATURES.map(({ title, description, image }, index) => (
          <div
            key={index}
            className="bg-white/90 backdrop-blur-sm rounded-xl p-8 border border-gray-100 shadow-lg hover:bg-white/95 transition-all duration-300"
          >
            {index % 2 !== 0 && (
              <div className="grid grid-cols-2 gap-2 mb-4">
                {image.map(({ src, alt }, imgIndex) => (
                  <div
                    key={imgIndex}
                    className="relative w-[110px] h-[230px] md:w-[140px] md:h-[280px] mx-auto"
                  >
                    <Image src={src} alt={alt} fill className="object-cover" />
                  </div>
                ))}
              </div>
            )}

            <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">{title}</h3>

            <ul className="space-y-4 text-gray-600">
              {description.map((text, descIndex) => (
                <li key={descIndex} className="flex items-center justify-start gap-3">
                  <span className="p-1 size-3 md:size-5 rounded-full bg-blue-100 border border-blue-400" />
                  <span className="text-sm md:text-base">{text}</span>
                </li>
              ))}
            </ul>

            {index % 2 === 0 && (
              <div className="grid grid-cols-2 gap-2 mt-4">
                {image.map(({ src, alt }, imgIndex) => (
                  <div
                    key={imgIndex}
                    className="relative w-[110px] h-[230px] md:w-[140px] md:h-[280px] mx-auto"
                  >
                    <Image src={src} alt={alt} fill className="object-cover" quality={85} />
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-20 bg-white/90 backdrop-blur-sm rounded-xl p-8 border border-gray-100 shadow-lg">
        <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-10 text-center">
          今後追加予定の機能
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {UPCOMING_FEATURES.map(({ icon, title, description }, index) => (
            <div
              key={index}
              className="p-6 rounded-lg bg-white/90 hover:bg-white/95 hover:scale-105 transition-all duration-300 border border-gray-100 shadow-md"
            >
              <div className="mb-2">{icon}</div>
              <h4 className="font-bold text-gray-800 mb-3">{title}</h4>
              <p className="text-sm text-gray-600">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </SectionContainer>
  );
};

export default FeaturesSection;
