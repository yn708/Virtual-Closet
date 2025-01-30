/**
 * @jest-environment node
 */
import { signUpAPI } from '@/lib/api/authApi';
import type { FormStateWithEmail } from '@/types';
import { ERROR_DESCRIPTION_MESSAGE, ERROR_MESSAGE } from '@/utils/constants';
import { signUpAction } from '../../auth/signUpAction';

// API関数のモック
jest.mock('@/lib/api/authApi', () => ({
  signUpAPI: jest.fn(),
}));

describe('signUpAction', () => {
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

  it('有効なデータで正常に登録できる', async () => {
    // 有効なフォームデータの準備
    const mockFormData = createMockFormData({
      email: 'test@example.com',
      password: 'ValidPass123',
      passwordConfirmation: 'ValidPass123',
    });

    // APIレスポンスのモック
    (signUpAPI as jest.Mock).mockResolvedValueOnce({
      success: true,
    });

    // Server Actionの実行
    const result = await signUpAction({} as FormStateWithEmail, mockFormData);

    // 期待される結果の検証
    expect(result).toEqual({
      message: '確認コードを送信しました',
      errors: null,
      success: true,
      email: 'test@example.com',
    });

    // APIが正しく呼び出されたことを確認
    expect(signUpAPI).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'ValidPass123',
      passwordConfirmation: 'ValidPass123',
    });
  });

  it('バリデーションエラーを適切に処理する', async () => {
    // 無効なフォームデータの準備
    const mockFormData = createMockFormData({
      email: 'invalid-email',
      password: 'short',
      passwordConfirmation: 'different',
    });

    const result = await signUpAction({} as FormStateWithEmail, mockFormData);

    // バリデーションエラーの検証
    expect(result.success).toBe(false);
    expect(result.message).toBe('バリデーションエラー');
    expect(result.errors).toBeDefined();
    // APIは呼び出されないことを確認
    expect(signUpAPI).not.toHaveBeenCalled();
  });

  it('APIエラーを適切に処理する', async () => {
    // 有効なフォームデータの準備
    const mockFormData = createMockFormData({
      email: 'test@example.com',
      password: 'ValidPass123',
      passwordConfirmation: 'ValidPass123',
    });

    // APIエラーのモック
    const apiError = {
      detail: 'このメールアドレスは既に登録されています',
    };
    (signUpAPI as jest.Mock).mockRejectedValueOnce(new Error(JSON.stringify(apiError)));

    const result = await signUpAction({} as FormStateWithEmail, mockFormData);

    // エラー処理の検証
    expect(result.success).toBe(false);
    expect(result.errors).toEqual({
      email: [apiError.detail],
    });
  });

  it('予期せぬエラーを適切に処理する', async () => {
    // 有効なフォームデータの準備
    const mockFormData = createMockFormData({
      email: 'test@example.com',
      password: 'ValidPass123',
      passwordConfirmation: 'ValidPass123',
    });

    // 予期せぬエラーのモック
    (signUpAPI as jest.Mock).mockRejectedValueOnce('unexpected error');

    const result = await signUpAction({} as FormStateWithEmail, mockFormData);

    // 予期せぬエラーの処理を検証
    expect(result).toEqual({
      errors: {
        _form: [ERROR_MESSAGE],
      },
      message: ERROR_DESCRIPTION_MESSAGE,
      success: false,
    });
  });

  it('パスワードと確認用パスワードが一致しない場合のエラーを処理する', async () => {
    // パスワードが一致しないフォームデータの準備
    const mockFormData = createMockFormData({
      email: 'test@example.com',
      password: 'ValidPass123',
      passwordConfirmation: 'DifferentPass123',
    });

    const result = await signUpAction({} as FormStateWithEmail, mockFormData);

    // バリデーションエラーの検証
    expect(result.success).toBe(false);
    expect(result.message).toBe('バリデーションエラー');
    expect(result.errors?.passwordConfirmation).toBeDefined();
  });
});
