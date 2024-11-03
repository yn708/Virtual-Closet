import PasswordResetContent from '@/features/auth/components/elements/content/PasswordResetConfirmPageContent';
import { render, screen } from '@testing-library/react';
import NewPasswordPage, { metadata } from '../../auth/password/reset/[uid]/[token]/page';

// PasswordResetContentコンポーネントをモック
jest.mock('@/features/auth/components/elements/content/PasswordResetConfirmPageContent', () => {
  return jest.fn(({ uid, token }) => (
    <div data-testid="mocked-password-reset-content">
      <div data-testid="uid">{uid}</div>
      <div data-testid="token">{token}</div>
    </div>
  ));
});

describe('NewPasswordPage', () => {
  // テストで使用するモックパラメータ
  const mockParams = {
    uid: 'test-user-id',
    token: 'test-reset-token',
  };

  beforeEach(() => {
    // 各テストの前にモックをクリア
    jest.clearAllMocks();
  });

  it('正しくレンダリングされ、パラメータが適切に渡されること', () => {
    render(<NewPasswordPage params={mockParams} />);

    // コンポーネントが表示されていることを確認
    const content = screen.getByTestId('mocked-password-reset-content');
    expect(content).toBeInTheDocument();

    // パラメータが正しく渡されていることを確認
    expect(screen.getByTestId('uid')).toHaveTextContent(mockParams.uid);
    expect(screen.getByTestId('token')).toHaveTextContent(mockParams.token);
  });

  it('PasswordResetContentに正しいpropsが渡されること', () => {
    render(<NewPasswordPage params={mockParams} />);

    // PasswordResetContentが正しいpropsで呼び出されたことを確認
    expect(PasswordResetContent).toHaveBeenCalledWith(
      {
        uid: mockParams.uid,
        token: mockParams.token,
      },
      expect.any(Object), // Reactの内部props用
    );
    expect(PasswordResetContent).toHaveBeenCalledTimes(1);
  });

  it('異なるパラメータでも正しく動作すること', () => {
    const differentParams = {
      uid: 'different-user',
      token: 'different-token',
    };

    render(<NewPasswordPage params={differentParams} />);

    // 異なるパラメータでも正しく渡されることを確認
    expect(screen.getByTestId('uid')).toHaveTextContent(differentParams.uid);
    expect(screen.getByTestId('token')).toHaveTextContent(differentParams.token);
  });

  it('ページのメタデータが正しく設定されていること', () => {
    expect(metadata.title).toBe('パスワード再設定');
  });
});
