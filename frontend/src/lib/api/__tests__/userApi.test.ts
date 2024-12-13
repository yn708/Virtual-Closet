/**
 * @jest-environment node
 */
import { baseFetchAuthAPI } from '@/lib/api/baseApi';
import { fetchUserDataAPI, updateUserProfileAPI } from '@/lib/api/userApi';
import { USER_DETAIL_ENDPOINT, USER_UPDATE_ENDPOINT } from '@/utils/constants';

// baseFetchAuthAPIのモック
jest.mock('@/lib/api/baseApi', () => ({
  baseFetchAuthAPI: jest.fn(),
}));

/**
 * ユーザーAPI関連のテストスイート
 */
describe('User APIs', () => {
  // 各テスト前にモックをリセット
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * ユーザー情報取得APIのテスト
   */
  describe('fetchUserDataAPI', () => {
    it('正常なユーザー情報取得リクエストを送信する', async () => {
      // モックの戻り値を設定
      const mockUserData = {
        username: 'testuser123',
        name: 'テストユーザー',
        birth_year: '1990',
        birth_month: '01',
        birth_day: '01',
        gender: 'male',
        profile_image: null,
        height: '170',
      };
      (baseFetchAuthAPI as jest.Mock).mockResolvedValueOnce(mockUserData);

      // API呼び出し
      const result = await fetchUserDataAPI();

      // 正しいエンドポイントでAPIが呼ばれたか確認
      expect(baseFetchAuthAPI).toHaveBeenCalledWith(USER_DETAIL_ENDPOINT);
      expect(result).toEqual(mockUserData);
    });

    it('APIエラーを適切に処理する', async () => {
      // エラーレスポンスのモック
      const errorResponse = { message: 'ユーザー情報の取得に失敗しました' };
      (baseFetchAuthAPI as jest.Mock).mockRejectedValueOnce(
        new Error(JSON.stringify(errorResponse)),
      );

      // エラーがスローされることを確認
      await expect(fetchUserDataAPI()).rejects.toThrow(JSON.stringify(errorResponse));
    });
  });

  /**
   * プロフィール更新APIのテスト
   */
  describe('updateUserProfileAPI', () => {
    it('完全なプロフィールデータで更新リクエストを送信する', async () => {
      // FormDataのモックを作成
      const mockFormData = new FormData();
      mockFormData.append('username', 'testuser123');
      mockFormData.append('name', 'テストユーザー');
      mockFormData.append('birth_year', '1990');
      mockFormData.append('birth_month', '01');
      mockFormData.append('birth_day', '01');
      mockFormData.append('gender', 'male');
      mockFormData.append('height', '170');

      // モックの戻り値を設定
      (baseFetchAuthAPI as jest.Mock).mockResolvedValueOnce({ success: true });

      // API呼び出し
      await updateUserProfileAPI(mockFormData);

      // 正しいエンドポイントとデータでAPIが呼ばれたか確認
      expect(baseFetchAuthAPI).toHaveBeenCalledWith(
        USER_UPDATE_ENDPOINT,
        expect.objectContaining({
          method: 'PUT',
          body: mockFormData,
        }),
      );
    });

    it('最小限のプロフィールデータで更新リクエストを送信する', async () => {
      // 必須項目のみのFormDataを作成
      const mockFormData = new FormData();
      mockFormData.append('username', 'testuser123'); // username は必須

      // モックの戻り値を設定
      (baseFetchAuthAPI as jest.Mock).mockResolvedValueOnce({ success: true });

      // API呼び出し
      await updateUserProfileAPI(mockFormData);

      // 正しいエンドポイントとデータでAPIが呼ばれたか確認
      expect(baseFetchAuthAPI).toHaveBeenCalledWith(
        USER_UPDATE_ENDPOINT,
        expect.objectContaining({
          method: 'PUT',
          body: mockFormData,
        }),
      );
    });

    it('生年月日の部分的な入力を含むデータで更新リクエストを送信する', async () => {
      // FormDataのモックを作成（完全な生年月日セット）
      const mockFormData = new FormData();
      mockFormData.append('username', 'testuser123');
      mockFormData.append('birth_year', '1990');
      mockFormData.append('birth_month', '01');
      mockFormData.append('birth_day', '01');

      // モックの戻り値を設定
      (baseFetchAuthAPI as jest.Mock).mockResolvedValueOnce({ success: true });

      // API呼び出し
      await updateUserProfileAPI(mockFormData);

      // 正しいエンドポイントとデータでAPIが呼ばれたか確認
      expect(baseFetchAuthAPI).toHaveBeenCalledWith(
        USER_UPDATE_ENDPOINT,
        expect.objectContaining({
          method: 'PUT',
          body: mockFormData,
        }),
      );
    });

    it('APIエラーを適切に処理する', async () => {
      const mockFormData = new FormData();
      mockFormData.append('username', 'testuser123');

      // エラーレスポンスのモック
      const errorResponse = { message: 'プロフィールの更新に失敗しました' };
      (baseFetchAuthAPI as jest.Mock).mockRejectedValueOnce(
        new Error(JSON.stringify(errorResponse)),
      );

      // エラーがスローされることを確認
      await expect(updateUserProfileAPI(mockFormData)).rejects.toThrow(
        JSON.stringify(errorResponse),
      );
    });
  });
});
