import { useToast } from '@/hooks/use-toast';
import { sendPasswordResetAPI } from '@/lib/api/authApi';
import { ERROR_DESCRIPTION_MESSAGE, ERROR_MESSAGE } from '@/utils/constants';
import { act, renderHook } from '@testing-library/react';
import { useSendPasswordResetUrl } from '../useSendPasswordResetUrl';

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
  sendPasswordResetAPI: jest.fn(),
}));

// Toastモックの設定
jest.mock('@/hooks/use-toast', () => ({
  useToast: jest.fn(),
}));

// テスト用のデータ
const mockEmail = 'test@example.com';
const mockToast = jest.fn();

// テスト用のWrapper
const wrapper = ({ children }: { children: React.ReactNode }) => children;

describe('useSendPasswordResetUrl', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useToast as jest.Mock).mockReturnValue({ toast: mockToast });
  });

  it('フォームの初期値が正しく設定されていること', () => {
    const { result } = renderHook(() => useSendPasswordResetUrl(), { wrapper });

    expect(result.current.form.getValues()).toEqual({
      email: '',
    });
  });

  it('正常系: フォーム送信が成功した場合、成功メッセージが表示されること', async () => {
    const { result } = renderHook(() => useSendPasswordResetUrl(), { wrapper });

    // フォームの値を設定
    await act(async () => {
      result.current.form.setValue('email', mockEmail);
    });

    // フォーム送信
    await act(async () => {
      // onSubmitを直接呼び出す代わりに、handleSubmitを使用
      const onSubmit = result.current.form.handleSubmit(result.current.onSubmit);
      await onSubmit();
    });

    // APIが正しい値で呼び出されたことを確認
    expect(sendPasswordResetAPI).toHaveBeenCalledWith({
      email: mockEmail,
    });

    // 成功時のトースト表示を確認
    expect(mockToast).toHaveBeenCalledWith({
      title: 'メールアドレス宛にパスワード再設定用のURLを送信しました。',
      description: 'ご確認をよろしくお願いします。',
    });
  });

  it('異常系: APIがエラーを返した場合、フォームにエラーが設定されること', async () => {
    const { result } = renderHook(() => useSendPasswordResetUrl(), { wrapper });

    // APIエラーのモック
    const errorData = { email: ['無効なメールアドレスです。'] };
    (sendPasswordResetAPI as jest.Mock).mockRejectedValueOnce(new Error(JSON.stringify(errorData)));

    // フォームの値を設定
    result.current.form.setValue('email', mockEmail);

    // フォーム送信
    await act(async () => {
      const onSubmit = result.current.form.handleSubmit(result.current.onSubmit);
      await onSubmit();
    });

    // エラー設定を確認
    expect(result.current.form.getFieldState('email').error?.message).toBe(
      '無効なメールアドレスです。',
    );
  });

  it('異常系: 予期せぬエラーの場合、エラートーストが表示されること', async () => {
    const { result } = renderHook(() => useSendPasswordResetUrl(), { wrapper });

    // 予期せぬエラーのモック
    (sendPasswordResetAPI as jest.Mock).mockRejectedValueOnce('Unexpected error');

    // フォームの値を設定
    await act(async () => {
      result.current.form.setValue('email', mockEmail);
    });

    // フォーム送信
    await act(async () => {
      const onSubmit = result.current.form.handleSubmit(result.current.onSubmit);
      await onSubmit();
    });

    // エラートーストが表示されることを確認
    expect(mockToast).toHaveBeenCalledWith({
      title: ERROR_MESSAGE,
      description: ERROR_DESCRIPTION_MESSAGE,
      variant: 'destructive',
    });
  });

  it('ローディング状態が適切に変更されること', async () => {
    const { result } = renderHook(() => useSendPasswordResetUrl(), { wrapper });

    // 初期状態の確認
    expect(result.current.isLoading).toBe(false);

    // フォーム送信開始
    const submitPromise = act(async () => {
      result.current.form.setValue('email', mockEmail);
      const onSubmit = result.current.form.handleSubmit(result.current.onSubmit);
      await onSubmit();
    });

    // 送信完了
    await submitPromise;

    // 送信完了後のローディング状態を確認
    expect(result.current.isLoading).toBe(false);
  });
});
