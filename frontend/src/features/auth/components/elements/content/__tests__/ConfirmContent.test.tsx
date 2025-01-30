import type { FormState } from '@/types';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ConfirmContent from '../ConfirmContent';

jest.mock('react-dom', () => ({
  ...jest.requireActual('react-dom'),
  useFormState: jest.fn((initialState) => [initialState, jest.fn()]),
}));

jest.mock('@/lib/actions/auth/resendCodeAction', () => ({
  resendCodeAction: jest.fn(),
}));

jest.mock('@/hooks/use-toast', () => ({
  useToast: jest.fn(() => ({
    toast: jest.fn(),
  })),
}));

jest.mock('@/components/layout/TitleLayout', () => ({
  __esModule: true,
  default: ({
    children,
    title,
    description,
    subDescription,
  }: {
    children: React.ReactNode;
    title: string;
    description: string;
    subDescription: string;
  }) => (
    <div data-testid="title-layout">
      <h1>{title}</h1>
      <p>{description}</p>
      <p>{subDescription}</p>
      {children}
    </div>
  ),
}));

jest.mock('../../form/AuthCodeInputForm', () => ({
  __esModule: true,
  default: ({ email }: { email: string }) => (
    <div data-testid="auth-code-form">Auth Code Form for {email}</div>
  ),
}));

jest.mock('../../form/AuthForm', () => ({
  __esModule: true,
  default: ({ submitButtonLabel }: { submitButtonLabel: string }) => (
    <form data-testid="auth-form">
      <button type="submit">{submitButtonLabel}</button>
    </form>
  ),
}));

const mockUseFormState = jest.requireMock('react-dom').useFormState;

describe('ConfirmContent', () => {
  const defaultProps = {
    email: 'test@example.com',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseFormState.mockImplementation((initialState: FormState) => [initialState, jest.fn()]);
  });

  // テストケース: 認証コード入力画面が正しくレンダリングされることを確認
  it('should render authentication code input view correctly', () => {
    render(<ConfirmContent {...defaultProps} />);

    expect(screen.getByText('認証コード入力')).toBeInTheDocument();
    expect(screen.getByText(/メールアドレス宛に認証コードを送信しました/)).toBeInTheDocument();
    expect(screen.getByText(/記載された認証コードを入力してください/)).toBeInTheDocument();
    expect(screen.getByTestId('auth-code-form')).toBeInTheDocument();
  });

  // テストケース: 再送信ボタンをクリックすると再送信画面に切り替わることを確認
  it('should switch to resend view when resend button is clicked', async () => {
    render(<ConfirmContent {...defaultProps} />);

    const resendButton = screen.getByRole('button', { name: /認証コードを再送信/ });
    await userEvent.click(resendButton);

    expect(screen.getByText('認証コード再送信')).toBeInTheDocument();
    expect(screen.getByTestId('auth-form')).toBeInTheDocument();
  });

  // テストケース: 戻るボタンをクリックすると入力画面に戻ることを確認
  it('should return to input view when back button is clicked from resend view', async () => {
    render(<ConfirmContent {...defaultProps} />);

    // 再送信画面に移動
    const resendButton = screen.getByRole('button', { name: /認証コードを再送信/ });
    await userEvent.click(resendButton);

    // 戻るボタンをクリック
    const backButton = screen.getByRole('button', { name: '戻る' });
    await userEvent.click(backButton);

    expect(screen.getByText('認証コード入力')).toBeInTheDocument();
    expect(screen.getByTestId('auth-code-form')).toBeInTheDocument();
  });
});
