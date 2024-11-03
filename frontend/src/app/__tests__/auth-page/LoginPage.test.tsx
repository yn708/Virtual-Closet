import LoginPage, { metadata } from '@/app/auth/login/page';

import { render, screen } from '@testing-library/react';

// コンポーネントのモック
jest.mock('@/features/auth/components/elements/content/LoginPageContent', () => ({
  __esModule: true,
  default: () => <div data-testid="login-page-content">Login Page Content</div>,
}));

jest.mock('@/features/auth/components/layout/AuthPageTemplate', () => ({
  __esModule: true,
  default: ({
    children,
    title,
    description,
  }: {
    children: React.ReactNode;
    title: string;
    description: string;
  }) => (
    <div data-testid="auth-page-template">
      <h1>{title}</h1>
      <p>{description}</p>
      {children}
    </div>
  ),
}));

describe('LoginPage', () => {
  it('メタデータが正しく設定されている', () => {
    expect(metadata.title).toBe('ログイン');
  });

  it('正しくレンダリングされる', () => {
    render(<LoginPage />);

    // AuthPageTemplate に正しいpropsが渡されていることを確認
    expect(screen.getByText('ログイン')).toBeInTheDocument();
    expect(screen.getByText('ログインして、virtual closetを始めましょう。')).toBeInTheDocument();

    // LoginPageContent がレンダリングされていることを確認
    expect(screen.getByTestId('login-page-content')).toBeInTheDocument();
  });

  it('AuthPageTemplateとLoginPageContentが正しい順序でレンダリングされている', () => {
    render(<LoginPage />);

    const template = screen.getByTestId('auth-page-template');
    const content = screen.getByTestId('login-page-content');

    expect(template).toContainElement(content);
  });
});
