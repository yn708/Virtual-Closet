'use client';
import { DEFAULT_DIMENSIONS, ORIGINAL_HEIGHT, ORIGINAL_WIDTH } from '@/utils/constants';
import Image from 'next/image';
import { useCallback, useLayoutEffect, useRef, useState } from 'react';

const BackgroundSlider = () => {
  // 現在のサイズ情報を保持する ref
  const dimensionsRef = useRef(DEFAULT_DIMENSIONS);
  // 最大の viewport 高さを記録する ref（タブバー表示による一時的な低下を無視）
  const maxHeightRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  // リサイズ処理の debounce 用タイマー
  const debounceTimeout = useRef<number | null>(null);
  // 初回計測時に決定する画像枚数を state で保持（その後は固定）
  const [imageCount, setImageCount] = useState<number>(0);

  // タブバーによる変動はおおよそ50px前後なのでそのしきい値
  const HEIGHT_THRESHOLD = 50;

  // updateDimensions：現在の viewport 高さ(rawHeight)を測定し、maxHeightRef に記録された最大値を常に使用する
  const updateDimensions = useCallback(() => {
    const rawHeight = window.visualViewport ? window.visualViewport.height : window.innerHeight;
    // 最大値を記録（タブバーが隠れている状態の高さが取れた場合、その値が残る）
    maxHeightRef.current = Math.max(maxHeightRef.current, rawHeight);
    // もし一時的に大幅に低下している場合（デバイス自体が変わった場合など）は、しきい値を超える変化なら rawHeight にも更新する
    if (dimensionsRef.current.height - rawHeight >= HEIGHT_THRESHOLD) {
      maxHeightRef.current = rawHeight;
    }
    const stableHeight = maxHeightRef.current;

    const scale = stableHeight / ORIGINAL_HEIGHT;
    const width = ORIGINAL_WIDTH * scale;

    if (containerRef.current) {
      containerRef.current.style.setProperty('--image-width', `${width}px`);
      const images = containerRef.current.querySelectorAll('.slider-image');
      images.forEach((image) => {
        (image as HTMLElement).style.width = `${width}px`;
      });
    }
    dimensionsRef.current = { width, height: stableHeight, scale };

    // 初回計測時のみ、画面幅から必要な画像枚数を計算して state に固定する
    if (imageCount === 0) {
      const viewportWidth = window.innerWidth;
      const count = Math.ceil(viewportWidth / width) + 1;
      setImageCount(count);
    }
  }, [imageCount]);

  useLayoutEffect(() => {
    updateDimensions();
    // 初回レンダリング後300ms後に再計測（UIの変化が落ち着いたタイミング）
    const timeoutId = setTimeout(() => {
      updateDimensions();
    }, 300);

    const handleResize = () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
      debounceTimeout.current = window.setTimeout(() => {
        updateDimensions();
      }, 100);
    };

    window.addEventListener('resize', handleResize);
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleResize);
    }
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleResize);
      }
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [updateDimensions]);

  const count = imageCount > 0 ? imageCount : 2;

  return (
    <div className="fixed inset-0 overflow-hidden">
      <div ref={containerRef} className="fixed inset-0 overflow-hidden touch-pan-y">
        {/* ハードウェアアクセラレーション対策 */}
        <div className="flex h-screen animate-slide" style={{ transform: 'translate3d(0,0,0)' }}>
          {Array.from({ length: count }).map((_, index) => (
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
