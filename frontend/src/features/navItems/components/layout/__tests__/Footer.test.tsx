import { APP_ABOUT_URL, CONTACT_URL } from '@/utils/constants';
import { FOOTER_NAV_ITEMS } from '@/utils/data/navItems';
import { render, screen } from '@testing-library/react';
import Footer from '../Footer';

// モックの作成
jest.mock('@/components/layout/FooterLayout', () => {
  return function MockFooterLayout({ children }: { children: React.ReactNode }) {
    return <div data-testid="footer-layout">{children}</div>;
  };
});

jest.mock('@/features/auth/components/elements/dialog/LegalDialog', () => {
  return {
    LegalDialog: ({ label, className }: { label: string; className: string }) => (
      <button className={className}>{label}</button>
    ),
  };
});

describe('Footer', () => {
  beforeEach(() => {
    // 各テストの前にモックをリセット
    jest.clearAllMocks();
  });

  // FooterLayoutが正しくレンダリングされることをテスト
  it('renders FooterLayout', () => {
    render(<Footer />);
    expect(screen.getByTestId('footer-layout')).toBeInTheDocument();
  });

  // フッターナビゲーションアイテムの内容と構造を検証
  it('renders correct footer navigation items with proper URLs', () => {
    render(<Footer />);

    // FOOTER_NAV_ITEMSの内容を検証
    expect(FOOTER_NAV_ITEMS).toEqual([
      { href: APP_ABOUT_URL, label: 'このサイトについて' },
      { href: CONTACT_URL, label: 'お問い合わせ' },
    ]);

    // 各ナビゲーションアイテムが正しくレンダリングされているか検証
    const aboutLink = screen.getByText('このサイトについて');
    const contactLink = screen.getByText('お問い合わせ');

    // リンクの存在確認
    expect(aboutLink).toBeInTheDocument();
    expect(contactLink).toBeInTheDocument();

    // リンクのURLが正しいか確認
    expect(aboutLink).toHaveAttribute('href', APP_ABOUT_URL);
    expect(contactLink).toHaveAttribute('href', CONTACT_URL);

    // ホバー時のスタイルクラスを確認
    expect(aboutLink).toHaveClass('hover:font-bold');
    expect(contactLink).toHaveClass('hover:font-bold');
  });

  // ナビゲーションリンクが正しい順序でレンダリングされることをテスト
  it('renders navigation links in correct order', () => {
    render(<Footer />);

    const navLinks = screen.getAllByRole('link');
    expect(navLinks[0]).toHaveTextContent('このサイトについて');
    expect(navLinks[1]).toHaveTextContent('お問い合わせ');
  });

  // 法的文書のダイアログボタンが正しくレンダリングされることをテスト
  it('renders legal document dialog buttons', () => {
    render(<Footer />);

    // プライバシーポリシーボタンのテスト
    const privacyButton = screen.getByText('プライバシーポリシー');
    expect(privacyButton).toBeInTheDocument();
    expect(privacyButton).toHaveClass(
      'h-auto',
      'text-gray-600',
      'dark:text-gray-300',
      'opacity-90',
      'p-0',
      'font-normal',
      'hover:font-bold',
      'hover:no-underline',
      'lg:text-sm',
      'text-xs',
    );

    // 利用規約ボタンのテスト
    const termsButton = screen.getByText('利用規約');
    expect(termsButton).toBeInTheDocument();
    expect(termsButton).toHaveClass(
      'h-auto',
      'text-gray-600',
      'dark:text-gray-300',
      'opacity-90',
      'p-0',
      'font-normal',
      'hover:font-bold',
      'hover:no-underline',
      'lg:text-sm',
      'text-xs',
    );
  });

  // コピーライトテキストが正しくレンダリングされることをテスト
  it('renders copyright text', () => {
    render(<Footer />);

    const copyright = screen.getByText('© 2024 Virtual Closet. All rights reserved.');
    expect(copyright).toBeInTheDocument();
    expect(copyright).toHaveClass('text-sm', 'opacity-70');
  });

  // レスポンシブデザインのクラスが正しく適用されていることをテスト
  it('has correct responsive classes for navigation', () => {
    render(<Footer />);

    const nav = screen.getByRole('navigation');
    expect(nav).toHaveClass(
      'flex',
      'sm:flex-row',
      'flex-col',
      'items-center',
      'gap-7',
      'text-xs',
      'lg:text-sm',
      'lg:m-0',
      'mb-10',
      'opacity-90',
    );
  });
});
