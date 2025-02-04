'use client';
import { DEFAULT_DIMENSIONS, ORIGINAL_HEIGHT, ORIGINAL_WIDTH } from '@/utils/constants';
import Image from 'next/image';
import { useCallback, useLayoutEffect, useRef } from 'react';

const BackgroundSlider = () => {
  // useRefで状態を管理（再レンダリング防止）
  const dimensionsRef = useRef(DEFAULT_DIMENSIONS);
  const containerRef = useRef<HTMLDivElement>(null);

  // しきい値（px）：viewport の高さの変化がこれ未満なら更新しない
  const HEIGHT_THRESHOLD = 50;

  // サイズ計算ロジック
  const updateDimensions = useCallback(() => {
    // visualViewport が使える場合はそちらを優先して利用する
    const screenHeight = window.visualViewport ? window.visualViewport.height : window.innerHeight;
    if (Math.abs(screenHeight - dimensionsRef.current.height) < HEIGHT_THRESHOLD) {
      return;
    }
    const scale = screenHeight / ORIGINAL_HEIGHT;
    const width = ORIGINAL_WIDTH * scale;

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
    // 初回レンダリング後、短いタイムアウトを設けて再計測
    const timeoutId = setTimeout(() => {
      updateDimensions();
    }, 300); // 300ms 程度で UI の変化が落ち着くタイミングを狙う

    let rafId: number;
    const handleResize = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateDimensions);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(rafId);
    };
  }, [updateDimensions]);

  return (
    <div className="fixed inset-0 overflow-hidden">
      <div ref={containerRef} className="fixed inset-0 overflow-hidden touch-pan-y">
        <div className="flex h-screen animate-slide">
          {Array.from({ length: 2 }).map((_, index) => (
            <div key={index} className="relative shrink-0 slider-image h-screen">
              <Image
                src="/images/fashion-bg.webp"
                alt="Fashion background"
                fill
                priority
                unoptimized // 画像の劣化防止のため最適化は無効化
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
