import { act, renderHook } from '@testing-library/react';
import useDebounce from '../useDebounce';

describe('useDebounce', () => {
  // Jest のタイマーをモック化
  beforeEach(() => {
    jest.useFakeTimers();
  });

  // テスト後にタイマーのモックをクリア
  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  // 初期値のテスト
  it('初期値が正しく設定されること', () => {
    const { result } = renderHook(() => useDebounce('initial value', 1000));
    expect(result.current).toBe('initial value');
  });

  // 遅延時間前の値の確認
  it('遅延時間内は古い値を保持すること', () => {
    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: 'initial value', delay: 1000 },
    });

    // 新しい値で再レンダリング
    rerender({ value: 'new value', delay: 1000 });

    // 遅延時間内は古い値のままであることを確認
    expect(result.current).toBe('initial value');
  });

  // 遅延時間後の値の更新確認
  it('遅延時間後に新しい値に更新されること', () => {
    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: 'initial value', delay: 1000 },
    });

    // 新しい値で再レンダリング
    rerender({ value: 'new value', delay: 1000 });

    // タイマーを進める
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    // 新しい値に更新されていることを確認
    expect(result.current).toBe('new value');
  });

  // 複数回の値の更新テスト
  it('連続して値が更新された場合、最後の値のみが反映されること', () => {
    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: 'initial value', delay: 1000 },
    });

    // 複数回値を更新
    rerender({ value: 'first update', delay: 1000 });
    rerender({ value: 'second update', delay: 1000 });
    rerender({ value: 'final update', delay: 1000 });

    // 遅延時間の半分だけ進める
    act(() => {
      jest.advanceTimersByTime(500);
    });

    // まだ古い値のままであることを確認
    expect(result.current).toBe('initial value');

    // 残りの遅延時間を進める
    act(() => {
      jest.advanceTimersByTime(500);
    });

    // 最後の値が反映されていることを確認
    expect(result.current).toBe('final update');
  });

  // 数値型のテスト
  it('数値型の値でも正しく動作すること', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce<number>(value, delay),
      {
        initialProps: { value: 0, delay: 1000 },
      },
    );

    // 数値を更新
    rerender({ value: 100, delay: 1000 });

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(result.current).toBe(100);
  });
});
