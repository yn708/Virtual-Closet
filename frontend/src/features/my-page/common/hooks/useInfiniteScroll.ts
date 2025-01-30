import { useCallback, useEffect, useRef } from 'react';

interface UseInfiniteScrollOptions {
  onLoadMore: () => void;
  hasMore: boolean;
  isLoading: boolean;
  threshold?: number;
  // スロットリング時間をミリ秒で指定（デフォルト: 200ms）
  throttleMs?: number;
}

export const useInfiniteScroll = ({
  onLoadMore,
  hasMore,
  isLoading,
  threshold = 200,
  throttleMs = 200,
}: UseInfiniteScrollOptions) => {
  // 最後にロードを実行した時刻を保持
  const lastLoadTime = useRef<number>(0);
  // スクロールハンドラーのタイマーID
  const throttleTimer = useRef<NodeJS.Timeout | null>(null);
  // 前回のスクロール位置
  const lastScrollPosition = useRef<number>(0);

  const handleScroll = useCallback(() => {
    // スロットリング処理
    const now = Date.now();
    if (now - lastLoadTime.current < throttleMs) {
      return;
    }

    // 基本的なチェック
    if (!hasMore || isLoading) return;

    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const clientHeight = window.innerHeight || document.documentElement.clientHeight;
    const currentPosition = scrollTop + clientHeight;

    // スクロール方向を判定（下方向のスクロールの場合のみ処理）
    const isScrollingDown = currentPosition > lastScrollPosition.current;
    lastScrollPosition.current = currentPosition;

    if (!isScrollingDown) return;

    // より余裕を持ったしきい値での判定
    const shouldLoadMore = scrollHeight - currentPosition <= threshold;

    if (shouldLoadMore) {
      // スロットリングされた実行
      if (throttleTimer.current) {
        clearTimeout(throttleTimer.current);
      }

      throttleTimer.current = setTimeout(() => {
        onLoadMore();
        lastLoadTime.current = now;
      }, 100);
    }
  }, [hasMore, isLoading, onLoadMore, threshold, throttleMs]);

  useEffect(() => {
    // スクロールイベントの登録
    window.addEventListener('scroll', handleScroll, { passive: true });
    // 初期表示時にもチェック（画面が長い場合に対応）
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (throttleTimer.current) {
        clearTimeout(throttleTimer.current);
      }
    };
  }, [handleScroll]);
};
