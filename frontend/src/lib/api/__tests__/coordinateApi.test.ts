/**
 * @jest-environment node
 */
import { baseFetchAuthAPI } from '@/lib/api/baseApi';
import {
  fetchCoordinateMetaDataAPI,
  registerCustomCoordinateAPI,
  registerPhotoCoordinateAPI,
} from '@/lib/api/coordinateApi';
import {
  COORDINATE_CREATE_CUSTOM_ENDPOINT,
  COORDINATE_CREATE_PHOTO_ENDPOINT,
  COORDINATE_METADATA_ENDPOINT,
} from '@/utils/constants';

// baseFetchAuthAPIのモック
jest.mock('@/lib/api/baseApi', () => ({
  baseFetchAuthAPI: jest.fn(),
}));

/**
 * コーディネートAPI関連のテストスイート
 */
describe('Coordinate APIs', () => {
  // 各テスト前にモックをリセット
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * メタデータ取得APIのテスト
   */
  describe('fetchCoordinateMetaDataAPI', () => {
    it('正常なメタデータ取得リクエストを送信する', async () => {
      // モックの戻り値を設定
      const mockMetaData = {
        seasons: [
          { id: 1, name: '春' },
          { id: 2, name: '夏' },
        ],
        scenes: [
          { id: 1, name: 'デイリー' },
          { id: 2, name: 'オフィス' },
        ],
        tastes: [
          { id: 1, name: 'カジュアル' },
          { id: 2, name: 'フォーマル' },
        ],
      };
      (baseFetchAuthAPI as jest.Mock).mockResolvedValueOnce(mockMetaData);

      // API呼び出し
      const result = await fetchCoordinateMetaDataAPI();

      // 正しいエンドポイントとオプションでAPIが呼ばれたか確認
      expect(baseFetchAuthAPI).toHaveBeenCalledWith(COORDINATE_METADATA_ENDPOINT, {
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
      await expect(fetchCoordinateMetaDataAPI()).rejects.toThrow(JSON.stringify(errorResponse));
    });
  });

  /**
   * 写真コーディネート登録APIのテスト
   */
  describe('registerPhotoCoordinateAPI', () => {
    it('正常な写真コーディネート登録リクエストを送信する', async () => {
      // FormDataの作成とモックレスポンスの設定
      const mockFormData = new FormData();
      mockFormData.append('image', new Blob(['dummy image']), 'test.jpg');
      mockFormData.append('seasons', JSON.stringify(['spring', 'summer']));
      mockFormData.append('tastes', JSON.stringify(['casual']));

      const mockResponse = { success: true, id: 1 };
      (baseFetchAuthAPI as jest.Mock).mockResolvedValueOnce(mockResponse);

      // API呼び出し
      const result = await registerPhotoCoordinateAPI(mockFormData);

      // 正しいエンドポイントとオプションでAPIが呼ばれたか確認
      expect(baseFetchAuthAPI).toHaveBeenCalledWith(COORDINATE_CREATE_PHOTO_ENDPOINT, {
        method: 'POST',
        body: mockFormData,
      });
      expect(result).toEqual(mockResponse);
    });

    it('APIエラーを適切に処理する', async () => {
      const mockFormData = new FormData();
      const errorResponse = { message: '写真コーディネートの登録に失敗しました' };
      (baseFetchAuthAPI as jest.Mock).mockRejectedValueOnce(
        new Error(JSON.stringify(errorResponse)),
      );

      await expect(registerPhotoCoordinateAPI(mockFormData)).rejects.toThrow(
        JSON.stringify(errorResponse),
      );
    });
  });

  /**
   * カスタムコーディネート登録APIのテスト
   */
  describe('registerCustomCoordinateAPI', () => {
    it('正常なカスタムコーディネート登録リクエストを送信する', async () => {
      // FormDataの作成とモックレスポンスの設定
      const mockFormData = new FormData();
      mockFormData.append('preview_image', new Blob(['dummy image']), 'preview.jpg');
      mockFormData.append('items', JSON.stringify([{ id: 1, type: 'tops' }]));
      mockFormData.append('seasons', JSON.stringify(['spring', 'summer']));

      const mockResponse = { success: true, id: 1 };
      (baseFetchAuthAPI as jest.Mock).mockResolvedValueOnce(mockResponse);

      // API呼び出し
      const result = await registerCustomCoordinateAPI(mockFormData);

      // 正しいエンドポイントとオプションでAPIが呼ばれたか確認
      expect(baseFetchAuthAPI).toHaveBeenCalledWith(COORDINATE_CREATE_CUSTOM_ENDPOINT, {
        method: 'POST',
        body: mockFormData,
      });
      expect(result).toEqual(mockResponse);
    });

    it('APIエラーを適切に処理する', async () => {
      const mockFormData = new FormData();
      const errorResponse = { message: 'カスタムコーディネートの登録に失敗しました' };
      (baseFetchAuthAPI as jest.Mock).mockRejectedValueOnce(
        new Error(JSON.stringify(errorResponse)),
      );

      await expect(registerCustomCoordinateAPI(mockFormData)).rejects.toThrow(
        JSON.stringify(errorResponse),
      );
    });
  });
});
