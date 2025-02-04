'use client';
import { DEFAULT_DIMENSIONS, ORIGINAL_HEIGHT, ORIGINAL_WIDTH } from '@/utils/constants';
import Image from 'next/image';
import { useCallback, useLayoutEffect, useRef, useState } from 'react';

const BackgroundSlider = () => {
  // 再レンダリングを避けるためのrefでサイズ管理
  const dimensionsRef = useRef(DEFAULT_DIMENSIONS);
  const containerRef = useRef<HTMLDivElement>(null);
  // debouncing用のタイマーref
  const debounceTimeout = useRef<number | null>(null);
  // 初回計測時に決定する画像枚数をstateに保持（その後は固定）
  const [imageCount, setImageCount] = useState<number>(0);

  // しきい値：viewportの高さ変化が50px未満なら更新しない
  const HEIGHT_THRESHOLD = 50;

  // サイズ計算ロジック（debounce対応）
  const updateDimensions = useCallback(() => {
    // visualViewportがあればそちらを利用、それ以外はwindow.innerHeight
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
    // 更新後のサイズをrefに保存
    dimensionsRef.current = { width, height: screenHeight, scale };

    // 初回計測時のみ、必要な画像枚数を計算してstateに固定する
    if (imageCount === 0) {
      // たとえば、画面幅を埋めるのに必要な枚数＋1（シームレスなスライド用）
      const viewportWidth = window.innerWidth;
      const count = Math.ceil(viewportWidth / width) + 1;
      setImageCount(count);
    }
  }, [imageCount]);

  useLayoutEffect(() => {
    updateDimensions();
    // 初回レンダリング後、300ms後に再計測（UIの変化が落ち着くタイミング）
    const timeoutId = setTimeout(() => {
      updateDimensions();
    }, 300);

    // リサイズイベントではdebounceを入れてupdateDimensionsを呼ぶ
    const handleResize = () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
      debounceTimeout.current = window.setTimeout(() => {
        updateDimensions();
      }, 100);
    };

    window.addEventListener('resize', handleResize);
    // visualViewportが利用可能ならそのresizeも監視
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

  // 画像枚数が未計算の場合は2枚とする
  const count = imageCount > 0 ? imageCount : 2;

  return (
    <div className="fixed inset-0 overflow-hidden">
      <div ref={containerRef} className="fixed inset-0 overflow-hidden touch-pan-y">
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
