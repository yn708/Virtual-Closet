'use client';
import { ORIGINAL_HEIGHT, ORIGINAL_WIDTH } from '@/utils/constants';
import Image from 'next/image';
import { useEffect, useRef } from 'react';

const BackgroundSlider = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateDimensions = () => {
      if (!containerRef.current) return;

      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // アスペクト比を保持しながら、画面の高さに合わせてスケーリング
      const scale = viewportHeight / ORIGINAL_HEIGHT;
      const scaledWidth = ORIGINAL_WIDTH * scale;

      // 画像の幅が画面幅より小さい場合は、幅に合わせてスケーリング
      const finalScale = scaledWidth < viewportWidth ? viewportWidth / ORIGINAL_WIDTH : scale;
      const finalWidth = ORIGINAL_WIDTH * finalScale;
      const finalHeight = ORIGINAL_HEIGHT * finalScale;

      containerRef.current.style.setProperty('--image-width', `${finalWidth}px`);
      containerRef.current.style.setProperty('--image-height', `${finalHeight}px`);

      const images = containerRef.current.querySelectorAll('.slider-image');
      images.forEach((image) => {
        (image as HTMLElement).style.width = `${finalWidth}px`;
        (image as HTMLElement).style.height = `${finalHeight}px`;
      });
    };

    const handleResize = () => {
      requestAnimationFrame(updateDimensions);
    };

    updateDimensions();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden">
      <div ref={containerRef} className="fixed inset-0 overflow-hidden touch-pan-y">
        <div
          className="flex animate-slide"
          style={{
            transform: 'translate3d(0,0,0)',
            height: 'var(--image-height)',
          }}
        >
          {[0, 1].map((index) => (
            <div
              key={index}
              className="relative shrink-0 slider-image"
              style={{ width: 'var(--image-width)', height: 'var(--image-height)' }}
            >
              <Image
                src="/images/fashion-bg.webp"
                alt="Fashion background"
                fill
                priority
                unoptimized
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BackgroundSlider;
