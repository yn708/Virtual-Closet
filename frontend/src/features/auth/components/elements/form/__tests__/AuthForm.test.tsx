import type { AuthFormProps } from '@/features/auth/types';
import { render, screen } from '@testing-library/react';
import AuthForm from '../AuthForm';

// モックのフォームアクションを作成
const mockFormAction = jest.fn();

// テストセットアップ用のヘルパー関数を修正
const setup = ({
  mode = 'login',
  state = {
    errors: {},
    message: '',
  },
  submitButtonLabel = 'テスト送信',
  passwordLabel = '',
  pending = false,
  formAction = mockFormAction, // デフォルト値を設定
}: Partial<AuthFormProps>) => {
  return render(
    <AuthForm
      formAction={formAction}
      state={state}
      mode={mode}
      submitButtonLabel={submitButtonLabel}
      passwordLabel={passwordLabel}
      pending={pending}
    />,
  );
};

describe('AuthForm', () => {
  beforeEach(() => {
    mockFormAction.mockClear();
  });

  // email-onlyモードのテスト
  describe('email-only mode', () => {
    it('メールアドレスフィールドのみが表示される', () => {
      setup({
        mode: 'email-only',
        formAction: mockFormAction,
        submitButtonLabel: 'テスト送信',
        state: {
          errors: {},
          message: '',
        },
      });

      // メールアドレス入力フィールドの存在確認
      expect(screen.getByLabelText('メールアドレス')).toHaveAttribute('type', 'email');

      // パスワードフィールドが存在しないことを確認
      expect(screen.queryByLabelText('パスワード')).not.toBeInTheDocument();
    });

    it('エラーメッセージが表示される', () => {
      setup({
        mode: 'email-only',
        state: {
          errors: {
            email: ['メールアドレスを入力してください'],
          },
          message: '',
        },
      });

      expect(screen.getByText('メールアドレスを入力してください')).toBeInTheDocument();
    });
  });

  // loginモードのテスト
  describe('login mode', () => {
    it('メールアドレスとパスワードフィールドが表示される', () => {
      setup({ mode: 'login' });

      expect(screen.getByLabelText('メールアドレス')).toHaveAttribute('type', 'email');
      expect(screen.getByLabelText('パスワード')).toHaveAttribute('type', 'password');
    });

    it('カスタムのパスワードラベルが表示される', () => {
      setup({
        mode: 'login',
        passwordLabel: '現在の',
      });

      expect(screen.getByLabelText('現在のパスワード')).toBeInTheDocument();
    });

    it('エラーメッセージが表示される', () => {
      setup({
        mode: 'login',
        state: {
          errors: {
            email: ['無効なメールアドレスです'],
            password: ['パスワードは8文字以上である必要があります'],
          },
          message: '',
        },
      });

      expect(screen.getByText('無効なメールアドレスです')).toBeInTheDocument();
      expect(screen.getByText('パスワードは8文字以上である必要があります')).toBeInTheDocument();
    });
  });

  // signupモードのテスト
  describe('signup mode', () => {
    it('全てのフィールドが表示される', () => {
      setup({ mode: 'signup' });

      expect(screen.getByLabelText('メールアドレス')).toBeInTheDocument();
      expect(screen.getByLabelText('パスワード')).toBeInTheDocument();
      expect(screen.getByLabelText('パスワード（確認）')).toBeInTheDocument();
    });

    it('エラーメッセージが表示される', () => {
      setup({
        mode: 'signup',
        state: {
          errors: {
            passwordConfirmation: ['パスワードが一致しません'],
          },
          message: '',
        },
      });

      expect(screen.getByText('パスワードが一致しません')).toBeInTheDocument();
    });
  });

  // Submit中の状態のテスト
  describe('送信状態', () => {
    it('pending中はボタンがdisabledになる', () => {
      setup({
        mode: 'email-only',
        pending: true,
      });

      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('pendingでない場合はボタンが有効', () => {
      setup({
        mode: 'email-only',
        pending: false,
      });

      expect(screen.getByRole('button')).toBeEnabled();
    });
  });

  // 無効なmodeのテスト
  it('無効なmodeの場合は何も表示されない', () => {
    // @ts-expect-error: 無効なmodeを意図的にテスト
    setup({ mode: 'invalid-mode' });

    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
