import { MY_PAGE_URL } from '@/utils/constants';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import WelcomeAlert from '../WelcomeAlert';

// next-auth のモック
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
}));

// next/navigation のモック
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('WelcomeAlert', () => {
  // モックの初期設定
  const mockSession = {
    data: {
      user: {
        name: 'Test User',
        isNewUser: true,
      },
    },
    update: jest.fn(),
  };

  const mockRouter = {
    refresh: jest.fn(),
  };

  beforeEach(() => {
    // モックのリセットと設定
    jest.clearAllMocks();
    (useSession as jest.Mock).mockReturnValue(mockSession);
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  // 基本的なレンダリングテスト
  it('renders welcome message correctly', () => {
    render(<WelcomeAlert />);

    // タイトルの確認
    expect(screen.getByText('Virtual Closetへようこそ!')).toBeInTheDocument();

    // 説明文の確認
    expect(screen.getByText(/パーソナライズされた機能提供が可能になります。/)).toBeInTheDocument();

    // リンクの確認
    const link = screen.getByRole('link', { name: 'マイページ' });
    expect(link).toHaveAttribute('href', MY_PAGE_URL);
  });

  // クローズボタンの機能テスト
  it('handles close button click correctly', async () => {
    render(<WelcomeAlert />);

    // クローズボタンを見つけてクリック
    const closeButton = screen.getByRole('button', { name: 'Close welcome message' });

    await act(async () => {
      fireEvent.click(closeButton);
    });

    // セッション更新が呼ばれたことを確認
    expect(mockSession.update).toHaveBeenCalledWith({
      user: {
        name: 'Test User',
        isNewUser: false,
      },
    });

    // ルーターのリフレッシュが呼ばれたことを確認
    expect(mockRouter.refresh).toHaveBeenCalled();
  });

  // エラーハンドリングのテスト
  it('handles update session error correctly', async () => {
    // コンソールエラーのモック
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    // セッション更新時にエラーを投げるように設定
    mockSession.update.mockRejectedValueOnce(new Error('Update failed'));

    render(<WelcomeAlert />);

    const closeButton = screen.getByRole('button', { name: 'Close welcome message' });

    await act(async () => {
      fireEvent.click(closeButton);
    });

    // エラーログが出力されたことを確認
    expect(consoleSpy).toHaveBeenCalledWith('Error updating session:', expect.any(Error));

    consoleSpy.mockRestore();
  });

  // アクセシビリティテスト
  describe('accessibility', () => {
    it('has proper button aria-label', () => {
      render(<WelcomeAlert />);

      const closeButton = screen.getByRole('button', { name: 'Close welcome message' });
      expect(closeButton).toHaveAttribute('aria-label', 'Close welcome message');
    });

    it('maintains proper heading structure', () => {
      render(<WelcomeAlert />);

      const alert = screen.getByRole('alert');
      expect(alert).toBeInTheDocument();
    });

    it('has proper link text', () => {
      render(<WelcomeAlert />);

      const link = screen.getByRole('link', { name: 'マイページ' });
      expect(link).toHaveAccessibleName('マイページ');
    });
  });
});
