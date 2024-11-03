import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { sendPasswordResetAPI } from '@/lib/api/authApi';
import PasswordResetPageContent from '../PasswordResetPageContent';

// トースト通知のモックを作成
const mockToast = jest.fn();
jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: mockToast,
  }),
}));

// Next.jsのrouterをモック
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// APIをモック
jest.mock('@/lib/api/authApi', () => ({
  sendPasswordResetAPI: jest.fn(),
}));

// テスト用の共通セットアップ
const setup = () => {
  const user = userEvent.setup();
  const utils = render(<PasswordResetPageContent />);
  return {
    user,
    ...utils,
  };
};

describe('PasswordResetPageContent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // 正常系のテスト
  describe('描画テスト', () => {
    it('必要な要素が正しく描画されていること', () => {
      setup();

      // タイトルと説明文の確認
      expect(screen.getByText('パスワード再設定')).toBeInTheDocument();
      expect(screen.getByText('登録済みのメールアドレスを入力してください。')).toBeInTheDocument();
      expect(screen.getByText('パスワード再設定用のURLを通知いたします。')).toBeInTheDocument();

      // フォーム要素の確認
      expect(screen.getByRole('text-input')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '送信' })).toBeInTheDocument();

      // リンクの確認
      expect(screen.getByText('ログインに戻る')).toBeInTheDocument();
    });
  });

  // フォーム送信のテスト
  describe('フォーム送信テスト', () => {
    it('正しいメールアドレスで送信が成功すること', async () => {
      const { user } = setup();
      const emailInput = screen.getByRole('text-input') as HTMLInputElement;
      const submitButton = screen.getByRole('button', { name: '送信' });

      // APIの成功レスポンスをモック
      (sendPasswordResetAPI as jest.Mock).mockResolvedValueOnce({ success: true });

      // フォームの入力と送信
      await user.type(emailInput, 'test@example.com');
      await user.click(submitButton);

      // API呼び出しの確認
      await waitFor(() => {
        expect(sendPasswordResetAPI).toHaveBeenCalledWith({
          email: 'test@example.com',
        });
      });
    });
  });

  // エラー処理のテスト
  describe('エラー処理テスト', () => {
    it('APIエラー時にエラーメッセージが表示されること', async () => {
      const { user } = setup();

      // APIエラーをモック
      (sendPasswordResetAPI as jest.Mock).mockRejectedValueOnce(
        new Error(JSON.stringify({ email: ['このメールアドレスは登録されていません。'] })),
      );

      const emailInput = screen.getByRole('text-input') as HTMLInputElement;
      const submitButton = screen.getByRole('button', { name: '送信' });

      await user.type(emailInput, 'notfound@example.com');
      await user.click(submitButton);

      // エラーメッセージの確認
      await waitFor(() => {
        expect(screen.getByText('このメールアドレスは登録されていません。')).toBeInTheDocument();
      });
    });

    it('送信成功時にトースト通知が表示されること', async () => {
      const { user } = setup();
      const emailInput = screen.getByRole('text-input') as HTMLInputElement;
      const submitButton = screen.getByRole('button', { name: '送信' });

      // APIの成功レスポンスをモック
      (sendPasswordResetAPI as jest.Mock).mockResolvedValueOnce({ success: true });

      await user.type(emailInput, 'success@example.com');
      await user.click(submitButton);

      // トースト通知の確認
      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          title: 'メールアドレス宛にパスワード再設定用のURLを送信しました。',
          description: 'ご確認をよろしくお願いします。',
        });
      });
    });
  });
});
