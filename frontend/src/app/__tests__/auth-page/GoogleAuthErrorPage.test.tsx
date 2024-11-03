import GoogleAuthError from '@/app/auth/login/error/page';
import type { BaseLinkProps, LabelType, TextType } from '@/types';
import { CONTACT_URL, LOGIN_URL } from '@/utils/constants';
import { render, screen } from '@testing-library/react';

// 必要なモックの定義
jest.mock('@/components/elements/link/LinkWithText', () => ({
  __esModule: true,
  default: ({ text, label, href }: BaseLinkProps & TextType & LabelType) => (
    <a data-testid="link-with-text" href={href}>
      {text} {label}
    </a>
  ),
}));

jest.mock('react-icons/ci', () => ({
  CiCircleAlert: () => <div data-testid="error-icon">Error Icon</div>,
}));

describe('GoogleAuthError', () => {
  const expectedTexts = {
    errorMessage1: '認証中にエラーが発生しました。',
    errorMessage2: 'お手数ですが、もう一度お試しください。',
    loginText: 'ログイン画面に',
    loginLabel: '戻る',
    contactText: '問題が解決しない場合は、',
    contactLabel: 'お問い合わせ',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('レンダリングテスト', () => {
    it('エラーページの基本要素が正しくレンダリングされること', () => {
      render(<GoogleAuthError />);

      // エラーアイコンの確認
      expect(screen.getByTestId('error-icon')).toBeInTheDocument();

      // エラーメッセージの確認
      expect(screen.getByText(expectedTexts.errorMessage1)).toBeInTheDocument();
      expect(screen.getByText(expectedTexts.errorMessage2)).toBeInTheDocument();
    });

    it('全てのリンクが正しく設定されていること', () => {
      render(<GoogleAuthError />);

      const links = screen.getAllByTestId('link-with-text');

      // ログインページへのリンク
      expect(links[0]).toHaveAttribute('href', LOGIN_URL);
      expect(links[0]).toHaveTextContent(`${expectedTexts.loginText} ${expectedTexts.loginLabel}`);

      // お問い合わせページへのリンク
      expect(links[1]).toHaveAttribute('href', CONTACT_URL);
      expect(links[1]).toHaveTextContent(
        `${expectedTexts.contactText} ${expectedTexts.contactLabel}`,
      );
    });
  });

  describe('スタイリングテスト', () => {
    it('エラーページに適切なスタイリングが適用されていること', () => {
      const { container } = render(<GoogleAuthError />);
      const mainContainer = container.firstChild as HTMLElement;

      // コンテナのスタイリング確認
      const expectedClasses = [
        'min-h-screen',
        'flex',
        'flex-col',
        'items-center',
        'justify-center',
        'bg-gray-100',
        'p-20',
        'space-y-10',
      ];

      expectedClasses.forEach((className) => {
        expect(mainContainer).toHaveClass(className);
      });
    });

    it('エラーアイコンのスタイリングが適切であること', () => {
      render(<GoogleAuthError />);
      const errorIconContainer = screen.getByTestId('error-icon');

      expect(errorIconContainer.parentElement).toHaveClass(
        'flex',
        'items-center',
        'justify-center',
        'gap-4',
      );
    });
  });
});
