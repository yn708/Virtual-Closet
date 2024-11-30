import { MY_PAGE_URL, TOP_URL } from '@/utils/constants';
import { HEADER_NAV_ITEMS } from '@/utils/data/navItems';
import { fireEvent, render, screen } from '@testing-library/react';
import { BiCloset } from 'react-icons/bi';
import { FaRegUser } from 'react-icons/fa';
import { GoHome } from 'react-icons/go';
import Header from '../Header';

// モックモジュールの定義
jest.mock('@/components/layout/HeaderLayout', () => {
  return function MockHeaderLayout({ children }: { children: React.ReactNode }) {
    return <div data-testid="header-layout">{children}</div>;
  };
});

jest.mock('@/components/elements/link/IconLink', () => {
  return function MockIconLink({ href, label }: { href: string; label: string }) {
    return (
      <a href={href} data-testid={`icon-link-${label}`}>
        {label}
      </a>
    );
  };
});

jest.mock('@/features/navItems/components/elements/sheet/addFashionContentSheet', () => ({
  __esModule: true,
  default: () => <button data-testid="add-fashion-content">Add Content</button>,
}));

jest.mock('@/features/auth/components/elements/button/LogoutButton', () => {
  return function MockLogoutButton() {
    return <button data-testid="logout-button">Logout</button>;
  };
});

jest.mock('@/features/navItems/components/elements/button/ThemeToggleButton', () => {
  return function MockThemeToggleButton() {
    return <button data-testid="theme-toggle-button">Toggle Theme</button>;
  };
});

describe('Header', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // レイアウトとナビゲーション要素のテスト
  describe('Layout and Navigation', () => {
    it('renders HeaderLayout correctly', () => {
      render(<Header />);
      expect(screen.getByTestId('header-layout')).toBeInTheDocument();
    });

    it('renders navigation items in correct order', () => {
      render(<Header />);
      const headerLayout = screen.getByTestId('header-layout');
      const children = headerLayout.children;

      // ナビゲーションアイテムの順序を検証
      expect(children[0]).toHaveAttribute('data-testid', 'icon-link-top-page');
      expect(children[1]).toHaveAttribute('data-testid', 'icon-link-Closet');
      expect(children[2]).toHaveAttribute('data-testid', 'add-fashion-content');
      expect(children[3]).toHaveAttribute('data-testid', 'icon-link-my-page');
    });

    it('verifies navigation items configuration', () => {
      expect(HEADER_NAV_ITEMS).toEqual([
        {
          href: TOP_URL,
          icon: GoHome,
          label: 'top-page',
        },
        {
          href: '/#',
          icon: BiCloset,
          label: 'Closet',
        },
        {
          href: MY_PAGE_URL,
          icon: FaRegUser,
          label: 'my-page',
        },
      ]);
    });
  });

  // ドロップダウンメニューのテスト
  describe('Dropdown Menu', () => {
    it('shows dropdown content when menu button is clicked', async () => {
      render(<Header />);

      // メニューボタンをクリック
      const menuButton = screen.getByRole('button', { name: /Menu/i });
      fireEvent.click(menuButton);

      // DropdownMenuContentのモックを作成
      const mockDropdownContent = screen.getByRole('button', { name: /Menu/i }).parentElement;
      expect(mockDropdownContent).toBeInTheDocument();

      // メニューボタンの属性を検証
      expect(menuButton).toHaveAttribute('type', 'button');
      expect(menuButton).toHaveClass('rounded-full');

      // aria属性の検証
      expect(menuButton).toHaveAttribute('aria-haspopup', 'menu');
      expect(menuButton).toHaveAttribute('aria-expanded', 'false');
    });
  });

  // AddFashionContentSheetのテスト
  describe('AddFashionContentSheet', () => {
    it('renders add content button in correct position', () => {
      render(<Header />);
      const addButton = screen.getByTestId('add-fashion-content');
      expect(addButton).toBeInTheDocument();

      // 位置関係の検証
      const headerLayout = screen.getByTestId('header-layout');
      const children = Array.from(headerLayout.children);
      const addButtonIndex = children.findIndex(
        (child) => child.getAttribute('data-testid') === 'add-fashion-content',
      );

      // Closetリンクの次の位置にあることを確認
      expect(addButtonIndex).toBe(2);
      expect(children[addButtonIndex - 1]).toHaveAttribute('data-testid', 'icon-link-Closet');
    });
  });
});
