import { APP_ABOUT_URL, CONTACT_URL, PRIVACY_URL, TERMS_URL } from '@/utils/constants';
import { FOOTER_NAV_ITEMS } from '@/utils/data/navItems';
import { render, screen } from '@testing-library/react';
import Footer from '../Footer';

// モックの作成
jest.mock('@/components/layout/FooterLayout', () => {
  return function MockFooterLayout({ children }: { children: React.ReactNode }) {
    return <div data-testid="footer-layout">{children}</div>;
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
      { href: APP_ABOUT_URL, label: 'はじめての方へ' },
      { href: CONTACT_URL, label: 'お問い合わせ' },
      { href: PRIVACY_URL, label: 'プライバシーポリシー' },
      { href: TERMS_URL, label: '利用規約' },
    ]);

    // 各ナビゲーションアイテムが正しくレンダリングされているか検証
    const aboutLink = screen.getByText('はじめての方へ');
    const contactLink = screen.getByText('お問い合わせ');
    const privacyLink = screen.getByText('プライバシーポリシー');
    const termsLink = screen.getByText('利用規約');

    // リンクの存在確認
    expect(aboutLink).toBeInTheDocument();
    expect(contactLink).toBeInTheDocument();
    expect(privacyLink).toBeInTheDocument();
    expect(termsLink).toBeInTheDocument();

    // リンクのURLが正しいか確認
    expect(aboutLink).toHaveAttribute('href', APP_ABOUT_URL);
    expect(contactLink).toHaveAttribute('href', CONTACT_URL);
    expect(privacyLink).toHaveAttribute('href', PRIVACY_URL);
    expect(termsLink).toHaveAttribute('href', TERMS_URL);

    // ホバー時のスタイルクラスを確認
    expect(aboutLink).toHaveClass('hover:font-bold');
    expect(contactLink).toHaveClass('hover:font-bold');
  });

  // ナビゲーションリンクが正しい順序でレンダリングされることをテスト
  it('renders navigation links in correct order', () => {
    render(<Footer />);

    const navLinks = screen.getAllByRole('link');
    expect(navLinks[0]).toHaveTextContent('はじめての方へ');
    expect(navLinks[1]).toHaveTextContent('お問い合わせ');
  });

  // コピーライトテキストが正しくレンダリングされることをテスト
  it('renders copyright text', () => {
    render(<Footer />);

    const copyright = screen.getByText('© 2024 Virtual Closet. All rights reserved.');
    expect(copyright).toBeInTheDocument();
    expect(copyright).toHaveClass('text-xs', 'opacity-70');
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
