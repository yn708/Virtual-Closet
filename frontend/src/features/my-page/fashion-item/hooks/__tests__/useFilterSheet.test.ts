import { useIsOpen } from '@/hooks/utils/useIsOpen';
import { act, renderHook } from '@testing-library/react';
import type { FilterState, Status } from '../../types';
import { useFilterSheet } from '../useFilterSheet';

// useIsOpenフックのモック
jest.mock('@/hooks/utils/useIsOpen', () => ({
  useIsOpen: jest.fn(),
}));

describe('useFilterSheet', () => {
  // テスト用の初期値とコールバック関数
  const mockInitialFilters: FilterState = {
    category: 'category1',
    status: [''] as Status[],
    season: ['spring'],
  };

  const mockOnFilterApply = jest.fn();
  const mockOnCategoryChange = jest.fn();
  const mockOnClose = jest.fn();
  const mockOnToggle = jest.fn();

  // テストごとに共通の初期設定
  beforeEach(() => {
    jest.clearAllMocks();

    // useIsOpenフックの戻り値をモック
    (useIsOpen as jest.Mock).mockReturnValue({
      isOpen: false,
      onClose: mockOnClose,
      onToggle: mockOnToggle,
    });
  });

  // 基本的なフックのレンダリングテスト
  it('初期状態で正しく初期化されること', () => {
    const { result } = renderHook(() =>
      useFilterSheet({
        initialFilters: mockInitialFilters,
        onFilterApply: mockOnFilterApply,
        onCategoryChange: mockOnCategoryChange,
      }),
    );

    expect(result.current.tempFilters).toEqual(mockInitialFilters);
    expect(result.current.isOpen).toBe(false);
  });

  // シート開閉の動作テスト
  describe('シートの開閉制御', () => {
    it('シートを閉じる時に一時フィルターが初期状態にリセットされること', () => {
      (useIsOpen as jest.Mock).mockReturnValue({
        isOpen: false,
        onClose: mockOnClose,
        onToggle: mockOnToggle,
      });

      const { result } = renderHook(() =>
        useFilterSheet({
          initialFilters: mockInitialFilters,
          onFilterApply: mockOnFilterApply,
          onCategoryChange: mockOnCategoryChange,
        }),
      );

      act(() => {
        result.current.handleSheetOpenChange();
      });

      expect(result.current.tempFilters).toEqual(mockInitialFilters);
      expect(mockOnToggle).toHaveBeenCalled();
    });
  });

  // シーズン選択の動作テスト
  describe('シーズン選択', () => {
    it('新しいシーズンを選択したとき、正しく状態が更新されること', () => {
      const { result } = renderHook(() =>
        useFilterSheet({
          initialFilters: mockInitialFilters,
          onFilterApply: mockOnFilterApply,
          onCategoryChange: mockOnCategoryChange,
        }),
      );

      act(() => {
        result.current.handleSeasonChange('summer');
      });

      expect(result.current.tempFilters.season).toEqual(['summer']);
    });

    it('同じシーズンを再度選択したとき、選択が解除されること', () => {
      const { result } = renderHook(() =>
        useFilterSheet({
          initialFilters: { ...mockInitialFilters, season: ['summer'] },
          onFilterApply: mockOnFilterApply,
          onCategoryChange: mockOnCategoryChange,
        }),
      );

      act(() => {
        result.current.handleSeasonChange('summer');
      });

      expect(result.current.tempFilters.season).toEqual([]);
    });

    it('undefined または 空文字が渡された時、空配列がセットされること', () => {
      const { result } = renderHook(() =>
        useFilterSheet({
          initialFilters: mockInitialFilters,
          onFilterApply: mockOnFilterApply,
          onCategoryChange: mockOnCategoryChange,
        }),
      );

      act(() => {
        result.current.handleSeasonChange(undefined);
      });

      expect(result.current.tempFilters.season).toEqual([]);

      act(() => {
        result.current.handleSeasonChange('');
      });

      expect(result.current.tempFilters.season).toEqual([]);
    });
  });

  // ステータス選択の動作テスト
  describe('ステータス選択', () => {
    it('複数のステータスを選択できること', () => {
      const { result } = renderHook(() =>
        useFilterSheet({
          initialFilters: mockInitialFilters,
          onFilterApply: mockOnFilterApply,
          onCategoryChange: mockOnCategoryChange,
        }),
      );

      const newStatuses = ['owned', 'used'] as Status[];

      act(() => {
        result.current.handleStatusChange(newStatuses);
      });

      expect(result.current.tempFilters.status).toEqual(newStatuses);
    });
  });

  // カテゴリー選択の動作テスト
  describe('カテゴリー選択', () => {
    it('新しいカテゴリーを選択したとき、正しく状態が更新されること', () => {
      const { result } = renderHook(() =>
        useFilterSheet({
          initialFilters: mockInitialFilters,
          onFilterApply: mockOnFilterApply,
          onCategoryChange: mockOnCategoryChange,
        }),
      );

      act(() => {
        result.current.handleCategoryChange('category2');
      });

      expect(result.current.tempFilters.category).toBe('category2');
    });
  });

  // フィルター適用の動作テスト
  describe('フィルター適用', () => {
    it('フィルターを適用したとき、コールバックが呼ばれシートが閉じること', () => {
      const { result } = renderHook(() =>
        useFilterSheet({
          initialFilters: mockInitialFilters,
          onFilterApply: mockOnFilterApply,
          onCategoryChange: mockOnCategoryChange,
        }),
      );

      act(() => {
        result.current.handleApplyFilters();
      });

      expect(mockOnFilterApply).toHaveBeenCalledWith(result.current.tempFilters);
      expect(mockOnCategoryChange).toHaveBeenCalledWith(result.current.tempFilters.category);
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  // リセット機能の動作テスト
  describe('フィルターリセット', () => {
    it('リセットしたとき、すべての値がデフォルト状態に戻ること', () => {
      const { result } = renderHook(() =>
        useFilterSheet({
          initialFilters: mockInitialFilters,
          onFilterApply: mockOnFilterApply,
          onCategoryChange: mockOnCategoryChange,
        }),
      );

      act(() => {
        result.current.handleReset();
      });

      const expectedDefaultState: FilterState = {
        category: '',
        status: [],
        season: [],
      };

      expect(result.current.tempFilters).toEqual(expectedDefaultState);
      expect(mockOnFilterApply).toHaveBeenCalledWith(expectedDefaultState);
      expect(mockOnCategoryChange).toHaveBeenCalledWith('');
    });
  });
});
