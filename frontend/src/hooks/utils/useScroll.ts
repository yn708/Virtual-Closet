import { useEffect, useRef, useState } from 'react';

/**
 * スクロール状態を管理するカスタムフック
 * - スクロールボタンの表示制御
 * - トップへのスクロール機能
 */
export const useScroll = (threshold: number = 500) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  // スクロール位置の監視
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollButton(window.scrollY > threshold);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return { showScrollButton, scrollToTop, elementRef };
};
