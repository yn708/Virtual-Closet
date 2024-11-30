/**
 * @jest-environment node
 */
import { confirmRegistrationAPI } from '@/lib/api/authApi';
import type { FormStateWithToken } from '@/types';
import { sendCodeAction } from '../../auth/sendCodeAction';

// API関数のモック
jest.mock('@/lib/api/authApi', () => ({
  confirmRegistrationAPI: jest.fn(),
}));

describe('sendCodeAction', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // FormDataのモック作成用ヘルパー関数
  const createMockFormData = (data: { [key: string]: string }) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });
    return formData;
  };

  it('有効なコードで正常に認証できる', async () => {
    // 有効なフォームデータの準備
    const mockFormData = createMockFormData({
      email: 'test@example.com',
      code: '123456',
    });

    // APIレスポンスのモック
    const mockApiResponse = {
      key: 'mock-auth-token-123',
    };
    (confirmRegistrationAPI as jest.Mock).mockResolvedValueOnce(mockApiResponse);

    // アクションの実行
    const result = await sendCodeAction({} as FormStateWithToken, mockFormData);

    // 結果の検証
    expect(result).toEqual({
      message: null,
      errors: null,
      success: true,
      token: mockApiResponse.key,
    });

    // APIが正しく呼び出されたことを確認
    expect(confirmRegistrationAPI).toHaveBeenCalledWith('test@example.com', '123456');
  });

  it('メールアドレスが未指定の場合はエラーを返す', async () => {
    // メールアドレスなしのフォームデータ
    const mockFormData = createMockFormData({
      code: '123456',
    });

    const result = await sendCodeAction({} as FormStateWithToken, mockFormData);

    // エラー応答の検証
    expect(result).toEqual({
      message: 'バリデーションエラー',
      errors: { email: ['メールアドレスは必須です'] },
      success: false,
    });

    // APIは呼び出されないことを確認
    expect(confirmRegistrationAPI).not.toHaveBeenCalled();
  });

  it('認証コードが無効な場合はバリデーションエラーを返す', async () => {
    // 無効なコードのフォームデータ
    const mockFormData = createMockFormData({
      email: 'test@example.com',
      code: '12345', // 6桁未満
    });

    const result = await sendCodeAction({} as FormStateWithToken, mockFormData);

    // バリデーションエラーの検証
    expect(result.success).toBe(false);
    expect(result.message).toBe('バリデーションエラー');
    expect(result.errors).toBeDefined();
    expect(confirmRegistrationAPI).not.toHaveBeenCalled();
  });

  it('APIエラーを適切に処理する', async () => {
    // 有効なフォームデータ
    const mockFormData = createMockFormData({
      email: 'test@example.com',
      code: '123456',
    });

    // APIエラーのモック
    const apiError = {
      detail: '無効な認証コードです',
    };
    (confirmRegistrationAPI as jest.Mock).mockRejectedValueOnce(
      new Error(JSON.stringify(apiError)),
    );

    const result = await sendCodeAction({} as FormStateWithToken, mockFormData);

    // エラー処理の検証
    expect(result).toEqual({
      errors: {
        code: [apiError.detail],
      },
      message: null,
      success: false,
    });
  });

  it('予期せぬエラーを適切に処理する', async () => {
    // 有効なフォームデータ
    const mockFormData = createMockFormData({
      email: 'test@example.com',
      code: '123456',
    });

    // 予期せぬエラーのモック
    (confirmRegistrationAPI as jest.Mock).mockRejectedValueOnce('unexpected error');

    const result = await sendCodeAction({} as FormStateWithToken, mockFormData);

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
