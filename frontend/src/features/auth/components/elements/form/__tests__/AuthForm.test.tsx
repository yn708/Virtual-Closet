import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import AuthForm from '../AuthForm';
// フォームの入力値の型定義
interface AuthFormInputs {
  email: string;
  password: string;
  passwordConfirmation: string;
}

// ラッパーコンポーネントのProps型定義
interface TestWrapperProps {
  mode: 'login' | 'signup' | 'email-only' | 'password';
  onSubmit?: SubmitHandler<AuthFormInputs>;
  submitButtonLabel?: string;
  passwordLabel?: string;
}

// テスト用のラッパーコンポーネント
const TestWrapper = ({
  mode,
  onSubmit = jest.fn(),
  submitButtonLabel = 'テスト送信',
  passwordLabel = '',
}: TestWrapperProps) => {
  const form = useForm<AuthFormInputs>({
    defaultValues: {
      email: '',
      password: '',
      passwordConfirmation: '',
    },
  });

  return (
    <AuthForm
      form={form}
      onSubmit={onSubmit}
      mode={mode}
      submitButtonLabel={submitButtonLabel}
      passwordLabel={passwordLabel}
    />
  );
};

describe('AuthForm', () => {
  // email-onlyモードのテスト
  describe('email-only mode', () => {
    it('メールアドレスフィールドのみが表示される', () => {
      render(<TestWrapper mode="email-only" />);

      // input[type="email"]を検索
      const emailInputs = screen.getByRole('text-input', { name: '' });
      expect(emailInputs).toHaveAttribute('type', 'email');

      // パスワードフィールドが存在しないことを確認
      const passwordInputs = screen
        .queryAllByRole('text-input')
        .filter((input) => input.getAttribute('type') === 'password');
      expect(passwordInputs).toHaveLength(0);
    });

    it('メールアドレスを入力して送信できる', async () => {
      const mockSubmit = jest.fn();
      const user = userEvent.setup();

      render(<TestWrapper mode="email-only" onSubmit={mockSubmit} />);

      const emailInput = screen.getByRole('text-input', { name: '' });
      await user.type(emailInput, 'test@example.com');

      const submitButton = screen.getByRole('button', { name: 'テスト送信' });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockSubmit).toHaveBeenCalledWith(
          expect.objectContaining({ email: 'test@example.com' }),
          expect.anything(),
        );
      });
    });
  });

  // loginモードのテスト
  describe('login mode', () => {
    it('メールアドレスとパスワードフィールドが表示される', () => {
      render(<TestWrapper mode="login" />);

      const emailInput = screen.getByRole('text-input', { name: '' });
      expect(emailInput).toHaveAttribute('type', 'email');

      const passwordInputs = screen.getAllByRole('password-input');
      expect(passwordInputs).toHaveLength(1);

      expect(screen.getByText('メールアドレス')).toBeInTheDocument();
      expect(screen.getByText('パスワード')).toBeInTheDocument();
    });

    it('メールアドレスとパスワードを入力して送信できる', async () => {
      const mockSubmit = jest.fn();
      const user = userEvent.setup();

      render(<TestWrapper mode="login" onSubmit={mockSubmit} />);

      const emailInput = screen.getByRole('text-input');
      const passwordInput = screen.getByRole('password-input');

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');

      const submitButton = screen.getByRole('button', { name: 'テスト送信' });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            email: 'test@example.com',
            password: 'password123',
          }),
          expect.anything(),
        );
      });
    });
  });

  // signupモードのテスト
  describe('signup mode', () => {
    it('全てのフィールドが表示される', () => {
      render(<TestWrapper mode="signup" />);

      const emailInput = screen.getByRole('text-input');
      expect(emailInput).toBeInTheDocument();

      const passwordInputs = screen.getAllByRole('password-input');
      expect(passwordInputs).toHaveLength(2);

      expect(screen.getByText('メールアドレス')).toBeInTheDocument();
      expect(screen.getByText('パスワード')).toBeInTheDocument();
      expect(screen.getByText('パスワード（確認）')).toBeInTheDocument();
    });
  });

  // Submit中の状態のテスト
  it('送信中はボタンがdisabledになる', async () => {
    const mockSubmit = jest.fn(() => new Promise((resolve) => setTimeout(resolve, 1000)));
    const user = userEvent.setup();

    render(<TestWrapper mode="email-only" onSubmit={mockSubmit} />);

    const emailInput = screen.getByRole('text-input', { name: '' });
    await user.type(emailInput, 'test@example.com');

    const submitButton = screen.getByRole('button', { name: 'テスト送信' });
    await user.click(submitButton);

    expect(submitButton).toBeDisabled();
  });
});
