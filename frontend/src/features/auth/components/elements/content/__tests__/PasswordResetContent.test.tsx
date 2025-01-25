import type { FormState } from '@/types';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PasswordResetContent from '../PasswordResetContent';

const mockFormAction = jest.fn();
jest.mock('react-dom', () => ({
  ...jest.requireActual('react-dom'),
  useFormState: jest.fn((action) => {
    mockFormAction.mockImplementation(action);
    return [{ errors: {} }, mockFormAction];
  }),
}));

let mockRequestActionResult = {
  success: true,
};
const mockPasswordResetRequestAction = jest.fn().mockImplementation(() => {
  return async () => mockRequestActionResult;
});
jest.mock('@/lib/actions/auth/passwordResetRequestAction', () => ({
  passwordResetRequestAction: jest.fn(() => mockPasswordResetRequestAction()),
}));

let mockConfirmActionResult = { success: true };
const mockPasswordResetConfirmAction = jest.fn().mockImplementation(() => {
  return async () => mockConfirmActionResult;
});
jest.mock('@/lib/actions/auth/passwordResetConfirmAction', () => ({
  passwordResetConfirmAction: jest.fn(() => mockPasswordResetConfirmAction()),
}));

jest.mock('@/features/auth/components/elements/form/AuthForm', () => ({
  __esModule: true,
  default: ({
    formAction,
    submitButtonLabel,
    mode,
  }: {
    formAction: (formData: FormData) => Promise<void>;
    submitButtonLabel: string;
    mode: 'email-only' | 'password';
    state: FormState;
  }) => (
    <form
      data-testid="auth-form"
      onSubmit={async (e) => {
        e.preventDefault();
        const formData = new FormData();
        if (mode === 'email-only') {
          formData.append('email', 'test@example.com');
        } else if (mode === 'password') {
          formData.append('password', 'newpassword123');
        }
        await formAction(formData);
      }}
    >
      <button type="submit" data-testid="submit-button">
        {submitButtonLabel}
      </button>
    </form>
  ),
}));

describe('PasswordResetContent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRequestActionResult = { success: true };
    mockConfirmActionResult = { success: true };
  });

  describe('リクエストモード', () => {
    it('正しくすべてのコンポーネントがレンダリングされること', () => {
      render(<PasswordResetContent mode="request" />);

      expect(screen.getByText('パスワード再設定')).toBeInTheDocument();
      expect(
        screen.getByText('登録済みのメールアドレス宛にパスワード再設定用のURLを通知いたします。'),
      ).toBeInTheDocument();
      expect(screen.getByTestId('auth-form')).toBeInTheDocument();
      expect(screen.getByText('送信')).toBeInTheDocument();
      expect(screen.getByText('戻る')).toBeInTheDocument();
    });

    it('メール送信リクエストが成功した場合の処理が正しく実行されること', async () => {
      render(<PasswordResetContent mode="request" />);

      const submitButton = screen.getByTestId('submit-button');
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(mockPasswordResetRequestAction).toHaveBeenCalled();
      });
    });

    it('メール送信リクエスト失敗時にトースト通知が表示されないこと', async () => {
      mockRequestActionResult = { success: false };

      render(<PasswordResetContent mode="request" />);

      const submitButton = screen.getByTestId('submit-button');
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(mockPasswordResetRequestAction).toHaveBeenCalled();
      });
    });
  });

  describe('確認モード', () => {
    const mockUid = 'test-uid';
    const mockToken = 'test-token';

    it('正しくすべてのコンポーネントがレンダリングされること', () => {
      render(<PasswordResetContent mode="confirm" uid={mockUid} token={mockToken} />);

      expect(screen.getByText('パスワード再設定')).toBeInTheDocument();
      expect(screen.getByText('新しいパスワードを入力してください。')).toBeInTheDocument();
      expect(screen.getByTestId('auth-form')).toBeInTheDocument();
      expect(screen.getByText('保存')).toBeInTheDocument();
      expect(screen.queryByText('ログインに戻る')).not.toBeInTheDocument();
    });

    it('パスワード更新が成功した場合の処理が正しく実行されること', async () => {
      render(<PasswordResetContent mode="confirm" uid={mockUid} token={mockToken} />);

      const submitButton = screen.getByTestId('submit-button');
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(mockPasswordResetConfirmAction).toHaveBeenCalled();
      });
    });

    it('パスワード更新が失敗した場合の処理が正しく実行されること', async () => {
      mockConfirmActionResult = {
        success: false,
      };

      render(<PasswordResetContent mode="confirm" uid={mockUid} token={mockToken} />);

      const submitButton = screen.getByTestId('submit-button');
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(mockPasswordResetConfirmAction).toHaveBeenCalled();
      });
    });
  });
});
