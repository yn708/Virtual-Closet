import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { act } from 'react';

import { useToast } from '@/hooks/use-toast';
import { confirmRegistrationAPI } from '@/lib/api/authApi';
import { signIn } from 'next-auth/react';
import AuthCodeInputForm from '../AuthCodeInputForm';

// モック設定 --------------------------------
// ResizeObserverのモック
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// elementFromPointのモック（OTPコンポーネントで使用）
document.elementFromPoint = () => null;

// 各種モックの設定
beforeAll(() => {
  global.ResizeObserver = ResizeObserverMock;
});

// 外部依存のモック
jest.mock('next-auth/react', () => ({
  signIn: jest.fn(),
}));

jest.mock('@/lib/api/authApi', () => ({
  confirmRegistrationAPI: jest.fn(),
}));

jest.mock('@/hooks/use-toast', () => ({
  useToast: jest.fn(() => ({
    toast: jest.fn(),
  })),
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
  })),
}));

// ヘルパー関数 --------------------------------
/**
 * フォームの主要要素を取得するヘルパー関数
 * - 入力フィールド
 * - 送信ボタン
 * - 再送信ボタン
 */
const getFormElements = () => {
  const input = screen.getByRole('textbox');
  const submitButton = screen.getByRole('button', { name: '送信' });
  const resendButton = screen.getByText('認証コードを再送信');
  return { input, submitButton, resendButton };
};

/**
 * フォームに認証コードを入力して送信するヘルパー関数
 * @param code 入力する認証コード
 */
const fillAndSubmitForm = async (code: string) => {
  const { input, submitButton } = getFormElements();
  await act(async () => {
    fireEvent.change(input, { target: { value: code } });
    fireEvent.click(submitButton);
  });
};

// テストスイート --------------------------------
describe('AuthCodeInputForm', () => {
  const mockEmail = 'test@example.com';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * 初期表示のテスト
   * - 6桁の入力フィールドが表示されること
   * - 送信ボタンが表示されること
   * - 再送信リンクが表示されること
   */
  it('renders the form with empty input fields', async () => {
    render(<AuthCodeInputForm email={mockEmail} />);

    const inputField = screen.getByRole('textbox');
    expect(inputField).toBeInTheDocument();
    expect(inputField).toHaveAttribute('maxlength', '6');
    expect(screen.getByRole('button', { name: '送信' })).toBeInTheDocument();
    expect(screen.getByText('認証コードを再送信')).toBeInTheDocument();
  });

  /**
   * コード入力の動作テスト
   * - 6桁のコードが正しく入力できること
   * - 入力値がフォームに反映されること
   */
  it('handles code input correctly', async () => {
    render(<AuthCodeInputForm email={mockEmail} />);
    const input = screen.getByRole('textbox');

    await act(async () => {
      fireEvent.change(input, { target: { value: '123456' } });
    });

    expect(input).toHaveValue('123456');
  });

  /**
   * フォーム送信成功のテスト
   * - APIが正しく呼び出されること
   * - 認証コードと共にメールアドレスが送信されること
   * - サインインが実行されること
   */
  it('submits form successfully', async () => {
    const mockConfirmResponse = { key: 'mock-token' };
    (confirmRegistrationAPI as jest.Mock).mockResolvedValueOnce(mockConfirmResponse);
    (signIn as jest.Mock).mockResolvedValueOnce({ ok: true });

    render(<AuthCodeInputForm email={mockEmail} />);
    await fillAndSubmitForm('123456');

    await waitFor(() => {
      expect(confirmRegistrationAPI).toHaveBeenCalledWith(mockEmail, '123456');
      expect(signIn).toHaveBeenCalledWith('credentials', {
        email: mockEmail,
        token: mockConfirmResponse.key,
        callbackUrl: expect.any(String),
      });
    });
  });

  /**
   * エラーメッセージ表示のテスト
   * - API呼び出しが失敗した場合、エラートーストが表示されること
   * - エラーメッセージが正しく表示されること
   */
  it('displays error message on API failure', async () => {
    const mockError = { detail: 'Invalid verification code' };
    (confirmRegistrationAPI as jest.Mock).mockRejectedValueOnce(
      new Error(JSON.stringify(mockError)),
    );

    const mockToast = jest.fn();
    (useToast as jest.Mock).mockReturnValue({ toast: mockToast });

    render(<AuthCodeInputForm email={mockEmail} />);
    await fillAndSubmitForm('123456');

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: 'エラー',
        description: mockError.detail,
        variant: 'destructive',
      });
    });
  });

  /**
   * ローディング状態のテスト
   * - 送信中はボタンが無効化されること
   * - 送信完了後にボタンが再度有効化されること
   */
  it('shows loading state during submission', async () => {
    (confirmRegistrationAPI as jest.Mock).mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100)),
    );

    render(<AuthCodeInputForm email={mockEmail} />);
    const { submitButton } = getFormElements();

    await fillAndSubmitForm('123456');
    expect(submitButton).toBeDisabled();
  });

  /**
   * 入力バリデーションのテスト
   * - 不正な入力（文字列）を行った場合、エラーメッセージが表示されること
   * - バリデーションメッセージが正しく表示されること
   */
  it('validates input format correctly', async () => {
    render(<AuthCodeInputForm email={mockEmail} />);
    const input = screen.getByRole('textbox');

    await act(async () => {
      fireEvent.change(input, { target: { value: 'abcdef' } });
    });

    expect(screen.getByText('※ 全角数字は入力できません / 有効期限は20分です')).toBeInTheDocument();
  });

  /**
   * 再送信機能の統合テスト
   * - 再送信ボタンをクリックすると確認ダイアログが表示されること
   * - ダイアログに正しいメッセージが表示されること
   */
  it('integrates with ResendCodeContent component', async () => {
    render(<AuthCodeInputForm email={mockEmail} />);
    const { resendButton } = getFormElements();

    await act(async () => {
      fireEvent.click(resendButton);
    });

    expect(
      screen.getByText('お手数ですがメールアドレスとパスワードの入力をお願いします。'),
    ).toBeInTheDocument();
  });
});
