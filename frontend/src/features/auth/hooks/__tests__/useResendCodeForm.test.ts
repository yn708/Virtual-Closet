import { useToast } from '@/hooks/use-toast';
import { resendCodeAPI } from '@/lib/api/authApi';
import { act, renderHook } from '@testing-library/react';
import { useResendCodeForm } from '../useResendCodeForm';

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
  resendCodeAPI: jest.fn(),
}));

// Toastモックの設定
jest.mock('@/hooks/use-toast', () => ({
  useToast: jest.fn(),
}));

// テスト用のデータ
const mockEmail = 'test@example.com';
const mockPassword = 'password123';
const mockToast = jest.fn();
const mockOnResendSuccess = jest.fn();

// テスト用のWrapper
const wrapper = ({ children }: { children: React.ReactNode }) => children;

describe('useResendCodeForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useToast as jest.Mock).mockReturnValue({ toast: mockToast });
  });

  it('フォームの初期値が正しく設定されていること', () => {
    const { result } = renderHook(() => useResendCodeForm(mockEmail, mockOnResendSuccess), {
      wrapper,
    });

    expect(result.current.form.getValues()).toEqual({
      email: '',
      password: '',
    });
  });

  it('正常系: メールアドレスが一致している場合、コードが再送信されること', async () => {
    const { result } = renderHook(() => useResendCodeForm(mockEmail, mockOnResendSuccess), {
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
    expect(resendCodeAPI).toHaveBeenCalledWith({
      email: mockEmail,
      password: mockPassword,
    });

    // 成功時のトースト表示を確認
    expect(mockToast).toHaveBeenCalledWith({
      title: '認証コード再送信',
      description: '新しい認証コードを送信しました。',
      duration: 3000,
    });

    // コールバックが呼び出されたことを確認
    expect(mockOnResendSuccess).toHaveBeenCalled();
  });

  it('異常系: メールアドレスが一致しない場合、エラーが表示されること', async () => {
    const { result } = renderHook(() => useResendCodeForm(mockEmail, mockOnResendSuccess), {
      wrapper,
    });

    // 異なるメールアドレスを設定
    await act(async () => {
      result.current.form.setValue('email', 'different@example.com');
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
      description: '入力されたメールアドレスが一致しません。',
      variant: 'destructive',
    });

    // APIが呼び出されていないことを確認
    expect(resendCodeAPI).not.toHaveBeenCalled();
  });

  it('異常系: API呼び出しが失敗した場合、エラーが表示されること', async () => {
    const { result } = renderHook(() => useResendCodeForm(mockEmail, mockOnResendSuccess), {
      wrapper,
    });

    // APIエラーのモック
    (resendCodeAPI as jest.Mock).mockRejectedValueOnce(new Error('API Error'));

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
      description: 'API Error',
      variant: 'destructive',
    });
  });
});
