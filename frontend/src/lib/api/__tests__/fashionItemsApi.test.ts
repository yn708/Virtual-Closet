/**
 * @jest-environment node
 */
import { baseFetchAuthAPI } from '@/lib/api/baseApi';
import {
  fetchFashionItemMetaDataAPI,
  registerFashionItem,
  searchBrandsAPI,
} from '@/lib/api/fashionItemsApi';
import {
  BASE_FASHION_ITEMS_ENDPOINT,
  FASHION_ITEM_METADATA_ENDPOINT,
  FASHION_ITEM_REGISTER_ENDPOINT,
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
  describe('fetchFashionItemMetaDataAPI', () => {
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
      const result = await fetchFashionItemMetaDataAPI();

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
      await expect(fetchFashionItemMetaDataAPI()).rejects.toThrow(JSON.stringify(errorResponse));
    });
  });

  /**
   * ブランド検索APIのテスト
   */
  describe('searchBrandsAPI', () => {
    it('正常なブランド検索リクエストを送信する', async () => {
      // モックの戻り値を設定
      const mockBrands = [
        { id: 1, name: 'ブランドA' },
        { id: 2, name: 'ブランドB' },
      ];
      (baseFetchAuthAPI as jest.Mock).mockResolvedValueOnce(mockBrands);

      const searchQuery = 'ブランド';
      // API呼び出し
      const result = await searchBrandsAPI(searchQuery);

      // 正しいエンドポイントでAPIが呼ばれたか確認
      const expectedEndpoint = `${BASE_FASHION_ITEMS_ENDPOINT}/brands/search/?query=${encodeURIComponent(
        searchQuery,
      )}`;
      expect(baseFetchAuthAPI).toHaveBeenCalledWith(expectedEndpoint);
      expect(result).toEqual(mockBrands);
    });

    it('特殊文字を含む検索クエリを適切にエンコードする', async () => {
      const mockBrands = [{ id: 1, name: 'A&B' }];
      (baseFetchAuthAPI as jest.Mock).mockResolvedValueOnce(mockBrands);

      const searchQuery = 'A&B';
      await searchBrandsAPI(searchQuery);

      const expectedEndpoint = `${BASE_FASHION_ITEMS_ENDPOINT}/brands/search/?query=${encodeURIComponent(
        searchQuery,
      )}`;
      expect(baseFetchAuthAPI).toHaveBeenCalledWith(expectedEndpoint);
    });

    it('APIエラーを適切に処理する', async () => {
      // エラーレスポンスのモック
      const errorResponse = { message: 'ブランド検索に失敗しました' };
      (baseFetchAuthAPI as jest.Mock).mockRejectedValueOnce(
        new Error(JSON.stringify(errorResponse)),
      );

      // エラーがスローされることを確認
      await expect(searchBrandsAPI('test')).rejects.toThrow(JSON.stringify(errorResponse));
    });
  });

  /**
   * ファッションアイテム登録APIのテスト
   */
  describe('registerFashionItem', () => {
    it('正常なファッションアイテム登録リクエストを送信する', async () => {
      // FormDataのモックを作成
      const mockFormData = new FormData();
      mockFormData.append('name', 'テストアイテム');
      mockFormData.append('category', '1');
      mockFormData.append('brand', '1');
      mockFormData.append('price', '5000');

      // モックの戻り値を設定
      const mockResponse = { success: true, id: 1 };
      (baseFetchAuthAPI as jest.Mock).mockResolvedValueOnce(mockResponse);

      // API呼び出し
      const result = await registerFashionItem(mockFormData);

      // 正しいエンドポイントとデータでAPIが呼ばれたか確認
      expect(baseFetchAuthAPI).toHaveBeenCalledWith(
        FASHION_ITEM_REGISTER_ENDPOINT,
        expect.objectContaining({
          method: 'POST',
          body: mockFormData,
        }),
      );
      expect(result).toEqual(mockResponse);
    });

    it('画像を含むファッションアイテム登録リクエストを送信する', async () => {
      // FormDataのモックを作成（画像付き）
      const mockFormData = new FormData();
      mockFormData.append('name', 'テストアイテム');
      mockFormData.append('category', '1');

      // 画像ファイルのモック
      const mockFile = new File(['dummy content'], 'test.jpg', { type: 'image/jpeg' });
      mockFormData.append('image', mockFile);

      // モックの戻り値を設定
      const mockResponse = { success: true, id: 1 };
      (baseFetchAuthAPI as jest.Mock).mockResolvedValueOnce(mockResponse);

      // API呼び出し
      await registerFashionItem(mockFormData);

      // 正しいエンドポイントとデータでAPIが呼ばれたか確認
      expect(baseFetchAuthAPI).toHaveBeenCalledWith(
        FASHION_ITEM_REGISTER_ENDPOINT,
        expect.objectContaining({
          method: 'POST',
          body: mockFormData,
        }),
      );
    });

    it('APIエラーを適切に処理する', async () => {
      const mockFormData = new FormData();
      mockFormData.append('name', 'テストアイテム');

      // エラーレスポンスのモック
      const errorResponse = { message: 'アイテムの登録に失敗しました' };
      (baseFetchAuthAPI as jest.Mock).mockRejectedValueOnce(
        new Error(JSON.stringify(errorResponse)),
      );

      // エラーがスローされることを確認
      await expect(registerFashionItem(mockFormData)).rejects.toThrow(
        JSON.stringify(errorResponse),
      );
    });
  });
});
