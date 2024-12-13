import { renderHook } from '@testing-library/react';
import { act } from 'react';
import { useScroll } from '../useScroll';

describe('useScroll', () => {
  // スクロールイベントをモック
  const fireScroll = (scrollY: number) => {
    // window.scrollYの値を設定
    Object.defineProperty(window, 'scrollY', {
      value: scrollY,
      writable: true,
    });

    // スクロールイベントを発火
    window.dispatchEvent(new Event('scroll'));
  };

  // window.scrollToをモック
  const mockScrollTo = jest.fn();
  window.scrollTo = mockScrollTo;

  beforeEach(() => {
    // 各テストの前にモックをリセット
    jest.clearAllMocks();
    // scrollYの初期値を0に設定
    Object.defineProperty(window, 'scrollY', {
      value: 0,
      writable: true,
    });
  });

  it('デフォルトの閾値でフックが正しく初期化される', () => {
    const { result } = renderHook(() => useScroll());

    expect(result.current.showScrollButton).toBe(false);
    expect(result.current.elementRef.current).toBeNull();
    expect(typeof result.current.scrollToTop).toBe('function');
  });

  it('カスタム閾値でフックが正しく初期化される', () => {
    const customThreshold = 300;
    const { result } = renderHook(() => useScroll(customThreshold));

    expect(result.current.showScrollButton).toBe(false);
    expect(result.current.elementRef.current).toBeNull();
    expect(typeof result.current.scrollToTop).toBe('function');
  });

  it('スクロール位置が閾値を超えるとボタンが表示される', () => {
    const threshold = 500;
    const { result } = renderHook(() => useScroll(threshold));

    // 閾値を超えるスクロール
    act(() => {
      fireScroll(threshold + 100);
    });

    expect(result.current.showScrollButton).toBe(true);
  });

  it('スクロール位置が閾値未満の場合はボタンが表示されない', () => {
    const threshold = 500;
    const { result } = renderHook(() => useScroll(threshold));

    // 閾値未満のスクロール
    act(() => {
      fireScroll(threshold - 100);
    });

    expect(result.current.showScrollButton).toBe(false);
  });

  it('scrollToTop関数が正しく動作する', () => {
    const { result } = renderHook(() => useScroll());

    // scrollToTop関数を実行
    act(() => {
      result.current.scrollToTop();
    });

    // window.scrollToが正しいパラメータで呼ばれたことを確認
    expect(mockScrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: 'smooth',
    });
  });

  it('コンポーネントのアンマウント時にスクロールイベントリスナーが削除される', () => {
    // removeEventListenerのスパイを作成
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

    const { unmount } = renderHook(() => useScroll());

    // フックをアンマウント
    unmount();

    // removeEventListenerが正しく呼ばれたことを確認
    expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function));

    // スパイをリストア
    removeEventListenerSpy.mockRestore();
  });

  it('複数回のスクロールで正しく状態が更新される', () => {
    const threshold = 500;
    const { result } = renderHook(() => useScroll(threshold));

    // 閾値を超えるスクロール
    act(() => {
      fireScroll(threshold + 100);
    });
    expect(result.current.showScrollButton).toBe(true);

    // 閾値未満へスクロール
    act(() => {
      fireScroll(threshold - 100);
    });
    expect(result.current.showScrollButton).toBe(false);

    // 再度閾値を超えるスクロール
    act(() => {
      fireScroll(threshold + 200);
    });
    expect(result.current.showScrollButton).toBe(true);
  });
});
