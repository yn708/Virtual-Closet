import { useToast } from '@/hooks/use-toast';
import { deleteFashionItemAPI, fetchFashionItemsByCategoryAPI } from '@/lib/api/fashionItemsApi';
import type { FashionItem } from '@/types';
import { act, render, renderHook, screen } from '@testing-library/react';
import { FashionItemsProvider, useFashionItems } from '../FashionItemsContext';

// APIのモック
jest.mock('@/lib/api/fashionItemsApi', () => ({
  deleteFashionItemAPI: jest.fn(),
  fetchFashionItemsByCategoryAPI: jest.fn(),
}));

// useToastのモック
jest.mock('@/hooks/use-toast', () => ({
  useToast: jest.fn(),
}));

describe('FashionItemsProvider', () => {
  const mockToast = { toast: jest.fn() };

  const mockFashionItem: FashionItem = {
    id: '1',
    image: 'test-image.jpg',
    sub_category: {
      id: 'sub1',
      subcategory_name: 'Tシャツ',
      category: 'tops',
    },
    brand: {
      id: 'brand1',
      brand_name: 'TestBrand',
      brand_name_kana: 'テストブランド',
    },
    seasons: [
      {
        id: 'season1',
        season_name: '春',
      },
    ],
    price_range: {
      id: 'price1',
      price_range: '¥5,000-¥10,000',
    },
    design: {
      id: 'design1',
      design_pattern: 'ストライプ',
    },
    main_color: {
      id: 'color1',
      color_name: '黒',
      color_code: '#000000',
    },
    is_owned: true,
    is_old_clothes: false,
    created_at: new Date('2024-01-01'),
    updated_at: new Date('2024-01-01'),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useToast as jest.Mock).mockReturnValue(mockToast);
  });

  // 基本的なコンテキスト提供のテスト
  it('provides default values', () => {
    const TestComponent = () => {
      const { state } = useFashionItems();
      return (
        <div>
          <div data-testid="selected-category">{state.selectedCategory}</div>
          <div data-testid="items-count">{state.currentItems.length}</div>
          <div data-testid="filters-status">{state.filters.status.toString()}</div>
          <div data-testid="filters-season">{state.filters.season.join(',')}</div>
        </div>
      );
    };

    render(
      <FashionItemsProvider>
        <TestComponent />
      </FashionItemsProvider>,
    );

    expect(screen.getByTestId('selected-category')).toHaveTextContent('');
    expect(screen.getByTestId('items-count')).toHaveTextContent('0');
    expect(screen.getByTestId('filters-status')).toHaveTextContent('');
    expect(screen.getByTestId('filters-season')).toHaveTextContent('');
  });

  // カテゴリー変更のテスト
  it('handles category change correctly', async () => {
    const mockItems = [mockFashionItem];
    (fetchFashionItemsByCategoryAPI as jest.Mock).mockResolvedValue({
      results: mockItems,
      next: null,
    });
    const { result } = renderHook(() => useFashionItems(), {
      wrapper: FashionItemsProvider,
    });

    await act(async () => {
      await result.current.handlers.handleCategoryChange('tops');
    });

    expect(result.current.state.selectedCategory).toBe('tops');
    expect(result.current.state.currentItems).toHaveLength(1);
    expect(result.current.state.filters.category).toBe('tops');
    expect(fetchFashionItemsByCategoryAPI).toHaveBeenCalledWith('tops', 1);
  });

  // フィルター変更のテスト
  describe('filter changes', () => {
    it('handles owned status filter correctly', async () => {
      const mockItems = [
        { ...mockFashionItem, id: '1', is_owned: true },
        { ...mockFashionItem, id: '2', is_owned: false },
      ];

      const { result } = renderHook(() => useFashionItems(), {
        wrapper: FashionItemsProvider,
      });

      (fetchFashionItemsByCategoryAPI as jest.Mock).mockResolvedValue({
        results: mockItems,
        next: null,
      });
      await act(async () => {
        await result.current.handlers.handleCategoryChange('tops');
      });

      act(() => {
        result.current.handlers.handleFilterChange({ status: ['owned'] });
      });

      expect(result.current.state.currentItems).toHaveLength(1);
      expect(result.current.state.currentItems[0].id).toBe('1');
    });

    it('handles season filter correctly', async () => {
      const mockItems = [
        { ...mockFashionItem, id: '1', seasons: [{ id: 'spring', season_name: '春' }] },
        { ...mockFashionItem, id: '2', seasons: [{ id: 'summer', season_name: '夏' }] },
      ];

      const { result } = renderHook(() => useFashionItems(), {
        wrapper: FashionItemsProvider,
      });

      (fetchFashionItemsByCategoryAPI as jest.Mock).mockResolvedValue({
        results: mockItems,
        next: null,
      });
      await act(async () => {
        await result.current.handlers.handleCategoryChange('tops');
      });

      act(() => {
        result.current.handlers.handleFilterChange({ season: ['spring'] });
      });

      expect(result.current.state.currentItems).toHaveLength(1);
      expect(result.current.state.currentItems[0].id).toBe('1');
    });
  });

  // アイテム削除のテスト
  it('handles item deletion correctly', async () => {
    const mockItems = [
      { ...mockFashionItem, id: '1' },
      { ...mockFashionItem, id: '2' },
    ];

    // PaginatedResponseの形式で返す
    (fetchFashionItemsByCategoryAPI as jest.Mock).mockResolvedValue({
      results: mockItems,
      next: null,
    });
    (deleteFashionItemAPI as jest.Mock).mockResolvedValue(undefined);

    const { result } = renderHook(() => useFashionItems(), {
      wrapper: FashionItemsProvider,
    });

    // カテゴリーを設定してキャッシュを初期化
    await act(async () => {
      await result.current.handlers.handleCategoryChange('tops');
    });

    // 削除前の状態を確認
    expect(result.current.state.currentItems).toHaveLength(2);

    await act(async () => {
      await result.current.handlers.handleDelete('1');
    });

    expect(result.current.state.currentItems).toHaveLength(1);
    expect(result.current.state.currentItems[0].id).toBe('2');
  });

  // 削除エラーのテスト
  it('handles deletion error correctly', async () => {
    (deleteFashionItemAPI as jest.Mock).mockRejectedValue(new Error('Delete failed'));

    const { result } = renderHook(() => useFashionItems(), {
      wrapper: FashionItemsProvider,
    });

    await act(async () => {
      await result.current.handlers.handleDelete('1');
    });

    expect(mockToast.toast).toHaveBeenCalledWith({
      variant: 'destructive',
      title: 'エラー',
      description: 'アイテムの削除に失敗しました。',
    });
  });

  // アイテム更新のテスト
  it('handles item update correctly', async () => {
    const initialItem = { ...mockFashionItem, id: '1' };
    const mockItems = [initialItem];

    // PaginatedResponseの形式でモックデータを返す
    (fetchFashionItemsByCategoryAPI as jest.Mock).mockResolvedValue({
      results: mockItems,
      next: null,
    });

    const { result } = renderHook(() => useFashionItems(), {
      wrapper: FashionItemsProvider,
    });

    // 最初にカテゴリーを設定してキャッシュを初期化
    await act(async () => {
      await result.current.handlers.handleCategoryChange('tops');
    });

    // 更新前の状態を確認
    expect(result.current.state.currentItems).toHaveLength(1);
    expect(result.current.state.currentItems[0].main_color?.color_name).toBe('黒');

    const updatedItem = {
      ...initialItem,
      main_color: {
        id: 'color2',
        color_name: '白',
        color_code: '#FFFFFF',
      },
    };

    // アイテムを更新
    await act(async () => {
      result.current.handlers.handleUpdate(updatedItem);
    });

    // 更新後の状態を確認
    expect(result.current.state.currentItems).toHaveLength(1);
    expect(result.current.state.currentItems[0].main_color?.color_name).toBe('白');
  });

  // コンテキスト外使用のエラーテスト
  it('throws error when used outside provider', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      renderHook(() => useFashionItems());
    }).toThrow('useFashionItems must be used within FashionItemsProvider');

    consoleError.mockRestore();
  });
});
