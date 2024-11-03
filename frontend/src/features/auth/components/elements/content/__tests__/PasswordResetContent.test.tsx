import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { passwordResetAPI } from '@/lib/api/authApi';
import { LOGIN_URL } from '@/utils/constants';
import PasswordResetConfirmPageContent from '../PasswordResetConfirmPageContent';

// モックの作成
const mockToast = jest.fn();
const mockPush = jest.fn();

jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: mockToast,
  }),
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
}));

jest.mock('@/lib/api/authApi', () => ({
  passwordResetAPI: jest.fn(),
}));

// テストデータ
const testProps = {
  uid: 'test-uid',
  token: 'test-token',
};

// テスト用の共通セットアップ
const setup = () => {
  const user = userEvent.setup();
  const utils = render(<PasswordResetConfirmPageContent {...testProps} />);
  return {
    user,
    ...utils,
  };
};

describe('PasswordResetConfirmPageContent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // 描画テスト
  describe('描画テスト', () => {
    it('必要な要素が正しく描画されていること', () => {
      setup();

      // タイトルと説明文の確認
      expect(screen.getByText('パスワード再設定')).toBeInTheDocument();
      expect(screen.getByText('新しいパスワードを入力してください。')).toBeInTheDocument();

      // フォーム要素の確認
      expect(screen.getAllByRole('password-input')).toHaveLength(2);
      expect(screen.getByText('新しいパスワード')).toBeInTheDocument();
      expect(screen.getByText('新しいパスワード（確認）')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '送信' })).toBeInTheDocument();
    });
  });

  // フォーム送信のテスト
  describe('フォーム送信テスト', () => {
    it('正しいパスワードで送信が成功すること', async () => {
      const { user } = setup();
      const [passwordInput, confirmInput] = screen.getAllByRole(
        'password-input',
      ) as HTMLInputElement[];
      const submitButton = screen.getByRole('button', { name: '送信' });

      // APIの成功レスポンスをモック
      (passwordResetAPI as jest.Mock).mockResolvedValueOnce({ success: true });

      // フォームの入力と送信
      await user.type(passwordInput, 'Password123!');
      await user.type(confirmInput, 'Password123!');
      await user.click(submitButton);

      // API呼び出しの確認
      await waitFor(() => {
        expect(passwordResetAPI).toHaveBeenCalledWith(testProps.uid, testProps.token, {
          password: 'Password123!',
          passwordConfirmation: 'Password123!',
        });
      });

      // トースト通知の確認
      expect(mockToast).toHaveBeenCalledWith({
        title: 'パスワードの再設定完了',
        description: 'ログイン画面に移動します。',
      });

      // ログインページへのリダイレクト確認
      expect(mockPush).toHaveBeenCalledWith(LOGIN_URL);
    });
  });

  // エラー処理のテスト
  describe('エラー処理テスト', () => {
    it('APIエラー時にエラーメッセージが表示されること', async () => {
      const { user } = setup();
      const [passwordInput, confirmInput] = screen.getAllByRole(
        'password-input',
      ) as HTMLInputElement[];
      const submitButton = screen.getByRole('button', { name: '送信' });

      // APIエラーをモック
      (passwordResetAPI as jest.Mock).mockRejectedValueOnce(
        new Error(JSON.stringify({ token: 'トークンが無効です。' })),
      );

      await user.type(passwordInput, 'Password123!');
      await user.type(confirmInput, 'Password123!');
      await user.click(submitButton);

      // エラーメッセージの確認
      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          title: 'エラー',
          description: 'トークンが無効です。',
          variant: 'destructive',
        });
      });
    });
  });
});
