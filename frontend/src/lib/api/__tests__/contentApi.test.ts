import type { ContactSubmitData } from '@/features/contact/types';
import { ANONYMOUS_CONTACT_ENDPOINT, AUTHENTICATED_CONTACT_ENDPOINT } from '@/utils/constants';
import { baseFetchAPI, baseFetchAuthAPI } from '../baseApi';
import { submitContactAPI } from '../contentApi';

// モックの設定
jest.mock('../baseApi', () => ({
  baseFetchAPI: jest.fn(),
  baseFetchAuthAPI: jest.fn(),
}));

describe('submitContactAPI', () => {
  // テスト用のダミーデータ
  const mockAnonymousData: ContactSubmitData = {
    name: 'テスト太郎',
    email: 'test@example.com',
    subject: 'テストの件名',
    message: 'テストメッセージです。',
  };

  const mockAuthenticatedData: ContactSubmitData = {
    subject: 'テストの件名',
    message: 'テストメッセージです。',
  };

  // 各テスト前にモックをリセット
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('非認証ユーザーの場合', () => {
    it('正しいエンドポイントとデータで baseFetchAPI が呼ばれること', async () => {
      // モックの戻り値を設定
      const mockResponse = { success: true };
      (baseFetchAPI as jest.Mock).mockResolvedValue(mockResponse);

      // API呼び出し
      const response = await submitContactAPI(mockAnonymousData, false);

      // baseFetchAPI の呼び出しを検証
      expect(baseFetchAPI).toHaveBeenCalledWith(ANONYMOUS_CONTACT_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: mockAnonymousData.name,
          email: mockAnonymousData.email,
          subject: mockAnonymousData.subject,
          message: mockAnonymousData.message,
        }),
      });

      // レスポンスを検証
      expect(response).toEqual(mockResponse);
    });

    it('APIエラー時に例外が伝播すること', async () => {
      // エラーをモック
      const mockError = new Error('API error');
      (baseFetchAPI as jest.Mock).mockRejectedValue(mockError);

      // エラーがスローされることを確認
      await expect(submitContactAPI(mockAnonymousData, false)).rejects.toThrow('API error');
    });
  });

  describe('認証済みユーザーの場合', () => {
    it('正しいエンドポイントとデータで baseFetchAuthAPI が呼ばれること', async () => {
      // モックの戻り値を設定
      const mockResponse = { success: true };
      (baseFetchAuthAPI as jest.Mock).mockResolvedValue(mockResponse);

      // API呼び出し
      const response = await submitContactAPI(mockAuthenticatedData, true);

      // baseFetchAuthAPI の呼び出しを検証
      expect(baseFetchAuthAPI).toHaveBeenCalledWith(AUTHENTICATED_CONTACT_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject: mockAuthenticatedData.subject,
          message: mockAuthenticatedData.message,
        }),
      });

      // レスポンスを検証
      expect(response).toEqual(mockResponse);
    });

    it('APIエラー時に例外が伝播すること', async () => {
      // エラーをモック
      const mockError = new Error('API error');
      (baseFetchAuthAPI as jest.Mock).mockRejectedValue(mockError);

      // エラーがスローされることを確認
      await expect(submitContactAPI(mockAuthenticatedData, true)).rejects.toThrow('API error');
    });
  });
});
