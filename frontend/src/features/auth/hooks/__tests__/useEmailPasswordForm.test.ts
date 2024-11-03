import { useToast } from '@/hooks/use-toast';
import { verifyEmailPasswordAPI } from '@/lib/api/authApi';
import { act, renderHook } from '@testing-library/react';
import { useEmailPasswordForm } from '../useEmailPasswordForm';

// Next.jsのルーターをモック
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
  }),
}));

// APIモックの設定
jest.mock('@/lib/api/authApi', () => ({
  verifyEmailPasswordAPI: jest.fn(),
}));

// Toastモックの設定
jest.mock('@/hooks/use-toast', () => ({
  useToast: jest.fn(),
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
const mockToast = jest.fn();
const mockOnEmailVerified = jest.fn();

// テスト用のWrapper
const wrapper = ({ children }: { children: React.ReactNode }) => children;

describe('useEmailPasswordForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSessionStorage.clear();
    (useToast as jest.Mock).mockReturnValue({ toast: mockToast });
  });

  it('フォームの初期値が正しく設定されていること', () => {
    const { result } = renderHook(() => useEmailPasswordForm(mockOnEmailVerified), {
      wrapper,
    });

    expect(result.current.form.getValues()).toEqual({
      email: '',
      password: '',
    });
  });

  it('正常系: メールアドレスとパスワードの確認が成功すること', async () => {
    const { result } = renderHook(() => useEmailPasswordForm(mockOnEmailVerified), {
      wrapper,
    });

    // フォームの値を設定
    await act(async () => {
      result.current.form.setValue('email', mockEmail);
      result.current.form.setValue('password', mockPassword);
    });

    // フォーム送信
    await act(async () => {
      const onSubmit = result.current.form.handleSubmit(result.current.onSubmit);
      await onSubmit();
    });

    // APIが正しく呼び出されたことを確認
    expect(verifyEmailPasswordAPI).toHaveBeenCalledWith({
      email: mockEmail,
      password: mockPassword,
    });

    // sessionStorageにemailが保存されていることを確認
    expect(sessionStorage.getItem('email')).toBe(mockEmail);

    // コールバックが呼び出されたことを確認
    expect(mockOnEmailVerified).toHaveBeenCalledWith(mockEmail);

    // 成功時のトースト表示を確認
    expect(mockToast).toHaveBeenCalledWith({
      title: '確認完了',
      description: 'メールアドレスとパスワードが確認されました。',
      duration: 3000,
    });
  });

  it('異常系: APIがdetailエラーを返した場合、エラーメッセージが表示されること', async () => {
    const { result } = renderHook(() => useEmailPasswordForm(mockOnEmailVerified), {
      wrapper,
    });

    // APIエラーのモック
    const errorDetail = 'メールアドレスまたはパスワードが正しくありません。';
    (verifyEmailPasswordAPI as jest.Mock).mockRejectedValueOnce(
      new Error(JSON.stringify({ detail: errorDetail })),
    );

    // フォームの値を設定
    await act(async () => {
      result.current.form.setValue('email', mockEmail);
      result.current.form.setValue('password', mockPassword);
    });

    // フォーム送信
    await act(async () => {
      const onSubmit = result.current.form.handleSubmit(result.current.onSubmit);
      await onSubmit();
    });

    // エラートーストが表示されることを確認
    expect(mockToast).toHaveBeenCalledWith({
      title: 'エラー',
      description: errorDetail,
      variant: 'destructive',
    });

    // sessionStorageにemailが保存されていないことを確認
    expect(sessionStorage.getItem('email')).toBeNull();

    // コールバックが呼び出されていないことを確認
    expect(mockOnEmailVerified).not.toHaveBeenCalled();
  });

  it('異常系: 予期せぬエラーの場合、一般的なエラーメッセージが表示されること', async () => {
    const { result } = renderHook(() => useEmailPasswordForm(mockOnEmailVerified), {
      wrapper,
    });

    // 予期せぬエラーのモック
    (verifyEmailPasswordAPI as jest.Mock).mockRejectedValueOnce('Unexpected error');

    // フォームの値を設定と送信
    await act(async () => {
      result.current.form.setValue('email', mockEmail);
      result.current.form.setValue('password', mockPassword);
      const onSubmit = result.current.form.handleSubmit(result.current.onSubmit);
      await onSubmit();
    });

    // エラートーストが表示されることを確認
    expect(mockToast).toHaveBeenCalledWith({
      title: 'エラー',
      description: '確認に失敗しました',
      variant: 'destructive',
    });

    // sessionStorageにemailが保存されていないことを確認
    expect(sessionStorage.getItem('email')).toBeNull();

    // コールバックが呼び出されていないことを確認
    expect(mockOnEmailVerified).not.toHaveBeenCalled();
  });
});
