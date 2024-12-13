/**
 * @jest-environment node
 */
import { baseFetchAuthAPI } from '@/lib/api/baseApi';
import {
  deleteFashionItemAPI,
  fetchFashionItemsByCategoryAPI,
  fetchFashionMetaDataAPI,
  registerFashionItemAPI,
  searchBrandsAPI,
  updateFashionItemAPI,
} from '@/lib/api/fashionItemsApi';
import {
  BRAND_SEARCH_ENDPOINT,
  FASHION_ITEM_METADATA_ENDPOINT,
  FASHION_ITEMS_BY_CATEGORY_ENDPOINT,
  FASHION_ITEMS_ENDPOINT,
} from '@/utils/constants';

// baseFetchAuthAPIのモック
jest.mock('@/lib/api/baseApi', () => ({
  baseFetchAuthAPI: jest.fn(),
}));

/**
 * ファッションアイテムAPI関連のテストスイート
 */
describe('Fashion Item APIs', () => {
  // 各テスト前にモックをリセット
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * メタデータ取得APIのテスト
   */
  describe('fetchFashionMetaDataAPI', () => {
    it('正常なメタデータ取得リクエストを送信する', async () => {
      // モックの戻り値を設定
      const mockMetaData = {
        categories: [
          { id: 1, name: 'トップス' },
          { id: 2, name: 'ボトムス' },
        ],
        seasons: [
          { id: 1, name: '春' },
          { id: 2, name: '夏' },
        ],
        priceRanges: [
          { id: 1, range: '¥0-¥5,000' },
          { id: 2, range: '¥5,000-¥10,000' },
        ],
        patterns: [
          { id: 1, name: '無地' },
          { id: 2, name: 'ストライプ' },
        ],
        mainColors: [
          { id: 1, name: 'ブラック' },
          { id: 2, name: 'ホワイト' },
        ],
        popularBrands: [
          { id: 1, name: 'ブランドA' },
          { id: 2, name: 'ブランドB' },
        ],
      };
      (baseFetchAuthAPI as jest.Mock).mockResolvedValueOnce(mockMetaData);

      // API呼び出し
      const result = await fetchFashionMetaDataAPI();

      // 正しいエンドポイントとオプションでAPIが呼ばれたか確認
      expect(baseFetchAuthAPI).toHaveBeenCalledWith(FASHION_ITEM_METADATA_ENDPOINT, {
        cache: 'force-cache',
      });
      expect(result).toEqual(mockMetaData);
    });

    it('APIエラーを適切に処理する', async () => {
      // エラーレスポンスのモック
      const errorResponse = { message: 'メタデータの取得に失敗しました' };
      (baseFetchAuthAPI as jest.Mock).mockRejectedValueOnce(
        new Error(JSON.stringify(errorResponse)),
      );

      // エラーがスローされることを確認
      await expect(fetchFashionMetaDataAPI()).rejects.toThrow(JSON.stringify(errorResponse));
    });
  });

  /**
   * ブランド検索APIのテスト
   */
  describe('searchBrandsAPI', () => {
    it('正常なブランド検索リクエストを送信する', async () => {
      const mockBrands = [
        { id: 1, name: 'ブランドA' },
        { id: 2, name: 'ブランドB' },
      ];
      (baseFetchAuthAPI as jest.Mock).mockResolvedValueOnce(mockBrands);

      const searchQuery = 'ブランド';
      const result = await searchBrandsAPI(searchQuery);

      const expectedEndpoint = `${BRAND_SEARCH_ENDPOINT}?query=${encodeURIComponent(searchQuery)}`;
      expect(baseFetchAuthAPI).toHaveBeenCalledWith(expectedEndpoint);
      expect(result).toEqual(mockBrands);
    });

    it('特殊文字を含む検索クエリを適切にエンコードする', async () => {
      const mockBrands = [{ id: 1, name: 'A&B' }];
      (baseFetchAuthAPI as jest.Mock).mockResolvedValueOnce(mockBrands);

      const searchQuery = 'A&B';
      await searchBrandsAPI(searchQuery);

      const expectedEndpoint = `${BRAND_SEARCH_ENDPOINT}?query=${encodeURIComponent(searchQuery)}`;
      expect(baseFetchAuthAPI).toHaveBeenCalledWith(expectedEndpoint);
    });

    it('APIエラーを適切に処理する', async () => {
      const errorResponse = { message: 'ブランド検索に失敗しました' };
      (baseFetchAuthAPI as jest.Mock).mockRejectedValueOnce(
        new Error(JSON.stringify(errorResponse)),
      );

      await expect(searchBrandsAPI('test')).rejects.toThrow(JSON.stringify(errorResponse));
    });
  });

  /**
   * ファッションアイテム登録APIのテスト
   */
  describe('registerFashionItemAPI', () => {
    it('正常なファッションアイテム登録リクエストを送信する', async () => {
      const mockFormData = new FormData();
      mockFormData.append('name', 'テストアイテム');
      mockFormData.append('category', '1');

      const mockResponse = { success: true, id: 1 };
      (baseFetchAuthAPI as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await registerFashionItemAPI(mockFormData);

      expect(baseFetchAuthAPI).toHaveBeenCalledWith(FASHION_ITEMS_ENDPOINT, {
        method: 'POST',
        body: mockFormData,
      });
      expect(result).toEqual(mockResponse);
    });

    it('APIエラーを適切に処理する', async () => {
      const mockFormData = new FormData();
      const errorResponse = { message: 'アイテムの登録に失敗しました' };
      (baseFetchAuthAPI as jest.Mock).mockRejectedValueOnce(
        new Error(JSON.stringify(errorResponse)),
      );

      await expect(registerFashionItemAPI(mockFormData)).rejects.toThrow(
        JSON.stringify(errorResponse),
      );
    });
  });

  /**
   * カテゴリー別アイテム取得APIのテスト
   */
  describe('fetchFashionItemsByCategoryAPI', () => {
    it('正常なカテゴリー別アイテム取得リクエストを送信する', async () => {
      const mockItems = [
        { id: 1, name: 'アイテム1', category: 'トップス' },
        { id: 2, name: 'アイテム2', category: 'トップス' },
      ];
      (baseFetchAuthAPI as jest.Mock).mockResolvedValueOnce(mockItems);

      const categoryId = '1';
      const result = await fetchFashionItemsByCategoryAPI(categoryId);

      expect(baseFetchAuthAPI).toHaveBeenCalledWith(
        `${FASHION_ITEMS_BY_CATEGORY_ENDPOINT}${categoryId}`,
      );
      expect(result).toEqual(mockItems);
    });

    it('APIエラーを適切に処理する', async () => {
      const errorResponse = { message: 'カテゴリー別アイテムの取得に失敗しました' };
      (baseFetchAuthAPI as jest.Mock).mockRejectedValueOnce(
        new Error(JSON.stringify(errorResponse)),
      );

      await expect(fetchFashionItemsByCategoryAPI('1')).rejects.toThrow(
        JSON.stringify(errorResponse),
      );
    });
  });

  /**
   * ファッションアイテム更新APIのテスト
   */
  describe('updateFashionItemAPI', () => {
    it('正常なファッションアイテム更新リクエストを送信する', async () => {
      const mockFormData = new FormData();
      mockFormData.append('name', '更新アイテム');

      const mockResponse = { success: true };
      (baseFetchAuthAPI as jest.Mock).mockResolvedValueOnce(mockResponse);

      const itemId = '1';
      const result = await updateFashionItemAPI(itemId, mockFormData);

      expect(baseFetchAuthAPI).toHaveBeenCalledWith(`${FASHION_ITEMS_ENDPOINT}${itemId}/`, {
        method: 'PUT',
        body: mockFormData,
      });
      expect(result).toEqual(mockResponse);
    });

    it('APIエラーを適切に処理する', async () => {
      const mockFormData = new FormData();
      const errorResponse = { message: 'アイテムの更新に失敗しました' };
      (baseFetchAuthAPI as jest.Mock).mockRejectedValueOnce(
        new Error(JSON.stringify(errorResponse)),
      );

      await expect(updateFashionItemAPI('1', mockFormData)).rejects.toThrow(
        JSON.stringify(errorResponse),
      );
    });
  });

  /**
   * ファッションアイテム削除APIのテスト
   */
  describe('deleteFashionItemAPI', () => {
    it('正常なファッションアイテム削除リクエストを送信する', async () => {
      const mockResponse = { success: true };
      (baseFetchAuthAPI as jest.Mock).mockResolvedValueOnce(mockResponse);

      const itemId = '1';
      const result = await deleteFashionItemAPI(itemId);

      expect(baseFetchAuthAPI).toHaveBeenCalledWith(`${FASHION_ITEMS_ENDPOINT}${itemId}/`, {
        method: 'DELETE',
      });
      expect(result).toEqual(mockResponse);
    });

    it('APIエラーを適切に処理する', async () => {
      const errorResponse = { message: 'アイテムの削除に失敗しました' };
      (baseFetchAuthAPI as jest.Mock).mockRejectedValueOnce(
        new Error(JSON.stringify(errorResponse)),
      );

      await expect(deleteFashionItemAPI('1')).rejects.toThrow(JSON.stringify(errorResponse));
    });
  });
});
