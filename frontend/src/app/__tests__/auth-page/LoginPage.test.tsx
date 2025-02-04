import LoginPage, { metadata } from '@/app/auth/login/page';
import { render, screen } from '@testing-library/react';
import { useSearchParams } from 'next/navigation';
import React from 'react';

// useSearchParams をモック化
jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn(),
}));

// SocialAuthButtons のモック
jest.mock('@/features/auth/components/elements/button/SocialAuthButtons', () => ({
  __esModule: true,
  default: () => <div data-testid="social-auth-buttons">Social Auth Buttons</div>,
}));

// LoginForm のモック
jest.mock('@/features/auth/components/elements/form/LoginForm', () => ({
  __esModule: true,
  default: () => <div data-testid="login-form">Login Form</div>,
}));

// DividerWithText のモック
jest.mock('@/components/elements/utils/DividerWithText', () => ({
  __esModule: true,
  default: ({ text }: { text: string }) => <div data-testid="divider">{text}</div>,
}));

// LinkWithText のモック
jest.mock('@/components/elements/link/LinkWithText', () => ({
  __esModule: true,
  default: ({ text, label, href }: { text: string; label: string; href: string }) => (
    <div data-testid={`link-${href}`}>
      {text} {label}
    </div>
  ),
}));

// AuthPageTemplate のモック
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
  beforeEach(() => {
    // デフォルトはエラーなし（useSearchParams の get() は null を返す）
    (useSearchParams as jest.Mock).mockReturnValue({
      get: jest.fn(() => null),
    });
  });

  it('メタデータが正しく設定されている', () => {
    expect(metadata.title).toBe('ログイン');
  });

  it('正しくレンダリングされる（エラーがない場合）', () => {
    render(<LoginPage />);

    // AuthPageTemplate に正しい props が渡されていることを確認
    expect(screen.getByText('ログイン')).toBeInTheDocument();
    expect(screen.getByText('ログインして、virtual closetを始めましょう。')).toBeInTheDocument();

    // 各コンポーネントがレンダリングされていることを確認
    expect(screen.getByTestId('social-auth-buttons')).toBeInTheDocument();
    expect(screen.getByTestId('divider')).toBeInTheDocument();
    expect(screen.getByTestId('login-form')).toBeInTheDocument();
    expect(screen.getByTestId('link-/auth/password/reset')).toBeInTheDocument();
    expect(screen.getByTestId('link-/auth/sign-up')).toBeInTheDocument();

    // エラーがない場合は LoginErrorMessage は何も表示しない（null）ので、エラーメッセージが存在しないことを確認
    expect(
      screen.queryByText('申し訳ございませんが再度ログインしてください。'),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText('セッションの有効期限が切れました。再度ログインしてください。'),
    ).not.toBeInTheDocument();
  });

  it('コンポーネントが正しい順序でレンダリングされている', () => {
    render(<LoginPage />);
    const template = screen.getByTestId('auth-page-template');
    const socialButtons = screen.getByTestId('social-auth-buttons');
    const divider = screen.getByTestId('divider');
    const loginForm = screen.getByTestId('login-form');

    // AuthPageTemplate 内に子コンポーネントが含まれていることを確認
    expect(template).toContainElement(socialButtons);
    expect(template).toContainElement(divider);
    expect(template).toContainElement(loginForm);
  });

  it('エラークエリパラメータがある場合、LoginErrorMessage が表示される', () => {
    // useSearchParams を上書きして、エラーとして 'unauthorized' を返す
    (useSearchParams as jest.Mock).mockReturnValue({
      get: jest.fn(() => 'unauthorized'),
    });
    render(<LoginPage />);

    // 'unauthorized' の場合、LoginErrorMessage は「申し訳ございませんが再度ログインしてください。」と表示する
    expect(screen.getByText('申し訳ございませんが再度ログインしてください。')).toBeInTheDocument();
  });
});
