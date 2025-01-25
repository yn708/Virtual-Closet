// /*
// 内容：画面２分割。デフォルトでは右に写真。
// */

import type { ImageAndContentSplitLayoutProps } from '@/features/auth/types';

const ImageAndContentSplitLayout: React.FC<ImageAndContentSplitLayoutProps> = ({
  leftContent,
  rightContent,
  rightBackgroundImage = '/images/fashion-bg2.webp',
  rightOverlayClassName = 'bg-black/10',
  isReversed = false,
}) => {
  // コンテンツコンポーネント
  const TextContent = (
    <div className="min-h-screen w-full md:w-1/2 flex items-center justify-center bg-white order-first md:order-none">
      {leftContent}
    </div>
  );

  // 画像コンポーネント
  const ImageContent = (
    <div
      className="w-full md:w-1/2 relative bg-cover bg-center min-h-[300px] md:min-h-0 flex items-center justify-center order-last md:order-none"
      style={{ backgroundImage: `url(${rightBackgroundImage})` }}
    >
      <div className={`absolute inset-0 ${rightOverlayClassName}`}></div>
      <div className="relative z-10 flex items-center justify-center text-white p-10 h-full">
        {rightContent}
      </div>
    </div>
  );

  return (
    <main className="min-h-screen">
      <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
        {isReversed ? (
          <>
            {ImageContent}
            {TextContent}
          </>
        ) : (
          <>
            {TextContent}
            {ImageContent}
          </>
        )}
      </div>
    </main>
  );
};

export default ImageAndContentSplitLayout;
