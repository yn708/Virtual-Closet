/**
 * @jest-environment node
 */
import { passwordResetAPI } from '@/lib/api/authApi';
import { redirect } from 'next/navigation';

import type { FormState } from '@/types';
import { LOGIN_URL } from '@/utils/constants';
import { passwordResetConfirmAction } from '../../auth/passwordResetConfirmAction';

// モジュールのモック化
jest.mock('@/lib/api/authApi', () => ({
  passwordResetAPI: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}));

describe('passwordResetConfirmAction', () => {
  let mockRedirect: jest.Mock;

  // テストの前準備
  beforeEach(() => {
    jest.clearAllMocks();
    mockRedirect = jest.mocked(redirect);
  });

  // FormDataのモック作成ヘルパー関数
  const createMockFormData = (data: { [key: string]: string }) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });
    return formData;
  };

  it('有効なデータでパスワードを正常にリセットする', async () => {
    // テストデータの準備
    const mockFormData = createMockFormData({
      password: 'ValidPass123',
      passwordConfirmation: 'ValidPass123',
    });
    const mockUid = 'test-uid';
    const mockToken = 'test-token';

    // APIレスポンスのモック
    (passwordResetAPI as jest.Mock).mockResolvedValueOnce({
      success: true,
    });

    // アクションの実行
    await passwordResetConfirmAction({} as FormState, mockFormData, mockUid, mockToken);

    // APIが正しいパラメータで呼び出されたことを確認
    expect(passwordResetAPI).toHaveBeenCalledWith(mockUid, mockToken, {
      password: 'ValidPass123',
      passwordConfirmation: 'ValidPass123',
    });

    // リダイレクトが正しく呼び出されたことを確認
    expect(mockRedirect).toHaveBeenCalledWith(LOGIN_URL);
  });

  it('バリデーションエラーを適切に処理する', async () => {
    // 無効なデータの準備
    const mockFormData = createMockFormData({
      password: 'short',
      passwordConfirmation: 'different',
    });
    const mockUid = 'test-uid';
    const mockToken = 'test-token';

    const result = await passwordResetConfirmAction(
      {} as FormState,
      mockFormData,
      mockUid,
      mockToken,
    );

    // バリデーションエラーの検証
    expect(result).toEqual({
      message: 'バリデーションエラー',
      errors: expect.any(Object),
      success: false,
    });

    // APIとリダイレクトが呼び出されていないことを確認
    expect(passwordResetAPI).not.toHaveBeenCalled();
    expect(mockRedirect).not.toHaveBeenCalled();
  });

  it('APIエラーを適切に処理する', async () => {
    // 有効なデータの準備
    const mockFormData = createMockFormData({
      password: 'ValidPass123',
      passwordConfirmation: 'ValidPass123',
    });
    const mockUid = 'test-uid';
    const mockToken = 'test-token';

    // APIエラーのモック
    const apiError = {
      email: 'リンクの有効期限が切れています',
    };
    (passwordResetAPI as jest.Mock).mockRejectedValueOnce(new Error(JSON.stringify(apiError)));

    const result = await passwordResetConfirmAction(
      {} as FormState,
      mockFormData,
      mockUid,
      mockToken,
    );

    // エラー応答の検証
    expect(result).toEqual({
      errors: {
        email: [apiError.email],
      },
      message: null,
      success: false,
    });

    // リダイレクトが呼び出されていないことを確認
    expect(mockRedirect).not.toHaveBeenCalled();
  });

  it('予期せぬエラーを適切に処理する', async () => {
    // 有効なデータの準備
    const mockFormData = createMockFormData({
      password: 'ValidPass123',
      passwordConfirmation: 'ValidPass123',
    });
    const mockUid = 'test-uid';
    const mockToken = 'test-token';

    // 予期せぬエラーのモック
    (passwordResetAPI as jest.Mock).mockRejectedValueOnce('unexpected error');

    const result = await passwordResetConfirmAction(
      {} as FormState,
      mockFormData,
      mockUid,
      mockToken,
    );

    // 予期せぬエラーの応答を検証
    expect(result).toEqual({
      errors: {
        _form: ['予期せぬエラーが発生しました。'],
      },
      message: 'エラーが発生しました。',
      success: false,
    });

    // リダイレクトが呼び出されていないことを確認
    expect(mockRedirect).not.toHaveBeenCalled();
  });

  it('パスワードと確認用パスワードが一致しない場合のエラーを処理する', async () => {
    // 不一致のパスワードデータを準備
    const mockFormData = createMockFormData({
      password: 'ValidPass123',
      passwordConfirmation: 'DifferentPass123',
    });
    const mockUid = 'test-uid';
    const mockToken = 'test-token';

    const result = await passwordResetConfirmAction(
      {} as FormState,
      mockFormData,
      mockUid,
      mockToken,
    );

    // バリデーションエラーの検証
    expect(result).toEqual({
      message: 'バリデーションエラー',
      errors: expect.any(Object),
      success: false,
    });

    // APIとリダイレクトが呼び出されていないことを確認
    expect(passwordResetAPI).not.toHaveBeenCalled();
    expect(mockRedirect).not.toHaveBeenCalled();
  });
});
