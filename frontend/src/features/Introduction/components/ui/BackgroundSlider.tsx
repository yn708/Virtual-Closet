'use client';
import { DEFAULT_DIMENSIONS, ORIGINAL_HEIGHT, ORIGINAL_WIDTH } from '@/utils/constants';
import Image from 'next/image';
import { useCallback, useLayoutEffect, useRef, useState } from 'react';

const BackgroundSlider = () => {
  // 再レンダリングを避けるためにrefでサイズ管理
  const dimensionsRef = useRef(DEFAULT_DIMENSIONS);
  const containerRef = useRef<HTMLDivElement>(null);
  // debounce用タイマー
  const debounceTimeout = useRef<number | null>(null);
  // 初回計測時に決定する画像枚数をstateで保持（その後は固定）
  const [imageCount, setImageCount] = useState<number>(0);

  // しきい値（タブバーの高さ程度＝50px程度）
  const HEIGHT_THRESHOLD = 50;

  // updateDimensions: 現在の viewport 高さ（visualViewportがあればそちら）とこれまでの最大高さを比較して安定値を求める
  const updateDimensions = useCallback(() => {
    // 現在の高さ（タブバー隠れているときは大きく、表示時は小さくなる）
    const rawHeight = window.visualViewport ? window.visualViewport.height : window.innerHeight;
    let stableHeight = dimensionsRef.current.height; // これまでの安定値

    // もし rawHeight の方が大きければ（タブバーが隠れた状態）更新する
    if (rawHeight > stableHeight) {
      stableHeight = rawHeight;
    } else if (stableHeight - rawHeight >= HEIGHT_THRESHOLD) {
      // もし大幅に下がっている（デバイス回転などで実際に小さくなった場合）は更新する
      stableHeight = rawHeight;
    }
    // stableHeight を用いてスケール計算
    const scale = stableHeight / ORIGINAL_HEIGHT;
    const width = ORIGINAL_WIDTH * scale;

    // container の CSS 変数や子要素の width を更新
    if (containerRef.current) {
      containerRef.current.style.setProperty('--image-width', `${width}px`);
      const images = containerRef.current.querySelectorAll('.slider-image');
      images.forEach((image) => {
        (image as HTMLElement).style.width = `${width}px`;
      });
    }
    dimensionsRef.current = { width, height: stableHeight, scale };

    // 初回のみ画像枚数を決定する
    if (imageCount === 0) {
      const viewportWidth = window.innerWidth;
      // 画面幅に対して必要な画像枚数＋1（シームレス用）
      const count = Math.ceil(viewportWidth / width) + 1;
      setImageCount(count);
    }
  }, [imageCount]);

  useLayoutEffect(() => {
    updateDimensions();
    // 初回レンダリング後300ms後に再計測（UI変化落ち着き用）
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

  // 画像枚数は、計算結果があればその値、なければ2枚
  const count = imageCount > 0 ? imageCount : 2;

  return (
    <div className="fixed inset-0 overflow-hidden">
      <div ref={containerRef} className="fixed inset-0 overflow-hidden touch-pan-y">
        {/* ハードウェアアクセラレーションを強制するため translate3d を指定 */}
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
