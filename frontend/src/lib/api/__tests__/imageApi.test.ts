/**
 * @jest-environment node
 */
import { baseFetchAuthAPI } from '@/lib/api/baseApi';
import { removeBackgroundAPI } from '@/lib/api/imageApi';
import { IMAGE_REMOVE_BG_ENDPOINT } from '@/utils/constants';

// baseFetchAuthAPIのモック
jest.mock('@/lib/api/baseApi', () => ({
  baseFetchAuthAPI: jest.fn(),
}));

/**
 * 画像背景除去API関連のテストスイート
 */
describe('Image Background Removal API', () => {
  // 各テスト前にモックをリセット
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('removeBackgroundAPI', () => {
    // 正常系：画像データを含むリクエストのテスト
    it('画像データを含む背景除去リクエストを正しく送信する', async () => {
      // FormDataのモックを作成
      const mockFormData = new FormData();
      const mockImageBlob = new Blob(['testimage'], { type: 'image/jpeg' });
      mockFormData.append('image', mockImageBlob, 'test.jpg');

      // モックの戻り値を設定（背景除去後の画像URLを想定）
      const mockResponse = {
        processed_image_url: 'https://example.com/processed-image.jpg',
      };
      (baseFetchAuthAPI as jest.Mock).mockResolvedValueOnce(mockResponse);

      // API呼び出し
      const result = await removeBackgroundAPI(mockFormData);

      // 正しいエンドポイントとメソッド、データでAPIが呼ばれたか確認
      expect(baseFetchAuthAPI).toHaveBeenCalledWith(
        IMAGE_REMOVE_BG_ENDPOINT,
        expect.objectContaining({
          method: 'POST',
          body: mockFormData,
        }),
      );

      // レスポンスが正しく返されることを確認
      expect(result).toEqual(mockResponse);
    });

    // 異常系：空のFormDataでのリクエストのテスト
    it('空のFormDataでリクエストを送信した場合のエラーを処理する', async () => {
      const emptyFormData = new FormData();

      // エラーレスポンスのモック
      const errorResponse = { message: '画像データが含まれていません' };
      (baseFetchAuthAPI as jest.Mock).mockRejectedValueOnce(
        new Error(JSON.stringify(errorResponse)),
      );

      // エラーがスローされることを確認
      await expect(removeBackgroundAPI(emptyFormData)).rejects.toThrow(
        JSON.stringify(errorResponse),
      );
    });

    // 異常系：APIエラーの処理のテスト
    it('API処理エラーを適切に処理する', async () => {
      // FormDataのモックを作成
      const mockFormData = new FormData();
      const mockImageBlob = new Blob(['testimage'], { type: 'image/jpeg' });
      mockFormData.append('image', mockImageBlob, 'test.jpg');

      // エラーレスポンスのモック
      const errorResponse = { message: '画像の背景除去処理に失敗しました' };
      (baseFetchAuthAPI as jest.Mock).mockRejectedValueOnce(
        new Error(JSON.stringify(errorResponse)),
      );

      // エラーがスローされることを確認
      await expect(removeBackgroundAPI(mockFormData)).rejects.toThrow(
        JSON.stringify(errorResponse),
      );
    });

    // 正常系：大きなサイズの画像データを含むリクエストのテスト
    it('大きなサイズの画像データを含むリクエストを正しく処理する', async () => {
      // 大きなサイズの画像データを模擬
      const mockFormData = new FormData();
      const largeImageBlob = new Blob([new ArrayBuffer(5 * 1024 * 1024)], { type: 'image/jpeg' });
      mockFormData.append('image', largeImageBlob, 'large-image.jpg');

      // モックの戻り値を設定
      const mockResponse = {
        processed_image_url: 'https://example.com/processed-large-image.jpg',
      };
      (baseFetchAuthAPI as jest.Mock).mockResolvedValueOnce(mockResponse);

      // API呼び出し
      const result = await removeBackgroundAPI(mockFormData);

      // 正しいエンドポイントとデータでAPIが呼ばれたか確認
      expect(baseFetchAuthAPI).toHaveBeenCalledWith(
        IMAGE_REMOVE_BG_ENDPOINT,
        expect.objectContaining({
          method: 'POST',
          body: mockFormData,
        }),
      );

      // レスポンスが正しく返されることを確認
      expect(result).toEqual(mockResponse);
    });
  });
});
