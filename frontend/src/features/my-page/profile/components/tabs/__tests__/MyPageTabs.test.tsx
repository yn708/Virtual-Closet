import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MyPageTabs from '../MyPageTabs';

// FashionItemsContentsのモック
jest.mock('@/features/my-page/fashion-item/components/content/FashionItemsContents', () => {
  return jest.fn(() => <div data-testid="mock-fashion-items">Fashion Items Content</div>);
});

// アイコンのモック
jest.mock('react-icons/lu', () => ({
  LuShirt: () => <div data-testid="mock-shirt-icon">Shirt Icon</div>,
}));

jest.mock('react-icons/bi', () => ({
  BiCloset: () => <div data-testid="mock-closet-icon">Closet Icon</div>,
}));

describe('MyPageTabs', () => {
  it('renders all tab triggers correctly', () => {
    render(<MyPageTabs />);

    // タブのラベルとアイコンが表示されているか確認
    expect(screen.getByText('アイテム')).toBeInTheDocument();
    expect(screen.getByText('コーディネート')).toBeInTheDocument();
    expect(screen.getByTestId('mock-shirt-icon')).toBeInTheDocument();
    expect(screen.getByTestId('mock-closet-icon')).toBeInTheDocument();
  });

  it('shows items content by default', () => {
    render(<MyPageTabs />);

    // デフォルトでアイテムのコンテンツが表示されているか確認
    expect(screen.getByTestId('mock-fashion-items')).toBeInTheDocument();
  });

  it('has correct styling for active tab', () => {
    render(<MyPageTabs />);

    // デフォルトで選択されているタブのスタイリングを確認
    const activeTab = screen.getByRole('tab', { name: /アイテム/i });
    expect(activeTab).toHaveAttribute('data-state', 'active');
  });

  it('switches content when clicking different tabs', async () => {
    const user = userEvent.setup();
    render(<MyPageTabs />);

    // コーディネートタブをクリック
    const coordinateTab = screen.getByRole('tab', { name: /コーディネート/i });
    await user.click(coordinateTab);

    // タブの状態が変更されているか確認
    expect(coordinateTab).toHaveAttribute('data-state', 'active');
    const itemsTab = screen.getByRole('tab', { name: /アイテム/i });
    expect(itemsTab).toHaveAttribute('data-state', 'inactive');
  });

  it('has accessible tab list', () => {
    render(<MyPageTabs />);

    // アクセシビリティの確認
    const tabList = screen.getByRole('tablist');
    expect(tabList).toBeInTheDocument();
    expect(tabList).toHaveAttribute('aria-orientation', 'horizontal');
  });
});
