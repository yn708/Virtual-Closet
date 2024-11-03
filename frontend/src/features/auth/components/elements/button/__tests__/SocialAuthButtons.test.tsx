import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { signIn } from 'next-auth/react';
import SocialAuthButtons from '../SocialAuthButtons';

// next-auth/reactのモック
jest.mock('next-auth/react', () => ({
  signIn: jest.fn(),
}));

// console.errorのモック
const mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

describe('SocialAuthButtons', () => {
  // テストごとにモックをリセット
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // テスト終了後にconsole.errorのモックを解除
  afterAll(() => {
    mockConsoleError.mockRestore();
  });

  // ボタンの表示テスト
  it('should render social auth buttons correctly', () => {
    render(<SocialAuthButtons text="登録" />);

    // Googleボタンが表示されているか確認
    const googleButton = screen.getByRole('button', { name: 'Googleで登録' });
    expect(googleButton).toBeInTheDocument();
    expect(googleButton).toHaveClass('w-full', 'rounded-3xl', 'p-5');
  });

  // 異なるテキストでの表示テスト
  it('should render buttons with different text props', () => {
    render(<SocialAuthButtons text="ログイン" />);

    expect(screen.getByRole('button', { name: 'Googleでログイン' })).toBeInTheDocument();
  });

  // サインイン機能のテスト
  it('should call signIn with correct parameters when clicked', async () => {
    render(<SocialAuthButtons text="登録" />);

    const googleButton = screen.getByRole('button', { name: 'Googleで登録' });
    await userEvent.click(googleButton);

    expect(signIn).toHaveBeenCalledTimes(1);
    expect(signIn).toHaveBeenCalledWith('google', {
      callbackUrl: '/top',
    });
  });

  // エラーハンドリングのテスト
  it('should handle sign in error correctly', async () => {
    // signInが失敗するようにモックを設定
    const mockError = new Error('Sign in failed');
    (signIn as jest.Mock).mockRejectedValueOnce(mockError);

    render(<SocialAuthButtons text="登録" />);

    const googleButton = screen.getByRole('button', { name: 'Googleで登録' });
    await userEvent.click(googleButton);

    // エラーがコンソールに出力されることを確認
    expect(console.error).toHaveBeenCalledWith(mockError);
  });
});
