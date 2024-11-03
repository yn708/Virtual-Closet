import SignUpPage, { metadata } from '@/app/auth/sign-up/page';
import type { AuthPageTemplate } from '@/features/auth/types';
import type { BaseLinkProps, LabelType, TextType } from '@/types';

import { render, screen, within } from '@testing-library/react';

// モックのインポートを整理
jest.mock('next-auth/react', () => ({
  signIn: jest.fn(),
}));

// コンポーネントのモックを集約
const mockComponents = {
  socialAuthButtons: jest.fn(),
  emailSignUpButton: jest.fn(),
  linkWithText: jest.fn(),
  authPageTemplate: jest.fn(),
  legalTextContent: jest.fn(),
};

// モックの実装
jest.mock('@/features/auth/components/elements/button/SocialAuthButtons', () => ({
  __esModule: true,
  default: (props: TextType) => {
    mockComponents.socialAuthButtons(props);
    return (
      <div data-testid="social-auth-buttons">
        <button>Googleで{props.text}</button>
      </div>
    );
  },
}));

jest.mock('@/features/auth/components/elements/button/EmailSignUpButton', () => ({
  __esModule: true,
  default: () => {
    mockComponents.emailSignUpButton();
    return <button data-testid="email-signup-button">メールアドレスで登録</button>;
  },
}));

jest.mock('@/components/elements/link/LinkWithText', () => ({
  __esModule: true,
  default: (props: BaseLinkProps & TextType & LabelType) => {
    mockComponents.linkWithText(props);
    return (
      <a href={props.href} data-testid="link-with-text">
        {props.text} {props.label}
      </a>
    );
  },
}));

jest.mock('@/features/auth/components/layout/AuthPageTemplate', () => ({
  __esModule: true,
  default: (props: AuthPageTemplate) => {
    mockComponents.authPageTemplate(props);
    return (
      <div data-testid="auth-page-template">
        <h1>{props.title}</h1>
        <p>{props.description}</p>
        {props.subDescription}
        {props.children}
      </div>
    );
  },
}));

jest.mock('@/features/auth/components/elements/content/LegalTextContent', () => ({
  __esModule: true,
  default: () => {
    mockComponents.legalTextContent();
    return <div data-testid="legal-text-content">利用規約とプライバシーポリシー</div>;
  },
}));

describe('SignUpPage', () => {
  // テスト実行前の共通セットアップ
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // 各コンポーネントの期待値を定義
  const expectedProps = {
    title: '新規登録',
    description: 'アカウントを作成して、virtual closetを始めましょう。',
  };

  describe('レンダリングテスト', () => {
    it('AuthPageTemplateに正しいプロパティが渡されること', async () => {
      const Component = await SignUpPage();
      render(Component);

      expect(mockComponents.authPageTemplate).toHaveBeenCalledWith(
        expect.objectContaining({
          isReversed: true,
          title: expectedProps.title,
          description: expectedProps.description,
          subDescription: expect.any(Object),
        }),
      );
    });

    it('全ての認証ボタンが正しくレンダリングされること', async () => {
      const Component = await SignUpPage();
      render(Component);

      const socialButtons = screen.getByTestId('social-auth-buttons');
      expect(within(socialButtons).getByText(/Googleで登録/)).toBeInTheDocument();
      expect(screen.getByTestId('email-signup-button')).toBeInTheDocument();
    });

    it('法的文章が正しく表示されること', async () => {
      const Component = await SignUpPage();
      render(Component);

      expect(mockComponents.legalTextContent).toHaveBeenCalled();
      expect(screen.getByTestId('legal-text-content')).toBeInTheDocument();
    });
  });

  describe('ナビゲーションテスト', () => {
    it('ログインページへのリンクが正しく設定されていること', async () => {
      const Component = await SignUpPage();
      render(Component);

      const link = screen.getByTestId('link-with-text');
      expect(link).toHaveAttribute('href', '/auth/login');
      expect(mockComponents.linkWithText).toHaveBeenCalledWith(
        expect.objectContaining({
          text: 'すでにアカウントをお持ちの方は',
          label: 'ログイン',
          href: '/auth/login',
        }),
      );
    });
  });

  describe('メタデータテスト', () => {
    it('ページのメタデータが正しく設定されていること', () => {
      expect(metadata.title).toBe(expectedProps.title);
    });
  });
});
