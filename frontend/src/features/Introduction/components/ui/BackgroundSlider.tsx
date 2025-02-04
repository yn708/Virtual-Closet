'use client';
import { DEFAULT_DIMENSIONS, ORIGINAL_HEIGHT, ORIGINAL_WIDTH } from '@/utils/constants';
import Image from 'next/image';
import { useCallback, useLayoutEffect, useRef } from 'react';

const BackgroundSlider = () => {
  // useRefで状態を管理（再レンダリング防止）
  const dimensionsRef = useRef(DEFAULT_DIMENSIONS);
  const containerRef = useRef<HTMLDivElement>(null);

  // サイズ計算ロジックを単純化
  const updateDimensions = useCallback(() => {
    const screenHeight = window.innerHeight;
    const scale = screenHeight / ORIGINAL_HEIGHT;
    const width = ORIGINAL_WIDTH * scale;

    // DOMの直接操作でパフォーマンス改善
    if (containerRef.current) {
      containerRef.current.style.setProperty('--image-width', `${width}px`);
      const images = containerRef.current.querySelectorAll('.slider-image');
      images.forEach((image) => {
        (image as HTMLElement).style.width = `${width}px`;
      });
    }

    dimensionsRef.current = { width, height: screenHeight, scale };
  }, []);

  // useLayoutEffectでちらつき防止
  useLayoutEffect(() => {
    updateDimensions();

    // デバウンス関数を最適化
    let rafId: number;
    const handleResize = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateDimensions);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(rafId);
    };
  }, [updateDimensions]);

  return (
    <div className="fixed inset-0 overflow-hidden">
      <div ref={containerRef} className="flex h-screen animate-slide">
        {Array.from({ length: 2 }).map((_, index) => (
          <div key={index} className="relative shrink-0 slider-image h-screen">
            <Image
              src="/images/fashion-bg.webp"
              alt="Fashion background"
              fill
              priority={index === 0}
              quality={90}
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
export default BackgroundSlider;
