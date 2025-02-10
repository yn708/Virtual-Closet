/**
 * @jest-environment node
 */
import { baseFetchAuthAPI } from '@/lib/api/baseApi';
import {
  deleteCoordinateAPI,
  fetchCoordinateListAPI,
  fetchCoordinateMetaDataAPI,
  fetchCustomCoordinateInitialDataAPI,
  registerCoordinateAPI,
  registerCustomCoordinateAPI,
  updateCoordinateAPI,
  updateCustomCoordinateAPI,
} from '@/lib/api/coordinateApi';
import {
  COORDINATE_CREATE_CUSTOM_ENDPOINT,
  COORDINATE_CREATE_PHOTO_ENDPOINT,
  COORDINATE_METADATA_ENDPOINT,
} from '@/utils/constants';

// baseFetchAuthAPI のモック
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

      const result = await fetchCoordinateMetaDataAPI();

      expect(baseFetchAuthAPI).toHaveBeenCalledWith(COORDINATE_METADATA_ENDPOINT, {
        cache: 'force-cache',
      });
      expect(result).toEqual(mockMetaData);
    });

    it('APIエラーを適切に処理する', async () => {
      const errorResponse = { message: 'メタデータの取得に失敗しました' };
      (baseFetchAuthAPI as jest.Mock).mockRejectedValueOnce(
        new Error(JSON.stringify(errorResponse)),
      );

      await expect(fetchCoordinateMetaDataAPI()).rejects.toThrow(JSON.stringify(errorResponse));
    });
  });

  /**
   * コーディネート登録APIのテスト
   */
  describe('registerCoordinateAPI', () => {
    it('写真コーディネートの登録リクエストを送信する', async () => {
      const mockFormData = new FormData();
      mockFormData.append('image', new Blob(['dummy image']), 'test.jpg');
      mockFormData.append('seasons', JSON.stringify(['spring', 'summer']));

      const mockResponse = { success: true, id: 1 };
      (baseFetchAuthAPI as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await registerCoordinateAPI('photo', mockFormData);

      expect(baseFetchAuthAPI).toHaveBeenCalledWith(COORDINATE_CREATE_PHOTO_ENDPOINT, {
        method: 'POST',
        body: mockFormData,
      });
      expect(result).toEqual(mockResponse);
    });

    it('カスタムコーディネートの登録リクエストを送信する', async () => {
      const mockFormData = new FormData();
      mockFormData.append('preview_image', new Blob(['dummy image']), 'preview.jpg');
      mockFormData.append('items', JSON.stringify([{ id: 1, type: 'tops' }]));

      const mockResponse = { success: true, id: 1 };
      (baseFetchAuthAPI as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await registerCoordinateAPI('custom', mockFormData);

      expect(baseFetchAuthAPI).toHaveBeenCalledWith(COORDINATE_CREATE_CUSTOM_ENDPOINT, {
        method: 'POST',
        body: mockFormData,
      });
      expect(result).toEqual(mockResponse);
    });

    it('APIエラーを適切に処理する', async () => {
      const mockFormData = new FormData();
      const errorResponse = { message: 'コーディネートの登録に失敗しました' };
      (baseFetchAuthAPI as jest.Mock).mockRejectedValueOnce(
        new Error(JSON.stringify(errorResponse)),
      );

      await expect(registerCoordinateAPI('photo', mockFormData)).rejects.toThrow(
        JSON.stringify(errorResponse),
      );
    });
  });

  /**
   * カスタムコーディネート登録APIのテスト
   */
  describe('registerCustomCoordinateAPI', () => {
    it('正常なカスタムコーディネート登録リクエストを送信する', async () => {
      const mockData = {
        data: {
          items: [
            {
              item: 'shirt',
              position_data: {
                zIndex: 1,
                scale: 1,
                rotate: 0,
                xPercent: 50,
                yPercent: 50,
              },
            },
          ],
          background: 'white',
        },
        seasons: ['spring', 'summer'],
        scenes: ['casual', 'office'],
        tastes: ['modern'],
      };
      const mockResponse = { success: true, id: 1 };
      (baseFetchAuthAPI as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await registerCustomCoordinateAPI(mockData);

      expect(baseFetchAuthAPI).toHaveBeenCalledWith(COORDINATE_CREATE_CUSTOM_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: mockData.data,
          seasons: mockData.seasons,
          scenes: mockData.scenes,
          tastes: mockData.tastes,
        }),
      });
      expect(result).toEqual(mockResponse);
    });

    it('APIエラーを適切に処理する', async () => {
      const mockData = {
        data: {
          items: [
            {
              item: 'shirt',
              position_data: {
                zIndex: 1,
                scale: 1,
                rotate: 0,
                xPercent: 50,
                yPercent: 50,
              },
            },
          ],
          background: 'white',
        },
        seasons: ['spring', 'summer'],
        scenes: ['casual', 'office'],
        tastes: ['modern'],
      };
      const errorResponse = { message: 'カスタムコーディネートの登録に失敗しました' };
      (baseFetchAuthAPI as jest.Mock).mockRejectedValueOnce(
        new Error(JSON.stringify(errorResponse)),
      );

      await expect(registerCustomCoordinateAPI(mockData)).rejects.toThrow(
        JSON.stringify(errorResponse),
      );
    });
  });

  /**
   * コーディネート更新APIのテスト
   */
  describe('updateCoordinateAPI', () => {
    it('写真コーディネートの更新リクエストを送信する', async () => {
      const mockFormData = new FormData();
      const mockId = '123';
      const mockResponse = { success: true };
      (baseFetchAuthAPI as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await updateCoordinateAPI('photo', mockId, mockFormData);

      expect(baseFetchAuthAPI).toHaveBeenCalledWith(
        `${COORDINATE_CREATE_PHOTO_ENDPOINT}${mockId}/`,
        {
          method: 'PUT',
          body: mockFormData,
        },
      );
      expect(result).toEqual(mockResponse);
    });
  });

  /**
   * カスタムコーディネート更新APIのテスト
   */
  describe('updateCustomCoordinateAPI', () => {
    it('正常なカスタムコーディネート更新リクエストを送信する', async () => {
      const mockId = '456';
      const mockData = {
        data: {
          items: [
            {
              item: 'pants',
              position_data: {
                zIndex: 2,
                scale: 1.1,
                rotate: 10,
                xPercent: 30,
                yPercent: 60,
              },
            },
          ],
          background: 'black',
        },
        seasons: ['winter'],
        scenes: ['formal'],
        tastes: ['classic'],
      };
      const mockResponse = { success: true };
      (baseFetchAuthAPI as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await updateCustomCoordinateAPI(mockId, mockData);

      expect(baseFetchAuthAPI).toHaveBeenCalledWith(
        `${COORDINATE_CREATE_CUSTOM_ENDPOINT}${mockId}/`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            data: mockData.data,
            seasons: mockData.seasons,
            scenes: mockData.scenes,
            tastes: mockData.tastes,
          }),
        },
      );
      expect(result).toEqual(mockResponse);
    });

    it('APIエラーを適切に処理する', async () => {
      const mockId = '456';
      const mockData = {
        data: {
          items: [
            {
              item: 'pants',
              position_data: {
                zIndex: 2,
                scale: 1.1,
                rotate: 10,
                xPercent: 30,
                yPercent: 60,
              },
            },
          ],
          background: 'black',
        },
        seasons: ['winter'],
        scenes: ['formal'],
        tastes: ['classic'],
      };
      const errorResponse = { message: 'カスタムコーディネートの更新に失敗しました' };
      (baseFetchAuthAPI as jest.Mock).mockRejectedValueOnce(
        new Error(JSON.stringify(errorResponse)),
      );

      await expect(updateCustomCoordinateAPI(mockId, mockData)).rejects.toThrow(
        JSON.stringify(errorResponse),
      );
    });
  });

  /**
   * コーディネート削除APIのテスト
   */
  describe('deleteCoordinateAPI', () => {
    it('コーディネートの削除リクエストを送信する', async () => {
      const mockId = '123';
      const mockResponse = { success: true };
      (baseFetchAuthAPI as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await deleteCoordinateAPI('photo', mockId);

      expect(baseFetchAuthAPI).toHaveBeenCalledWith(
        `${COORDINATE_CREATE_PHOTO_ENDPOINT}${mockId}/`,
        {
          method: 'DELETE',
        },
      );
      expect(result).toEqual(mockResponse);
    });
  });

  /**
   * コーディネート一覧取得APIのテスト
   */
  describe('fetchCoordinateListAPI', () => {
    it('コーディネート一覧を取得する', async () => {
      const mockResponse = [
        { id: 1, type: 'photo', image_url: 'test.jpg' },
        { id: 2, type: 'custom', image_url: 'test2.jpg' },
      ];
      (baseFetchAuthAPI as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await fetchCoordinateListAPI('photo');

      expect(baseFetchAuthAPI).toHaveBeenCalledWith(`${COORDINATE_CREATE_PHOTO_ENDPOINT}?page=1`);
      expect(result).toEqual(mockResponse);
    });
  });

  /**
   * カスタムコーディネート初期データ取得APIのテスト
   */
  describe('fetchCustomCoordinateInitialDataAPI', () => {
    it('初期データを取得する', async () => {
      const mockId = '123';
      const mockResponse = { items: [{ id: 1, type: 'tops', position: { x: 0, y: 0 } }] };
      (baseFetchAuthAPI as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await fetchCustomCoordinateInitialDataAPI(mockId);

      expect(baseFetchAuthAPI).toHaveBeenCalledWith(
        `${COORDINATE_CREATE_CUSTOM_ENDPOINT}${mockId}/`,
      );
      expect(result).toEqual(mockResponse);
    });
  });
});
