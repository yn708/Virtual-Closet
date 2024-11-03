import { confirmRegistrationAPI } from '@/lib/api/authApi';
import { TOP_URL } from '@/utils/constants';
import { act, renderHook } from '@testing-library/react';
import { signIn } from 'next-auth/react';
import useAuthCodeForm from '../useAuthCodeForm';

// モックの設定
jest.mock('next-auth/react', () => ({
  signIn: jest.fn(),
}));

jest.mock('@/lib/api/authApi', () => ({
  confirmRegistrationAPI: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    };
  },
}));

// useToastのモックをグローバル変数として定義
const mockToast = jest.fn();
jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: mockToast,
  }),
}));

describe('useAuthCodeForm', () => {
  const mockEmail = 'test@example.com';
  const mockCode = '123456';
  const mockToken = 'mock-token';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('フォームの初期値が正しく設定されていること', () => {
    const { result } = renderHook(() => useAuthCodeForm(mockEmail));

    expect(result.current.form.getValues()).toEqual({
      code: '',
    });
  });

  it('正常系: 認証コードの確認が成功すること', async () => {
    // APIレスポンスのモック
    (confirmRegistrationAPI as jest.Mock).mockResolvedValueOnce({
      key: mockToken,
    });

    (signIn as jest.Mock).mockResolvedValueOnce({
      ok: true,
      error: null,
    });

    const { result } = renderHook(() => useAuthCodeForm(mockEmail));

    // フォームの値を設定
    await act(async () => {
      result.current.form.setValue('code', mockCode);
      await result.current.form.trigger();
    });

    // フォーム送信
    await act(async () => {
      await result.current.onSubmit({
        code: mockCode,
      });
    });

    // APIが正しく呼び出されたことを確認
    expect(confirmRegistrationAPI).toHaveBeenCalledWith(mockEmail, mockCode);

    // signInが正しく呼び出されたことを確認
    expect(signIn).toHaveBeenCalledWith('credentials', {
      email: mockEmail,
      token: mockToken,
      callbackUrl: TOP_URL,
    });

    // トーストが呼び出されていないことを確認
    expect(mockToast).not.toHaveBeenCalled();
  });

  it('異常系: APIがエラーを返した場合、トーストでエラーが表示されること', async () => {
    const errorDetail = '無効な認証コードです。';
    (confirmRegistrationAPI as jest.Mock).mockRejectedValueOnce(
      new Error(JSON.stringify({ detail: errorDetail })),
    );

    const { result } = renderHook(() => useAuthCodeForm(mockEmail));

    // フォームの値を設定
    await act(async () => {
      result.current.form.setValue('code', mockCode);
      await result.current.form.trigger();
    });

    // フォーム送信
    await act(async () => {
      try {
        await result.current.onSubmit({
          code: mockCode,
        });
      } catch {
        // エラーは意図的に無視
      }
    });

    // APIが正しく呼び出されたことを確認
    expect(confirmRegistrationAPI).toHaveBeenCalledWith(mockEmail, mockCode);

    // トーストが正しく呼び出されたことを確認
    expect(mockToast).toHaveBeenCalledWith({
      title: 'エラー',
      description: errorDetail,
      variant: 'destructive',
    });

    // signInが呼び出されていないことを確認
    expect(signIn).not.toHaveBeenCalled();
  });

  it('異常系: 予期せぬエラーの場合、デフォルトのエラーメッセージが表示されること', async () => {
    // 通常のエラーオブジェクトを使用
    const error = new Error('Unexpected error');
    (confirmRegistrationAPI as jest.Mock).mockRejectedValueOnce(error);

    const { result } = renderHook(() => useAuthCodeForm(mockEmail));

    // フォームの値を設定
    await act(async () => {
      result.current.form.setValue('code', mockCode);
      await result.current.form.trigger();
    });

    // フォーム送信
    await act(async () => {
      try {
        await result.current.onSubmit({
          code: mockCode,
        });
      } catch {
        // エラーは意図的に無視
      }
    });

    // APIが正しく呼び出されたことを確認
    expect(confirmRegistrationAPI).toHaveBeenCalledWith(mockEmail, mockCode);

    // デフォルトのエラーメッセージでトーストが呼び出されたことを確認
    expect(mockToast).toHaveBeenCalledWith({
      title: 'エラー',
      description: '確認に失敗しました',
      variant: 'destructive',
    });

    // signInが呼び出されていないことを確認
    expect(signIn).not.toHaveBeenCalled();
  });
});
