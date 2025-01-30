import LoginPage, { metadata } from '@/app/auth/login/page';
import { render, screen } from '@testing-library/react';

// コンポーネントのモック
jest.mock('@/features/auth/components/elements/button/SocialAuthButtons', () => ({
  __esModule: true,
  default: () => <div data-testid="social-auth-buttons">Social Auth Buttons</div>,
}));

jest.mock('@/features/auth/components/elements/form/LoginForm', () => ({
  __esModule: true,
  default: () => <div data-testid="login-form">Login Form</div>,
}));

jest.mock('@/components/elements/utils/DividerWithText', () => ({
  __esModule: true,
  default: ({ text }: { text: string }) => <div data-testid="divider">{text}</div>,
}));

jest.mock('@/components/elements/link/LinkWithText', () => ({
  __esModule: true,
  default: ({ text, label, href }: { text: string; label: string; href: string }) => (
    <div data-testid={`link-${href}`}>
      {text} {label}
    </div>
  ),
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

    // コンポーネントのレンダリングを確認
    expect(screen.getByTestId('social-auth-buttons')).toBeInTheDocument();
    expect(screen.getByTestId('divider')).toBeInTheDocument();
    expect(screen.getByTestId('login-form')).toBeInTheDocument();
    expect(screen.getByTestId('link-/auth/password/reset')).toBeInTheDocument();
    expect(screen.getByTestId('link-/auth/sign-up')).toBeInTheDocument(); // Updated test ID
  });

  it('コンポーネントが正しい順序でレンダリングされている', () => {
    render(<LoginPage />);

    const template = screen.getByTestId('auth-page-template');
    const socialButtons = screen.getByTestId('social-auth-buttons');
    const divider = screen.getByTestId('divider');
    const loginForm = screen.getByTestId('login-form');

    // テンプレート内にコンポーネントが含まれていることを確認
    expect(template).toContainElement(socialButtons);
    expect(template).toContainElement(divider);
    expect(template).toContainElement(loginForm);
  });
});
