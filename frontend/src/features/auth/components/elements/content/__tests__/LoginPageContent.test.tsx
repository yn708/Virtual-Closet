import { useLogin } from '@/features/auth/hooks/useLogin';
import type { LoginFormData } from '@/features/auth/types';
import { SIGN_UP_URL } from '@/utils/constants';
import { loginFormSchema } from '@/utils/validations/user-validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { render, screen } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import LoginPageContent from '../LoginPageContent';

// 各モジュールのモック
jest.mock('next-auth/react', () => ({
  signIn: jest.fn(),
}));

jest.mock('@/features/auth/hooks/useLogin', () => ({
  useLogin: jest.fn(),
}));

// Next.jsのuseRouterをモック
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
  })),
}));

// モックフォームを作成する関数
const useCreateMockForm = () => {
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  return form;
};

// テスト用のラッパーコンポーネント
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const form = useCreateMockForm();
  (useLogin as jest.Mock).mockReturnValue({
    form,
    onSubmit: jest.fn(),
  });

  return <FormProvider {...form}>{children}</FormProvider>;
};

describe('LoginPageContent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * 初期表示のテスト
   * - ソーシャルログインボタンが表示されること
   * - 各種リンクが表示されること
   */
  it('renders all components correctly', () => {
    render(
      <TestWrapper>
        <LoginPageContent />
      </TestWrapper>,
    );

    // ソーシャルログインセクション
    expect(screen.getByText('または')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Googleでログイン/i })).toBeInTheDocument();

    // リンク要素
    expect(screen.getByText('パスワードをお忘れの方は')).toBeInTheDocument();
    const resetLink = screen.getByText('こちら');
    expect(resetLink).toBeInTheDocument();
    expect(resetLink).toHaveAttribute('href', '/auth/password/reset');

    expect(screen.getByText('まだアカウントをお持ちでない方は')).toBeInTheDocument();
    const signUpLink = screen.getByText('新規登録');
    expect(signUpLink).toBeInTheDocument();
    expect(signUpLink).toHaveAttribute('href', SIGN_UP_URL);
  });

  /**
   * パスワードリセットリンクのテスト
   * - リンクをクリックするとパスワードリセットページに遷移すること
   */
  it('navigates to password reset page', () => {
    render(
      <TestWrapper>
        <LoginPageContent />
      </TestWrapper>,
    );

    const resetLink = screen.getByText('こちら');
    expect(resetLink).toHaveAttribute('href', '/auth/password/reset');
  });

  /**
   * 新規登録リンクのテスト
   * - リンクをクリックすると新規登録ページに遷移すること
   */
  it('navigates to sign up page', () => {
    render(
      <TestWrapper>
        <LoginPageContent />
      </TestWrapper>,
    );

    const signUpLink = screen.getByText('新規登録');
    expect(signUpLink).toHaveAttribute('href', SIGN_UP_URL);
  });
});
