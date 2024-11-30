import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import type { FormState } from '@/types';
import EmailSignUpButton from '../EmailSignUpButton';

jest.mock('react-dom', () => ({
  ...jest.requireActual('react-dom'),
  useFormState: jest.fn((initialState: FormState) => [initialState, jest.fn()]),
}));

jest.mock('@/lib/actions/auth/signUpAction', () => ({
  signUpAction: jest.fn(),
}));

jest.mock('../../form/AuthForm', () => ({
  __esModule: true,
  default: ({ submitButtonLabel }: { submitButtonLabel: string }) => (
    <form data-testid="auth-form">
      <input placeholder="メールアドレス" />
      <input placeholder="パスワード" type="password" />
      <button type="submit">{submitButtonLabel}</button>
    </form>
  ),
}));

jest.mock('../../content/ConfirmContent', () => ({
  __esModule: true,
  default: ({ email }: { email: string }) => (
    <div data-testid="confirm-content">確認メール送信先: {email}</div>
  ),
}));

const mockUseFormState = jest.requireMock('react-dom').useFormState;

describe('EmailSignUpButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseFormState.mockImplementation((initialState: FormState) => [initialState, jest.fn()]);
  });

  // 初期状態で正しくレンダリングされることを確認
  it('should render correctly in initial state', () => {
    render(<EmailSignUpButton />);

    expect(screen.getByTestId('email-signup-button')).toBeInTheDocument();
    expect(screen.getByText('Emailで登録')).toBeInTheDocument();
  });

  // ボタンクリックでダイアログが開くことを確認
  it('should open dialog when button is clicked', async () => {
    render(<EmailSignUpButton />);

    const button = screen.getByTestId('email-signup-button');
    await userEvent.click(button);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('メールアドレスで登録')).toBeInTheDocument();
    expect(screen.getByText('必要な情報を入力してください')).toBeInTheDocument();
  });

  // 登録成功時に確認画面が表示されることを確認
  it('should display confirmation screen on successful registration', async () => {
    mockUseFormState.mockImplementation((initialState: FormState) => [
      {
        ...initialState,
        success: true,
        email: 'test@example.com',
      },
      jest.fn(),
    ]);

    render(<EmailSignUpButton />);

    await userEvent.click(screen.getByTestId('email-signup-button'));

    expect(screen.getByTestId('confirm-content')).toBeInTheDocument();
    expect(screen.getByText('確認メール送信先: test@example.com')).toBeInTheDocument();
  });

  // ダイアログが閉じられることを確認
  it('should close dialog when close button is clicked', async () => {
    render(<EmailSignUpButton />);

    await userEvent.click(screen.getByTestId('email-signup-button'));
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    const closeButton = screen.getByRole('button', { name: 'Close' });
    await userEvent.click(closeButton);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  // エラー状態が適切に表示されることを確認
  it('should display error state correctly', async () => {
    mockUseFormState.mockImplementation((initialState: FormState) => [
      {
        ...initialState,
        error: 'An error occurred',
      },
      jest.fn(),
    ]);

    render(<EmailSignUpButton />);

    await userEvent.click(screen.getByTestId('email-signup-button'));

    expect(screen.getByTestId('auth-form')).toBeInTheDocument();
  });
});
