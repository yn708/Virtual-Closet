import { signUpAPI } from '@/lib/api/authApi';
import { CONFIRM_CODE_URL } from '@/utils/constants';
import { act, renderHook, waitFor } from '@testing-library/react';
import { useSignUp } from '../useSignUp';

// Next.jsのルーターをモック
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: jest.fn(),
    refresh: jest.fn(),
  }),
}));

// APIモックの設定
jest.mock('@/lib/api/authApi', () => ({
  signUpAPI: jest.fn(),
}));

// sessionStorageのモック
const mockSessionStorage = {
  storage: {} as { [key: string]: string },
  setItem(key: string, value: string) {
    this.storage[key] = value;
  },
  getItem(key: string) {
    return this.storage[key] || null;
  },
  clear() {
    this.storage = {};
  },
};

Object.defineProperty(window, 'sessionStorage', {
  value: mockSessionStorage,
});

// テスト用のデータ
const mockEmail = 'test@example.com';
const mockPassword = 'password123';
const mockPasswordConfirmation = 'password123';
const mockOnSuccess = jest.fn();

// テスト用のWrapper
const wrapper = ({ children }: { children: React.ReactNode }) => children;

describe('useSignUp', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSessionStorage.clear();
  });

  it('フォームの初期値が正しく設定されていること', () => {
    const { result } = renderHook(() => useSignUp(mockOnSuccess), {
      wrapper,
    });

    expect(result.current.form.getValues()).toEqual({
      email: '',
      password: '',
      passwordConfirmation: '',
    });
  });

  it('正常系: サインアップが成功すること', async () => {
    // APIの成功レスポンスをモック
    (signUpAPI as jest.Mock).mockResolvedValueOnce({ success: true });

    const { result } = renderHook(() => useSignUp(mockOnSuccess), {
      wrapper,
    });

    // フォームの値を設定
    await act(async () => {
      result.current.form.setValue('email', mockEmail);
      result.current.form.setValue('password', mockPassword);
      result.current.form.setValue('passwordConfirmation', mockPasswordConfirmation);
    });

    const data = {
      email: mockEmail,
      password: mockPassword,
      passwordConfirmation: mockPasswordConfirmation,
    };

    // フォーム送信
    await act(async () => {
      await result.current.onSubmit(data);
    });

    // APIが正しく呼び出されたことを確認
    expect(signUpAPI).toHaveBeenCalledWith(data);

    // sessionStorageにemailが保存されていることを確認
    expect(sessionStorage.getItem('email')).toBe(mockEmail);

    // 確認コード入力ページに遷移することを確認
    expect(mockPush).toHaveBeenCalledWith(CONFIRM_CODE_URL);

    // 成功時コールバックが呼び出されることを確認
    expect(mockOnSuccess).toHaveBeenCalled();
  });

  it('異常系: APIがエラーを返した場合、フォームにエラーが設定されること', async () => {
    const errorDetail = 'このメールアドレスは既に登録されています。';
    (signUpAPI as jest.Mock).mockRejectedValueOnce(
      new Error(JSON.stringify({ detail: errorDetail })),
    );

    const { result } = renderHook(() => useSignUp(mockOnSuccess), {
      wrapper,
    });

    // フォームの値を設定
    await act(async () => {
      result.current.form.setValue('email', mockEmail);
      result.current.form.setValue('password', mockPassword);
      result.current.form.setValue('passwordConfirmation', mockPasswordConfirmation);

      // バリデーションをトリガー
      await result.current.form.trigger();
    });

    // フォーム送信をPromiseとして実行
    await act(async () => {
      await result.current.onSubmit(result.current.form.getValues());
    });

    // エラー状態の確認
    await waitFor(
      () => {
        const emailError = result.current.form.getFieldState('email').error;
        expect(emailError?.message).toBe(errorDetail);
      },
      { timeout: 1000 },
    );

    // その他の検証
    expect(sessionStorage.getItem('email')).toBeNull();
    expect(mockPush).not.toHaveBeenCalled();
    expect(mockOnSuccess).not.toHaveBeenCalled();
  });

  it('ローディング状態が適切に変更されること', async () => {
    const { result } = renderHook(() => useSignUp(mockOnSuccess), {
      wrapper,
    });

    // 初期状態の確認
    expect(result.current.isLoading).toBe(false);

    // フォームの値を設定
    await act(async () => {
      result.current.form.setValue('email', mockEmail);
      result.current.form.setValue('password', mockPassword);
      result.current.form.setValue('passwordConfirmation', mockPasswordConfirmation);
    });

    // フォーム送信開始
    const submitPromise = act(async () => {
      const onSubmit = result.current.form.handleSubmit(result.current.onSubmit);
      await onSubmit();
    });

    // 送信完了
    await submitPromise;

    // 送信完了後のローディング状態を確認
    expect(result.current.isLoading).toBe(false);
  });
});
