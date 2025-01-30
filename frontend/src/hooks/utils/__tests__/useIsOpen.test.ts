import { act, renderHook } from '@testing-library/react';
import { useIsOpen } from '../useIsOpen';

describe('useIsOpen', () => {
  // デフォルトの初期状態をテスト
  it('returns default initial state as false', () => {
    const { result } = renderHook(() => useIsOpen());

    expect(result.current.isOpen).toBe(false);
    expect(typeof result.current.onClose).toBe('function');
    expect(typeof result.current.onToggle).toBe('function');
  });

  // カスタム初期状態のテスト
  it('accepts custom initial state', () => {
    const { result } = renderHook(() => useIsOpen(true));
    expect(result.current.isOpen).toBe(true);
  });

  // onClose関数のテスト
  it('onClose sets isOpen to false', () => {
    // 初期状態をtrueに設定
    const { result } = renderHook(() => useIsOpen(true));
    expect(result.current.isOpen).toBe(true);

    // onCloseを実行
    act(() => {
      result.current.onClose();
    });
    expect(result.current.isOpen).toBe(false);

    // すでにfalseの状態でonCloseを実行
    act(() => {
      result.current.onClose();
    });
    expect(result.current.isOpen).toBe(false);
  });

  // onToggle関数のテスト
  it('onToggle toggles isOpen state', () => {
    const { result } = renderHook(() => useIsOpen());

    // 初期状態の確認
    expect(result.current.isOpen).toBe(false);

    // falseからtrueへのトグル
    act(() => {
      result.current.onToggle();
    });
    expect(result.current.isOpen).toBe(true);

    // trueからfalseへのトグル
    act(() => {
      result.current.onToggle();
    });
    expect(result.current.isOpen).toBe(false);
  });

  // 複数回の状態変更をテスト
  it('handles multiple state changes correctly', () => {
    const { result } = renderHook(() => useIsOpen(false));

    // 一連の操作をテスト
    act(() => {
      result.current.onToggle(); // false -> true
    });
    expect(result.current.isOpen).toBe(true);

    act(() => {
      result.current.onClose(); // true -> false
    });
    expect(result.current.isOpen).toBe(false);

    act(() => {
      result.current.onToggle(); // false -> true
    });
    expect(result.current.isOpen).toBe(true);
  });

  // メモ化された関数の一貫性をテスト
  it('returns memoized functions', () => {
    const { result, rerender } = renderHook(() => useIsOpen());

    const initialOnClose = result.current.onClose;
    const initialOnToggle = result.current.onToggle;

    // 再レンダリング
    rerender();

    // 関数の参照が保持されているか確認
    expect(result.current.onClose).toBe(initialOnClose);
    expect(result.current.onToggle).toBe(initialOnToggle);
  });
});
