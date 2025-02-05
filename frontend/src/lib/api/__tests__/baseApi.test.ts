/**
 * @jest-environment node
 */
import { baseFetchAPI, baseFetchAuthAPI } from '@/lib/api/baseApi';
import { BASE_URL, LOGIN_URL } from '@/utils/constants';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

// Mocks
jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}));

global.fetch = jest.fn();

describe('API Utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('baseFetchAPI', () => {
    it('正常なレスポンスを正しく処理する', async () => {
      const mockResponse = { data: 'test' };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await baseFetchAPI('/test');

      expect(global.fetch).toHaveBeenCalledWith(`${BASE_URL}/test`, expect.any(Object));
      expect(result).toEqual(mockResponse);
    });

    it('204 No Contentレスポンスを空オブジェクトとして処理する', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 204,
        json: () => Promise.resolve({}),
      });

      const result = await baseFetchAPI('/test');

      expect(result).toEqual({});
    });

    it('エラーレスポンスを適切に処理する', async () => {
      const errorResponse = { message: 'API Error' };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve(errorResponse),
      });

      await expect(baseFetchAPI('/test')).rejects.toThrow(JSON.stringify(errorResponse));
    });

    it('カスタムヘッダーを正しく処理する', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({}),
      });

      const customHeaders = {
        'Content-Type': 'application/json',
        'X-Custom-Header': 'test',
      };

      await baseFetchAPI('/test', { headers: customHeaders });

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining(customHeaders),
        }),
      );
    });
  });

  describe('baseFetchAuthAPI', () => {
    const mockSession = {
      backendTokens: {
        access: 'test-token',
        refresh: 'refresh-token',
      },
    };

    it('認証済みユーザーのリクエストを正しく処理する', async () => {
      (getServerSession as jest.Mock).mockResolvedValueOnce(mockSession);
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: 'authenticated' }),
      });

      await baseFetchAuthAPI('/test');

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: `Bearer ${mockSession.backendTokens.access}`,
          }),
        }),
      );
    });

    it('未認証ユーザーの場合ログインページにリダイレクトする', async () => {
      (getServerSession as jest.Mock).mockResolvedValueOnce(null);

      try {
        await baseFetchAuthAPI('/test');
      } catch {
        // リダイレクトが呼ばれることを確認
        expect(redirect).toHaveBeenCalledWith(LOGIN_URL + '?error=unauthorized');
      }
      expect(global.fetch).not.toHaveBeenCalled();
    });
  });
});
