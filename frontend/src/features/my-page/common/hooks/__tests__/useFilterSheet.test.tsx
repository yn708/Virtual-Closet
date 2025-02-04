import { useIsOpen } from '@/hooks/utils/useIsOpen';
import { act, renderHook } from '@testing-library/react';
import type { FilterSheetConfig } from '../../types';
import { useFilterSheet } from '../useFilterSheet';

jest.mock('@/hooks/utils/useIsOpen', () => ({
  useIsOpen: jest.fn(),
}));

describe('useFilterSheet', () => {
  const mockConfig: FilterSheetConfig = {
    title: 'Test Filters',
    categories: [
      { id: '1', label: 'Category 1' },
      { id: '2', label: 'Category 2' },
    ],
    filterGroups: [
      {
        key: 'colors',
        label: 'Colors',
        options: [
          { id: 'red', label: 'Red' },
          { id: 'blue', label: 'Blue' },
        ],
      },
      {
        key: 'sizes',
        label: 'Sizes',
        options: [
          { id: 'small', label: 'Small' },
          { id: 'large', label: 'Large' },
        ],
      },
    ],
    layout: {
      categoryGrid: {
        small: 'grid-cols-2',
        large: 'grid-cols-3',
      },
    },
    filterHandlers: {
      defaultFilters: {
        category: '',
        colors: [],
        sizes: [],
      },
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useIsOpen as jest.Mock).mockReturnValue({
      isOpen: false,
      onClose: jest.fn(),
      onToggle: jest.fn(),
    });
  });

  it('初期状態が正しく設定されること', () => {
    const mockProps = {
      initialFilters: { category: '1', colors: [], sizes: [] },
      onFilterApply: jest.fn(),
      onCategoryChange: jest.fn(),
      config: mockConfig,
    };

    const { result } = renderHook(() => useFilterSheet(mockProps));

    expect(result.current.state.isOpen).toBe(false);
    expect(result.current.state.tempFilters).toEqual(mockProps.initialFilters);
    expect(result.current.state.appliedFiltersCount).toBe(0);
  });

  it('シートを開閉した時に一時フィルターがリセットされること', () => {
    const mockToggle = jest.fn();
    (useIsOpen as jest.Mock).mockReturnValue({
      isOpen: false,
      onClose: jest.fn(),
      onToggle: mockToggle,
    });

    const mockProps = {
      initialFilters: { category: '1', colors: [], sizes: [] },
      onFilterApply: jest.fn(),
      onCategoryChange: jest.fn(),
      config: mockConfig,
    };

    const { result } = renderHook(() => useFilterSheet(mockProps));

    act(() => {
      result.current.handlers.handleSheetOpenChange();
    });

    expect(mockToggle).toHaveBeenCalled();
    expect(result.current.state.tempFilters).toEqual(mockProps.initialFilters);
  });

  it('フィルター値が正しく更新されること', () => {
    const mockProps = {
      initialFilters: { category: '1', colors: [], sizes: [] },
      onFilterApply: jest.fn(),
      onCategoryChange: jest.fn(),
      config: mockConfig,
    };

    const { result } = renderHook(() => useFilterSheet(mockProps));

    act(() => {
      result.current.handlers.handleFilterChange('colors', ['blue']);
    });

    expect(result.current.state.tempFilters.colors).toEqual(['blue']);
  });

  it('カテゴリーが正しく更新されること', () => {
    const mockProps = {
      initialFilters: { category: '1', colors: [], sizes: [] },
      onFilterApply: jest.fn(),
      onCategoryChange: jest.fn(),
      config: mockConfig,
    };

    const { result } = renderHook(() => useFilterSheet(mockProps));

    act(() => {
      result.current.handlers.handleCategoryChange('2');
    });

    expect(result.current.state.tempFilters.category).toBe('2');
  });

  it('フィルター適用時に正しくコールバックが呼ばれること', () => {
    const onClose = jest.fn();
    (useIsOpen as jest.Mock).mockReturnValue({
      isOpen: true,
      onClose,
      onToggle: jest.fn(),
    });

    const mockProps = {
      initialFilters: { category: '1', colors: [], sizes: [] },
      onFilterApply: jest.fn(),
      onCategoryChange: jest.fn(),
      config: mockConfig,
    };

    const { result } = renderHook(() => useFilterSheet(mockProps));

    act(() => {
      result.current.handlers.handleCategoryChange('2');
    });

    act(() => {
      result.current.handlers.handleApplyFilters();
    });

    // カテゴリーが変更されているため onCategoryChange が呼ばれる
    expect(mockProps.onCategoryChange).toHaveBeenCalledWith('2');
    expect(mockProps.onFilterApply).toHaveBeenCalledWith({
      category: '2',
      colors: [],
      sizes: [],
    });
    expect(onClose).toHaveBeenCalled();
  });

  it('カテゴリーが変更されていない場合、カテゴリー更新コールバックが呼ばれないこと', () => {
    const mockProps = {
      initialFilters: { category: '1', colors: [], sizes: [] },
      onFilterApply: jest.fn(),
      onCategoryChange: jest.fn(),
      config: mockConfig,
    };

    const { result } = renderHook(() => useFilterSheet(mockProps));

    act(() => {
      result.current.handlers.handleFilterChange('colors', ['blue']);
      result.current.handlers.handleApplyFilters();
    });

    expect(mockProps.onCategoryChange).not.toHaveBeenCalled();
    expect(mockProps.onFilterApply).toHaveBeenCalled();
  });

  it('リセット時にデフォルト値が正しく適用され、コールバックは呼ばれないこと', () => {
    const mockProps = {
      initialFilters: { category: '1', colors: ['red'], sizes: ['small'] },
      onFilterApply: jest.fn(),
      onCategoryChange: jest.fn(),
      config: mockConfig,
    };

    const { result } = renderHook(() => useFilterSheet(mockProps));

    act(() => {
      result.current.handlers.handleReset();
    });

    // defaultFilters の内容に、現在の category ('1') を維持していることを検証
    expect(result.current.state.tempFilters).toEqual({
      category: '1',
      colors: [],
      sizes: [],
    });
    // リセット時はコールバックは呼び出さない
    expect(mockProps.onFilterApply).not.toHaveBeenCalled();
    expect(mockProps.onCategoryChange).not.toHaveBeenCalled();
  });

  it('appliedFiltersCount がフィルター適用時に更新されること', () => {
    const onClose = jest.fn();
    (useIsOpen as jest.Mock).mockReturnValue({
      isOpen: true,
      onClose,
      onToggle: jest.fn(),
    });

    const mockProps = {
      initialFilters: { category: '1', colors: [], sizes: [] },
      onFilterApply: jest.fn(),
      onCategoryChange: jest.fn(),
      config: mockConfig,
    };

    const { result } = renderHook(() => useFilterSheet(mockProps));

    act(() => {
      result.current.handlers.handleFilterChange('colors', ['blue']);
      result.current.handlers.handleFilterChange('sizes', ['small']);
    });

    act(() => {
      result.current.handlers.handleApplyFilters();
    });

    // category 以外のフィルターが両方 truthy になっているので count は 2 になる
    expect(result.current.state.appliedFiltersCount).toBe(2);
  });
});
