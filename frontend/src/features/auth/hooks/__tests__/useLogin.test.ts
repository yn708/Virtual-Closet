import { act, renderHook } from '@testing-library/react';
import { signIn } from 'next-auth/react';
import { useLogin } from '../useLogin';

// モックの設定
jest.mock('next-auth/react', () => ({
  signIn: jest.fn(),
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

describe('useLogin', () => {
  const mockEmail = 'test@example.com';
  const mockPassword = 'password123';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('フォームの初期値が正しく設定されていること', () => {
    const { result } = renderHook(() => useLogin());

    expect(result.current.form.getValues()).toEqual({
      email: '',
      password: '',
    });
  });

  it('正常系: ログインが成功すること', async () => {
    // signInの成功レスポンスをモック
    (signIn as jest.Mock).mockResolvedValueOnce({
      ok: true,
      error: null,
    });

    const { result } = renderHook(() => useLogin());

    // フォームの値を設定
    await act(async () => {
      result.current.form.setValue('email', mockEmail);
      result.current.form.setValue('password', mockPassword);
      await result.current.form.trigger();
    });

    // フォーム送信
    await act(async () => {
      await result.current.onSubmit({
        email: mockEmail,
        password: mockPassword,
      });
    });

    // signInが正しく呼び出されたことを確認
    expect(signIn).toHaveBeenCalledWith('credentials', {
      email: mockEmail,
      password: mockPassword,
      redirect: false,
    });

    // トーストが呼び出されていないことを確認
    expect(mockToast).not.toHaveBeenCalled();
  });

  it('異常系: 認証エラーの場合、エラーメッセージが表示されること', async () => {
    // signInのエラーレスポンスをモック
    (signIn as jest.Mock).mockResolvedValueOnce({
      ok: false,
      error: 'Invalid credentials',
    });

    const { result } = renderHook(() => useLogin());

    // フォームの値を設定
    await act(async () => {
      result.current.form.setValue('email', mockEmail);
      result.current.form.setValue('password', mockPassword);
      await result.current.form.trigger();
    });

    // フォーム送信
    await act(async () => {
      await result.current.onSubmit({
        email: mockEmail,
        password: mockPassword,
      });
    });

    // エラーメッセージのトーストが表示されることを確認
    expect(mockToast).toHaveBeenCalledWith({
      title: 'ログイン失敗',
      description: 'メールアドレスまたはパスワードが正しくありません。',
      variant: 'destructive',
    });
  });
});
