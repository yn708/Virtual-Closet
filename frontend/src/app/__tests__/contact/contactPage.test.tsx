import ContactPage from '@/app/contact/page';
import StepContactForm from '@/features/contact/components/StepContactForm';
import { render, screen } from '@testing-library/react';
import { getServerSession } from 'next-auth';

// モックの設定
jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}));

// コンポーネントのモック
jest.mock('@/features/contact/components/StepContactForm', () => ({
  __esModule: true,
  default: jest.fn(({ isSession }) => (
    <div data-testid="mock-contact-form">Contact Form (isSession: {String(isSession)})</div>
  )),
}));

jest.mock('@/features/navItems/components/layout/Footer', () => ({
  __esModule: true,
  default: jest.fn(({ className }) => (
    <footer data-testid="mock-footer" className={className}>
      Footer Component
    </footer>
  )),
}));

describe('ContactPage', () => {
  // 各テスト前の共通処理
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('レイアウトとコンポーネントの表示', () => {
    it('必要な要素が全て表示されること', async () => {
      // 非認証状態をモック
      (getServerSession as jest.Mock).mockResolvedValue(null);

      // ページをレンダリング
      const page = await ContactPage();
      render(page);

      // メインコンテナの存在を確認
      const mainContainer = screen.getByRole('main');
      expect(mainContainer).toHaveClass('px-4 py-12 sm:px-6 lg:px-8');

      // ヘッダーテキストの確認
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('お問い合わせ');
      expect(screen.getByText(/ご質問・ご要望などございましたら/)).toBeInTheDocument();

      // フォームコンポーネントの確認
      expect(screen.getByTestId('mock-contact-form')).toBeInTheDocument();

      // フッターの確認
      const footer = screen.getByTestId('mock-footer');
      expect(footer).toBeInTheDocument();
      expect(footer).toHaveClass('mb-0');
    });
  });

  describe('認証状態による表示の違い', () => {
    it('非認証時にisSession=falseでフォームが表示されること', async () => {
      // 非認証状態をモック
      (getServerSession as jest.Mock).mockResolvedValue(null);

      // ページをレンダリング
      const page = await ContactPage();
      render(page);

      // フォームコンポーネントに正しいpropsが渡されているか確認
      expect(StepContactForm).toHaveBeenCalledWith(
        expect.objectContaining({ isSession: false }),
        expect.any(Object),
      );
    });

    it('認証時にisSession=trueでフォームが表示されること', async () => {
      // 認証状態をモック
      (getServerSession as jest.Mock).mockResolvedValue({
        user: { name: 'Test User' },
      });

      // ページをレンダリング
      const page = await ContactPage();
      render(page);

      // フォームコンポーネントに正しいpropsが渡されているか確認
      expect(StepContactForm).toHaveBeenCalledWith(
        expect.objectContaining({ isSession: true }),
        expect.any(Object),
      );
    });
  });

  describe('レスポンシブデザイン', () => {
    it('レスポンシブなクラスが適用されていること', async () => {
      // 非認証状態をモック
      (getServerSession as jest.Mock).mockResolvedValue(null);

      // ページをレンダリング
      const page = await ContactPage();
      render(page);

      // コンテナのレスポンシブクラスを確認
      const mainContainer = screen.getByRole('main');
      expect(mainContainer).toHaveClass('px-4', 'sm:px-6', 'lg:px-8');

      // 見出しのレスポンシブクラスを確認
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveClass('text-xl', 'sm:text-2xl');
    });
  });

  describe('アクセシビリティ', () => {
    it('適切なARIAロールと見出し構造があること', async () => {
      // 非認証状態をモック
      (getServerSession as jest.Mock).mockResolvedValue(null);

      // ページをレンダリング
      const page = await ContactPage();
      render(page);

      // mainタグの存在を確認
      expect(screen.getByRole('main')).toBeInTheDocument();

      // 見出しの階層構造を確認
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveTextContent('お問い合わせ');
    });
  });
});
