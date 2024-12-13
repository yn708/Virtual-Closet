import { useToast } from '@/hooks/use-toast';
import type { FashionItem } from '@/types';
import { ERROR_DESCRIPTION_MESSAGE, ERROR_MESSAGE } from '@/utils/constants';
import { act, renderHook } from '@testing-library/react';
import { useFashionItems } from '../useFashionItems';

// API関数の型定義
type DeleteFashionItemAPI = (id: string) => Promise<void>;
type FetchFashionItemsByCategoryAPI = (categoryId: string) => Promise<FashionItem[]>;

// 必要なモジュールをモック
jest.mock('@/hooks/use-toast', () => ({
  useToast: jest.fn(),
}));

// API関数のモック
const mockDeleteFashionItemAPI = jest.fn<
  ReturnType<DeleteFashionItemAPI>,
  Parameters<DeleteFashionItemAPI>
>();
const mockFetchFashionItemsByCategoryAPI = jest.fn<
  ReturnType<FetchFashionItemsByCategoryAPI>,
  Parameters<FetchFashionItemsByCategoryAPI>
>();

// APIモジュール全体をモック
jest.mock('@/lib/api/fashionItemsApi', () => ({
  deleteFashionItemAPI: (id: string) => mockDeleteFashionItemAPI(id),
  fetchFashionItemsByCategoryAPI: (categoryId: string) =>
    mockFetchFashionItemsByCategoryAPI(categoryId),
}));

describe('useFashionItems', () => {
  // モックデータの定義
  const mockItems: FashionItem[] = [
    {
      id: '1',
      image: 'test-image-1.jpg',
      sub_category: {
        id: 'sub1',
        subcategory_name: 'Tシャツ',
      },
      brand: {
        id: 'brand1',
        brand_name: 'テストブランド1',
        brand_name_kana: 'テストブランドイチ',
      },
      seasons: [{ id: 'spring', season_name: '春' }] as [{ id: string; season_name: string }],
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
        color_name: 'ネイビー',
        color_code: '#000080',
      },
      is_owned: true,
      is_old_clothes: false,
      created_at: new Date('2024-01-01'),
      updated_at: new Date('2024-01-01'),
    },
    {
      id: '2',
      image: 'test-image-2.jpg',
      sub_category: {
        id: 'sub2',
        subcategory_name: 'パンツ',
      },
      brand: null,
      seasons: [{ id: 'summer', season_name: '夏' }] as [{ id: string; season_name: string }],
      price_range: null,
      design: null,
      main_color: null,
      is_owned: false,
      is_old_clothes: true,
      created_at: new Date('2024-01-02'),
      updated_at: new Date('2024-01-02'),
    },
  ];

  // Toastの型定義とモック
  type ToastFunction = {
    variant: 'destructive';
    title: string;
    description: string;
  };

  const mockToast = jest.fn<void, [ToastFunction]>();

  beforeEach(() => {
    jest.clearAllMocks();
    (useToast as jest.Mock).mockReturnValue({ toast: mockToast });
    mockFetchFashionItemsByCategoryAPI.mockResolvedValue(mockItems);
  });

  it('初期状態が正しく設定されること', () => {
    const { result } = renderHook(() => useFashionItems());

    expect(result.current.selectedCategory).toBeUndefined();
    expect(result.current.filters).toEqual({
      category: '',
      status: [],
      season: [],
    });
    expect(result.current.currentItems).toEqual([]);
  });

  describe('カテゴリー変更機能', () => {
    it('新しいカテゴリーを選択したとき、データがフェッチされること', async () => {
      const { result } = renderHook(() => useFashionItems());

      await act(async () => {
        await result.current.handleCategoryChange('category1');
      });

      expect(mockFetchFashionItemsByCategoryAPI).toHaveBeenCalledWith('category1');
      expect(result.current.selectedCategory).toBe('category1');
      expect(result.current.filters.category).toBe('category1');
    });

    it('既にキャッシュされているカテゴリーを選択したとき、APIが呼ばれないこと', async () => {
      const { result } = renderHook(() => useFashionItems());

      await act(async () => {
        await result.current.handleCategoryChange('category1');
      });

      mockFetchFashionItemsByCategoryAPI.mockClear();

      await act(async () => {
        await result.current.handleCategoryChange('category1');
      });

      expect(mockFetchFashionItemsByCategoryAPI).not.toHaveBeenCalled();
    });
  });

  describe('アイテム削除機能', () => {
    it('アイテムが正常に削除されること', async () => {
      const { result } = renderHook(() => useFashionItems());

      await act(async () => {
        await result.current.handleCategoryChange('category1');
      });

      mockDeleteFashionItemAPI.mockResolvedValue(undefined);

      await act(async () => {
        await result.current.handleDelete('1');
      });

      expect(mockDeleteFashionItemAPI).toHaveBeenCalledWith('1');
      expect(result.current.currentItems.find((item) => item.id === '1')).toBeUndefined();
    });

    it('削除時にエラーが発生した場合、トーストが表示されること', async () => {
      const { result } = renderHook(() => useFashionItems());

      mockDeleteFashionItemAPI.mockRejectedValue(new Error('Delete failed'));

      await act(async () => {
        await result.current.handleDelete('1');
      });

      expect(mockToast).toHaveBeenCalledWith({
        variant: 'destructive',
        title: ERROR_MESSAGE,
        description: ERROR_DESCRIPTION_MESSAGE,
      });
    });
  });

  describe('フィルタリング機能', () => {
    beforeEach(async () => {
      mockFetchFashionItemsByCategoryAPI.mockResolvedValue(mockItems);
    });

    it('所有状態フィルターが正しく動作すること', async () => {
      const { result } = renderHook(() => useFashionItems());

      await act(async () => {
        await result.current.handleCategoryChange('category1');
        result.current.handleFilterChange({ status: ['owned'] });
      });

      expect(result.current.currentItems).toEqual([mockItems[0]]);
    });

    it('古着フィルターが正しく動作すること', async () => {
      const { result } = renderHook(() => useFashionItems());

      await act(async () => {
        await result.current.handleCategoryChange('category1');
        result.current.handleFilterChange({ status: ['used'] });
      });

      expect(result.current.currentItems).toEqual([mockItems[1]]);
    });

    it('シーズンフィルターが正しく動作すること', async () => {
      const { result } = renderHook(() => useFashionItems());

      await act(async () => {
        await result.current.handleCategoryChange('category1');
        result.current.handleFilterChange({ season: ['spring'] });
      });

      expect(result.current.currentItems).toEqual([mockItems[0]]);
    });

    it('複数のフィルターが組み合わされた場合も正しく動作すること', async () => {
      const { result } = renderHook(() => useFashionItems());

      await act(async () => {
        await result.current.handleCategoryChange('category1');
        result.current.handleFilterChange({
          status: ['owned'],
          season: ['spring'],
        });
      });

      expect(result.current.currentItems).toEqual([mockItems[0]]);
    });
  });
});
