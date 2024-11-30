/**
 * @jest-environment node
 */
import { sendPasswordResetAPI } from '@/lib/api/authApi';
import type { FormStateWithEmail } from '@/types';
import { passwordResetRequestAction } from '../../auth/passwordResetRequestAction';

// API関数のモック
jest.mock('@/lib/api/authApi', () => ({
  sendPasswordResetAPI: jest.fn(),
}));

describe('passwordResetRequestAction', () => {
  // テスト前の準備
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // FormDataのモック作成ヘルパー関数
  const createMockFormData = (email: string) => {
    const formData = new FormData();
    formData.append('email', email);
    return formData;
  };

  it('有効なメールアドレスでパスワードリセットリクエストを送信できる', async () => {
    // 有効なフォームデータの準備
    const mockFormData = createMockFormData('test@example.com');

    // APIレスポンスのモック
    (sendPasswordResetAPI as jest.Mock).mockResolvedValueOnce({
      success: true,
    });

    // Server Actionの実行
    const result = await passwordResetRequestAction({} as FormStateWithEmail, mockFormData);

    // 期待される結果の検証
    expect(result).toEqual({
      message: 'メールアドレス宛にパスワード再設定用のURLを送信しました。',
      errors: null,
      success: true,
    });

    // APIが正しく呼び出されたことを確認
    expect(sendPasswordResetAPI).toHaveBeenCalledWith({
      email: 'test@example.com',
    });
  });

  it('無効なメールアドレスでバリデーションエラーを返す', async () => {
    // 無効なメールアドレスのフォームデータ
    const mockFormData = createMockFormData('invalid-email');

    // Server Actionの実行
    const result = await passwordResetRequestAction({} as FormStateWithEmail, mockFormData);

    // バリデーションエラーの検証
    expect(result).toEqual({
      message: 'バリデーションエラー',
      errors: expect.objectContaining({
        email: expect.any(Array),
      }),
      success: false,
    });

    // APIが呼び出されていないことを確認
    expect(sendPasswordResetAPI).not.toHaveBeenCalled();
  });

  it('APIエラーを適切に処理する', async () => {
    // 有効なフォームデータの準備
    const mockFormData = createMockFormData('test@example.com');

    // APIエラーのモック
    const apiError = {
      email: '登録されていないメールアドレスです。',
    };
    (sendPasswordResetAPI as jest.Mock).mockRejectedValueOnce(new Error(JSON.stringify(apiError)));

    // Server Actionの実行
    const result = await passwordResetRequestAction({} as FormStateWithEmail, mockFormData);

    // エラー処理の検証
    expect(result).toEqual({
      errors: {
        email: [apiError.email],
      },
      message: null,
      success: false,
    });
  });

  it('予期せぬエラーを適切に処理する', async () => {
    // 有効なフォームデータの準備
    const mockFormData = createMockFormData('test@example.com');

    // 予期せぬエラーのモック
    (sendPasswordResetAPI as jest.Mock).mockRejectedValueOnce('unexpected error');

    // Server Actionの実行
    const result = await passwordResetRequestAction({} as FormStateWithEmail, mockFormData);

    // 予期せぬエラーの処理を検証
    expect(result).toEqual({
      errors: {
        _form: ['予期せぬエラーが発生しました。'],
      },
      message: 'エラーが発生しました。',
      success: false,
    });
  });

  it('空のメールアドレスでバリデーションエラーを返す', async () => {
    // 空のメールアドレスのフォームデータ
    const mockFormData = createMockFormData('');

    // Server Actionの実行
    const result = await passwordResetRequestAction({} as FormStateWithEmail, mockFormData);

    // バリデーションエラーの検証
    expect(result).toEqual({
      message: 'バリデーションエラー',
      errors: expect.objectContaining({
        email: expect.any(Array),
      }),
      success: false,
    });

    // APIが呼び出されていないことを確認
    expect(sendPasswordResetAPI).not.toHaveBeenCalled();
  });
});
