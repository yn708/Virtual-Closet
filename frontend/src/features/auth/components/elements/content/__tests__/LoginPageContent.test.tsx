import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginPageContent from '../LoginPageContent';

jest.mock('next-auth/react', () => ({
  signIn: jest.fn(),
}));

jest.mock('react-dom', () => ({
  ...jest.requireActual('react-dom'),
  useFormState: jest.fn((initialState) => [initialState, jest.fn()]),
}));

const mockLoginAction = jest.fn();
jest.mock('@/lib/actions/auth/loginAction', () => ({
  loginAction: () => mockLoginAction,
}));

const mockToast = jest.fn();
jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: mockToast,
  }),
}));

const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

jest.mock('@/features/auth/components/elements/form/AuthForm', () => ({
  __esModule: true,
  default: ({
    submitButtonLabel,
    formAction,
  }: {
    submitButtonLabel: string;
    formAction: () => void;
  }) => (
    <form
      data-testid="auth-form"
      onSubmit={(e) => {
        e.preventDefault();
        formAction();
      }}
    >
      <button type="submit" data-testid="submit-button">
        {submitButtonLabel}
      </button>
    </form>
  ),
}));

jest.mock('@/features/auth/components/elements/button/SocialAuthButtons', () => ({
  __esModule: true,
  default: ({ text }: { text: string }) => (
    <div data-testid="social-auth-buttons">
      <button>Googleで{text}</button>
    </div>
  ),
}));

describe('LoginPageContent', () => {
  const mockSignIn = jest.requireMock('next-auth/react').signIn;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('正しくすべてのコンポーネントがレンダリングされること', () => {
    render(<LoginPageContent />);

    // ソーシャルログインボタンの確認
    expect(screen.getByTestId('social-auth-buttons')).toBeInTheDocument();
    expect(screen.getByText('または')).toBeInTheDocument();

    // 認証フォームの確認
    expect(screen.getByTestId('auth-form')).toBeInTheDocument();
    expect(screen.getByTestId('submit-button')).toBeInTheDocument();

    // リンクの確認
    expect(screen.getByText('パスワードをお忘れの方は')).toBeInTheDocument();
    const resetLink = screen.getByText('こちら');
    expect(resetLink).toHaveAttribute('href', '/auth/password/reset');

    expect(screen.getByText('まだアカウントをお持ちでない方は')).toBeInTheDocument();
    const signUpLink = screen.getByText('新規登録');
    expect(signUpLink).toHaveAttribute('href', '/auth/sign-up');
  });

  it('Server Action失敗時の処理が正しく実行されること', async () => {
    mockLoginAction.mockResolvedValue({
      success: false,
      errors: {
        email: ['無効なメールアドレスの形式です'],
      },
    });

    render(<LoginPageContent />);

    const submitButton = screen.getByTestId('submit-button');
    await userEvent.click(submitButton);

    await waitFor(() => {
      // サインインが呼ばれていないことを確認
      expect(mockSignIn).not.toHaveBeenCalled();
      // リダイレクトが発生していないことを確認
      expect(mockPush).not.toHaveBeenCalled();
    });
  });
});
