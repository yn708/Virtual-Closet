import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { signOut } from 'next-auth/react';
import LogoutButton from '../LogoutButton';

// next-auth/reactのモック
jest.mock('next-auth/react', () => ({
  signOut: jest.fn(),
}));

const mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

describe('LogoutButton', () => {
  // 各テストの前にモックをリセット
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // テスト終了後にconsole.errorのモックを解除
  afterAll(() => {
    mockConsoleError.mockRestore();
  });

  // ボタンの表示テスト
  it('should render logout button correctly', () => {
    render(<LogoutButton />);

    const logoutButton = screen.getByRole('button', { name: 'ログアウト' });
    expect(logoutButton).toBeInTheDocument();

    // IconButtonのpropsが正しく設定されているか確認
    expect(logoutButton).toHaveClass('w-full');
  });

  // ログアウト成功時のテスト
  it('should call signOut with correct params when clicked', async () => {
    render(<LogoutButton />);

    const logoutButton = screen.getByRole('button', { name: 'ログアウト' });
    await userEvent.click(logoutButton);

    expect(signOut).toHaveBeenCalledTimes(1);
    expect(signOut).toHaveBeenCalledWith({ callbackUrl: '/auth/login' });
  });

  // ログアウトエラー時のテスト
  it('should handle error when signOut fails', async () => {
    // signOutが失敗するようにモックを設定
    const mockError = new Error('Logout failed');
    (signOut as jest.Mock).mockRejectedValueOnce(mockError);

    render(<LogoutButton />);

    const logoutButton = screen.getByRole('button', { name: 'ログアウト' });
    await userEvent.click(logoutButton);

    // エラーがコンソールに出力されることを確認
    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith('ログアウト中にエラーが発生しました:', mockError);
    });
  });
});
