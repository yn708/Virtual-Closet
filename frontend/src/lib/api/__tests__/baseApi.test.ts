/**
 * @jest-environment node
 */
import { baseFetchAPI, baseFetchAuthAPI } from '@/lib/api/baseApi';
import { BASE_URL } from '@/utils/constants';
import { getServerSession } from 'next-auth';

// next-authのモック
jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}));

// グローバルfetchのモック
global.fetch = jest.fn();

/**
 * API基本関数のテスト
 */
describe('API Utilities', () => {
  // テスト前の共通設定
  beforeEach(() => {
    // モックをリセット
    jest.clearAllMocks();
  });

  /**
   * baseFetchAPI のテスト
   * テスト項目:
   * - 正常系リクエスト
   * - エラーハンドリング
   * - ヘッダーの処理
   */
  describe('baseFetchAPI', () => {
    it('正常なレスポンスを正しく処理する', async () => {
      // モックレスポンスの設定
      const mockResponse = { data: 'test' };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      // テスト実行
      const endpoint = '/test';
      const result = await baseFetchAPI(endpoint);

      // アサーション
      expect(global.fetch).toHaveBeenCalledWith(`${BASE_URL}${endpoint}`, expect.any(Object));
      expect(result).toEqual(mockResponse);
    });

    it('エラーレスポンスを適切に処理する', async () => {
      // エラーレスポンスのモック
      const errorResponse = { message: 'API Error' };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve(errorResponse),
      });

      // エラーがスローされることを確認
      await expect(baseFetchAPI('/test')).rejects.toThrow(JSON.stringify(errorResponse));
    });

    it('カスタムヘッダーを正しく処理する', async () => {
      // 成功レスポンスのモック
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({}),
      });

      // カスタムヘッダー付きでリクエスト
      const customHeaders = {
        'Content-Type': 'application/json',
        'X-Custom-Header': 'test',
      };

      await baseFetchAPI('/test', {
        headers: customHeaders,
      });

      // ヘッダーが正しく設定されているか確認
      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining(customHeaders),
        }),
      );
    });
  });

  /**
   * baseFetchAuthAPI のテスト
   * テスト項目:
   * - 認証済みリクエスト
   * - 未認証エラー
   * - 認証トークンの処理
   */
  describe('baseFetchAuthAPI', () => {
    it('認証済みユーザーのリクエストを正しく処理する', async () => {
      // セッションモックの設定
      const mockSession = {
        backendTokens: {
          access: 'test-token',
        },
      };
      (getServerSession as jest.Mock).mockResolvedValueOnce(mockSession);

      // API レスポンスモック
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: 'authenticated' }),
      });

      // テスト実行
      await baseFetchAuthAPI('/test');

      // Authorization ヘッダーが正しく設定されているか確認
      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: `Bearer ${mockSession.backendTokens.access}`,
          }),
        }),
      );
    });

    it('未認証ユーザーのリクエストでエラーをスローする', async () => {
      // 未認証セッションのモック
      (getServerSession as jest.Mock).mockResolvedValueOnce(null);

      // エラーがスローされることを確認
      await expect(baseFetchAuthAPI('/test')).rejects.toThrow('認証されていません');

      // fetch が呼ばれていないことを確認
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('既存のヘッダーを保持しながら認証ヘッダーを追加する', async () => {
      // セッションモックの設定
      const mockSession = {
        backendTokens: {
          access: 'test-token',
        },
      };
      (getServerSession as jest.Mock).mockResolvedValueOnce(mockSession);

      // API レスポンスモック
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({}),
      });

      // カスタムヘッダー付きでリクエスト
      const customHeaders = {
        'Content-Type': 'application/json',
        'X-Custom-Header': 'test',
      };

      await baseFetchAuthAPI('/test', {
        headers: customHeaders,
      });

      // 既存のヘッダーと認証ヘッダーが両方存在することを確認
      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            ...customHeaders,
            Authorization: `Bearer ${mockSession.backendTokens.access}`,
          }),
        }),
      );
    });
  });
});
