import { deleteFashionItemAPI, fetchFashionItemsByCategoryAPI } from '@/lib/api/fashionItemsApi';
import type { FashionItem } from '@/types';
import { act, render, renderHook, screen } from '@testing-library/react';
import { FashionItemsProvider, useFashionItems } from '../FashionItemsContext';

// APIのモック
jest.mock('@/lib/api/fashionItemsApi', () => ({
  deleteFashionItemAPI: jest.fn(),
  fetchFashionItemsByCategoryAPI: jest.fn(),
}));

// テスト用のモックデータ
const mockItems: FashionItem[] = [
  {
    id: '1',
    image: 'test1.jpg',
    sub_category: {
      id: 'sub1',
      subcategory_name: 'Tシャツ',
      category: 'category1',
    },
    brand: {
      id: 'brand1',
      brand_name: 'テストブランド1',
      brand_name_kana: 'テストブランドイチ',
    },
    seasons: [{ id: 'spring', season_name: '春' }],
    price_range: {
      id: 'price1',
      price_range: '¥1,000-¥3,000',
    },
    design: {
      id: 'design1',
      design_pattern: 'ストライプ',
    },
    main_color: {
      id: 'color1',
      color_name: '白',
      color_code: '#FFFFFF',
    },
    is_owned: true,
    is_old_clothes: false,
    created_at: new Date('2024-01-01'),
    updated_at: new Date('2024-01-01'),
  },
  {
    id: '2',
    image: 'test2.jpg',
    sub_category: {
      id: 'sub2',
      subcategory_name: 'パンツ',
      category: 'category1',
    },
    brand: null,
    seasons: [{ id: 'summer', season_name: '夏' }],
    price_range: null,
    design: null,
    main_color: {
      id: 'color2',
      color_name: '黒',
      color_code: '#000000',
    },
    is_owned: false,
    is_old_clothes: true,
    created_at: new Date('2024-01-02'),
    updated_at: new Date('2024-01-02'),
  },
];

describe('FashionItemsProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (fetchFashionItemsByCategoryAPI as jest.Mock).mockResolvedValue(mockItems);
  });

  // 基本的なコンテキスト提供のテスト
  it('provides default values', () => {
    const TestComponent = () => {
      const { currentItems, selectedCategory, filters } = useFashionItems();
      return (
        <div>
          <div data-testid="items-count">{currentItems.length}</div>
          <div data-testid="selected-category">{selectedCategory || 'none'}</div>
          <div data-testid="filters">{JSON.stringify(filters)}</div>
        </div>
      );
    };

    render(
      <FashionItemsProvider>
        <TestComponent />
      </FashionItemsProvider>,
    );

    expect(screen.getByTestId('items-count')).toHaveTextContent('0');
    expect(screen.getByTestId('selected-category')).toHaveTextContent('none');
    expect(JSON.parse(screen.getByTestId('filters').textContent || '{}')).toEqual({
      category: '',
      status: [],
      season: [],
    });
  });

  // カテゴリー変更のテスト
  it('handles category change correctly', async () => {
    const { result } = renderHook(() => useFashionItems(), {
      wrapper: FashionItemsProvider,
    });

    await act(async () => {
      await result.current.handleCategoryChange('category1');
    });

    expect(fetchFashionItemsByCategoryAPI).toHaveBeenCalledWith('category1');
    expect(result.current.selectedCategory).toBe('category1');
    expect(result.current.currentItems).toEqual(mockItems);
    expect(result.current.currentItems[0].sub_category.category).toBe('category1');
  });

  // キャッシュの動作テスト
  it('uses cache for repeated category selections', async () => {
    const { result } = renderHook(() => useFashionItems(), {
      wrapper: FashionItemsProvider,
    });

    // 初回のカテゴリー選択
    await act(async () => {
      await result.current.handleCategoryChange('category1');
    });

    // 同じカテゴリーを再選択
    await act(async () => {
      await result.current.handleCategoryChange('category1');
    });

    // APIは1回だけ呼ばれるべき
    expect(fetchFashionItemsByCategoryAPI).toHaveBeenCalledTimes(1);
  });

  // フィルター機能のテスト
  describe('filtering', () => {
    it('filters by ownership status correctly', async () => {
      const { result } = renderHook(() => useFashionItems(), {
        wrapper: FashionItemsProvider,
      });

      await act(async () => {
        await result.current.handleCategoryChange('category1');
        result.current.handleFilterChange({ status: ['owned'] });
      });

      expect(result.current.currentItems).toHaveLength(1);
      expect(result.current.currentItems[0].id).toBe('1');
      expect(result.current.currentItems[0].is_owned).toBe(true);
    });

    it('filters by used clothes status correctly', async () => {
      const { result } = renderHook(() => useFashionItems(), {
        wrapper: FashionItemsProvider,
      });

      await act(async () => {
        await result.current.handleCategoryChange('category1');
        result.current.handleFilterChange({ status: ['used'] });
      });

      expect(result.current.currentItems).toHaveLength(1);
      expect(result.current.currentItems[0].id).toBe('2');
      expect(result.current.currentItems[0].is_old_clothes).toBe(true);
    });

    it('filters by season correctly', async () => {
      const { result } = renderHook(() => useFashionItems(), {
        wrapper: FashionItemsProvider,
      });

      await act(async () => {
        await result.current.handleCategoryChange('category1');
        result.current.handleFilterChange({ season: ['summer'] });
      });

      expect(result.current.currentItems).toHaveLength(1);
      expect(result.current.currentItems[0].id).toBe('2');
      expect(result.current.currentItems[0].seasons[0].id).toBe('summer');
    });

    it('combines multiple filters correctly', async () => {
      const { result } = renderHook(() => useFashionItems(), {
        wrapper: FashionItemsProvider,
      });

      await act(async () => {
        await result.current.handleCategoryChange('category1');
        result.current.handleFilterChange({
          status: ['owned'],
          season: ['spring'],
        });
      });

      expect(result.current.currentItems).toHaveLength(1);
      expect(result.current.currentItems[0].id).toBe('1');
      expect(result.current.currentItems[0].is_owned).toBe(true);
      expect(result.current.currentItems[0].seasons[0].id).toBe('spring');
    });
  });

  // アイテム削除のテスト
  describe('item deletion', () => {
    it('handles successful item deletion', async () => {
      const { result } = renderHook(() => useFashionItems(), {
        wrapper: FashionItemsProvider,
      });

      await act(async () => {
        await result.current.handleCategoryChange('category1');
      });

      (deleteFashionItemAPI as jest.Mock).mockResolvedValueOnce(undefined);

      await act(async () => {
        await result.current.handleDelete('1');
      });

      expect(deleteFashionItemAPI).toHaveBeenCalledWith('1');
      expect(result.current.currentItems).toHaveLength(1);
      expect(result.current.currentItems[0].id).toBe('2');
    });

    it('handles deletion error correctly', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      const { result } = renderHook(() => useFashionItems(), {
        wrapper: FashionItemsProvider,
      });

      await act(async () => {
        await result.current.handleCategoryChange('category1');
      });

      (deleteFashionItemAPI as jest.Mock).mockRejectedValueOnce(new Error('Delete failed'));

      await act(async () => {
        await result.current.handleDelete('1');
      });

      expect(consoleErrorSpy).toHaveBeenCalled();
      expect(result.current.currentItems).toHaveLength(2);

      consoleErrorSpy.mockRestore();
    });
  });

  // アイテム更新のテスト
  it('handles item update correctly', async () => {
    const { result } = renderHook(() => useFashionItems(), {
      wrapper: FashionItemsProvider,
    });

    await act(async () => {
      await result.current.handleCategoryChange('category1');
    });

    const updatedItem: FashionItem = {
      ...mockItems[0],
      brand: {
        id: 'brand2',
        brand_name: '更新されたブランド',
        brand_name_kana: 'コウシンサレタブランド',
      },
    };

    act(() => {
      result.current.handleUpdate(updatedItem);
    });

    expect(result.current.currentItems[0].brand?.brand_name).toBe('更新されたブランド');
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
