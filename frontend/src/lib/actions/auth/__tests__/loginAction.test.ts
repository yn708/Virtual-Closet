/**
 * @jest-environment node
 */

import type { LoginFormState } from '@/types';
import { loginAction } from '../../auth/loginAction';

describe('loginAction', () => {
  // FormDataのモック作成ヘルパー関数
  const createMockFormData = (data: { [key: string]: string }) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });
    return formData;
  };

  it('有効なログイン情報で正常に処理される', async () => {
    // 有効なフォームデータの準備
    const validEmail = 'test@example.com';
    const validPassword = 'ValidPass123';
    const mockFormData = createMockFormData({
      email: validEmail,
      password: validPassword,
    });

    const result = await loginAction({} as LoginFormState, mockFormData);

    // 期待される結果の検証
    expect(result).toEqual({
      message: null,
      errors: null,
      success: true,
      email: validEmail,
      password: validPassword,
    });
  });

  it('無効なメールアドレスでバリデーションエラーを返す', async () => {
    // 無効なメールアドレスを含むフォームデータ
    const mockFormData = createMockFormData({
      email: 'invalid-email',
      password: 'ValidPass123',
    });

    const result = await loginAction({} as LoginFormState, mockFormData);

    // バリデーションエラーの検証
    expect(result).toEqual(
      expect.objectContaining({
        message: 'バリデーションエラー',
        success: false,
        errors: expect.objectContaining({
          email: expect.any(Array),
        }),
      }),
    );
  });

  it('無効なパスワードでバリデーションエラーを返す', async () => {
    // 無効なパスワードを含むフォームデータ
    const mockFormData = createMockFormData({
      email: 'test@example.com',
      password: 'short', // 無効なパスワード
    });

    const result = await loginAction({} as LoginFormState, mockFormData);

    // バリデーションエラーの検証
    expect(result).toEqual(
      expect.objectContaining({
        message: 'バリデーションエラー',
        success: false,
        errors: expect.objectContaining({
          password: expect.any(Array),
        }),
      }),
    );
  });

  it('必須フィールドが欠落している場合バリデーションエラーを返す', async () => {
    // 空のフォームデータ
    const mockFormData = createMockFormData({});

    const result = await loginAction({} as LoginFormState, mockFormData);

    // バリデーションエラーの検証
    expect(result).toEqual(
      expect.objectContaining({
        message: 'バリデーションエラー',
        success: false,
        errors: expect.objectContaining({
          email: expect.any(Array),
          password: expect.any(Array),
        }),
      }),
    );
  });

  it('空文字列を含むフィールドでバリデーションエラーを返す', async () => {
    // 空文字列を含むフォームデータ
    const mockFormData = createMockFormData({
      email: '',
      password: '',
    });

    const result = await loginAction({} as LoginFormState, mockFormData);

    // バリデーションエラーの検証
    expect(result).toEqual(
      expect.objectContaining({
        message: 'バリデーションエラー',
        success: false,
        errors: expect.objectContaining({
          email: expect.any(Array),
          password: expect.any(Array),
        }),
      }),
    );
  });
});
