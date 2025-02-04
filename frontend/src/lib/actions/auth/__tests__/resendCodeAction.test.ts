/**
 * @jest-environment node
 */
import { resendCodeAPI } from '@/lib/api/authApi';
import type { FormState } from '@/types';
import { resendCodeAction } from '../../auth/resendCodeAction';

// API関数のモック
jest.mock('@/lib/api/authApi', () => ({
  resendCodeAPI: jest.fn(),
}));

describe('resendCodeAction', () => {
  // テスト前の準備
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // FormDataのモック作成ヘルパー関数
  const createMockFormData = (data: { [key: string]: string }) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });
    return formData;
  };

  it('メールアドレスとパスワードが有効な場合、確認コードを再送信する', async () => {
    // テストデータの準備
    const currentEmail = 'test@example.com';
    const mockFormData = createMockFormData({
      email: 'test@example.com',
      password: 'ValidPass123',
    });

    // APIレスポンスのモック
    (resendCodeAPI as jest.Mock).mockResolvedValueOnce({
      success: true,
    });

    // Server Actionの実行
    const result = await resendCodeAction(currentEmail, {} as FormState, mockFormData);

    // 期待される結果の検証
    expect(result).toEqual({
      message: '確認コードを送信しました',
      errors: null,
      success: true,
    });

    // APIが正しく呼び出されたことを確認
    expect(resendCodeAPI).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'ValidPass123',
    });
  });

  it('入力されたメールアドレスが現在のメールアドレスと一致しない場合、エラーを返す', async () => {
    // 異なるメールアドレスでテスト
    const currentEmail = 'test@example.com';
    const mockFormData = createMockFormData({
      email: 'different@example.com',
      password: 'ValidPass123',
    });

    const result = await resendCodeAction(currentEmail, {} as FormState, mockFormData);

    // エラー結果の検証
    expect(result).toEqual({
      message: 'メールアドレスが一致しません',
      errors: {
        email: ['認証を受けたメールアドレスを入力してください。'],
      },
      success: false,
    });

    // APIは呼び出されないことを確認
    expect(resendCodeAPI).not.toHaveBeenCalled();
  });

  it('バリデーションエラーを適切に処理する', async () => {
    // 無効なデータでテスト
    const currentEmail = 'test@example.com';
    const mockFormData = createMockFormData({
      email: 'invalid-email',
      password: 'short',
    });

    const result = await resendCodeAction(currentEmail, {} as FormState, mockFormData);

    // バリデーションエラーの検証
    expect(result.success).toBe(false);
    expect(result.message).toBe('入力内容に誤りがあります。');
    expect(result.errors).toBeDefined();

    // APIは呼び出されないことを確認
    expect(resendCodeAPI).not.toHaveBeenCalled();
  });

  it('APIエラーを適切に処理する', async () => {
    // テストデータの準備
    const currentEmail = 'test@example.com';
    const mockFormData = createMockFormData({
      email: 'test@example.com',
      password: 'ValidPass123',
    });

    // APIエラーのモック
    const apiError = {
      detail: '認証に失敗しました',
    };
    (resendCodeAPI as jest.Mock).mockRejectedValueOnce(new Error(JSON.stringify(apiError)));

    const result = await resendCodeAction(currentEmail, {} as FormState, mockFormData);

    // エラー処理の検証
    expect(result.success).toBe(false);
    expect(result.errors).toEqual({
      email: [apiError.detail],
    });
  });

  it('予期せぬエラーを適切に処理する', async () => {
    // テストデータの準備
    const currentEmail = 'test@example.com';
    const mockFormData = createMockFormData({
      email: 'test@example.com',
      password: 'ValidPass123',
    });

    // 予期せぬエラーのモック
    (resendCodeAPI as jest.Mock).mockRejectedValueOnce('unexpected error');

    const result = await resendCodeAction(currentEmail, {} as FormState, mockFormData);

    // 予期せぬエラーの処理を検証
    expect(result).toEqual({
      errors: {
        _form: ['予期せぬエラーが発生しました。'],
      },
      message: 'エラーが発生しました。',
      success: false,
    });
  });
});
