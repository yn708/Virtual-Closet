import { render, screen } from '@testing-library/react';

import { useSignUp } from '@/features/auth/hooks/useSignUp';
import type { LoginFormData } from '@/features/auth/types';
import { useToast } from '@/hooks/use-toast';
import userEvent from '@testing-library/user-event';
import type { UseFormReturn } from 'react-hook-form';
import EmailSignUpButton from '../EmailSignUpButton';
interface TestAuthFormProps {
  form: UseFormReturn;
  onSubmit: (data: LoginFormData) => Promise<void>;
  submitButtonLabel: string;
}

// モックの設定
jest.mock('@/hooks/use-toast', () => ({
  useToast: jest.fn(),
}));

jest.mock('@/features/auth/hooks/useSignUp', () => ({
  useSignUp: jest.fn(),
}));
jest.mock('../../form/AuthForm', () => ({
  __esModule: true,
  default: ({ submitButtonLabel }: TestAuthFormProps) => (
    <form data-testid="auth-form">
      <input placeholder="メールアドレス" role="text-input" />
      <input placeholder="パスワード" type="password" role="password-input" />
      <input placeholder="パスワード（確認）" type="password" role="password-input" />
      <button type="submit" data-testid="submit-button">
        {submitButtonLabel}
      </button>
    </form>
  ),
}));

// テスト用のモックデータ
const mockForm = {
  register: jest.fn(),
  handleSubmit: jest.fn((fn) => fn),
  formState: {
    isSubmitting: false,
    errors: {},
  },
};

const mockToast = {
  toast: jest.fn(),
};

describe('EmailSignUpButton', () => {
  beforeEach(() => {
    // モックのリセットと初期設定
    jest.clearAllMocks();
    (useToast as jest.Mock).mockReturnValue(mockToast);
    (useSignUp as jest.Mock).mockReturnValue({
      form: mockForm,
      onSubmit: jest.fn(),
    });
  });

  // 1. 正常にレンダリングされるかのテスト
  it('renders email signup button correctly', () => {
    render(<EmailSignUpButton />);

    // ボタンが存在することを確認
    const button = screen.getByRole('button', { name: /Emailで登録/i });
    expect(button).toBeInTheDocument();
  });

  // 2. ダイアログが開くかのテスト
  it('opens dialog when button is clicked', async () => {
    render(<EmailSignUpButton />);

    // ボタンをクリック
    const button = screen.getByRole('button', { name: /Emailで登録/i });
    await userEvent.click(button);

    // ダイアログが表示されることを確認
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  // 3. ダイアログの内容が正しく表示されるかのテスト
  it('displays correct dialog content', async () => {
    render(<EmailSignUpButton />);

    // ダイアログを開く
    const button = screen.getByRole('button', { name: /Emailで登録/i });
    await userEvent.click(button);

    // ダイアログの内容を確認
    expect(screen.getByText('メールアドレスで登録')).toBeInTheDocument();
    expect(screen.getByText('必要な情報を入力してください')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'アカウント作成' })).toBeInTheDocument();
  });
});
