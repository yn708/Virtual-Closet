import StyledLink from '@/components/elements/link/StyledLink';
import { SIGN_UP_URL } from '@/utils/constants';
import Image from 'next/image';

const HeroSection = () => {
  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-20">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-20">
        <div className="flex-1 space-y-8 text-center md:text-left">
          <h1 className="text-5xl lg:text-7xl font-extrabold text-white tracking-tight drop-shadow-2xl">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-sky-600">
              V
            </span>
            IRTUAL
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-sky-600">
              C
            </span>
            LOSET
          </h1>
          <p className="text-xl text-white font-bold leading-relaxed drop-shadow-lg">
            毎日のコーディネートを
            <br />
            もっと楽しく・もっと自由に
          </p>
          <StyledLink
            href={SIGN_UP_URL}
            label="今すぐ始める"
            className="inline-block w-full md:w-64 text-lg"
          />
        </div>

        <div className="relative aspect-[2/5] w-full h-80 md:h-[32rem] hover:scale-105 transition-transform duration-300">
          <Image
            src="/images/example1.png"
            alt="Virtual Closet Example"
            fill
            className="object-contain hover:scale-105 transition-transform duration-500"
            priority
          />
        </div>
      </div>
    </section>
  );
};
export default HeroSection;
