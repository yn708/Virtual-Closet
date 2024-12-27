import { render, screen } from '@testing-library/react';
import MyPageTabs from '../MyPageTabs';

// FashionItemsProviderのモック
jest.mock('@/context/FashionItemsContext', () => ({
  FashionItemsProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="fashion-items-provider">{children}</div>
  ),
}));

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

// shadcn/ui tabsのモック
jest.mock('@/components/ui/tabs', () => ({
  Tabs: ({
    children,
    defaultValue,
    className,
  }: {
    children: React.ReactNode;
    defaultValue: string;
    className?: string;
  }) => (
    <div data-testid="tabs" data-default-value={defaultValue} className={className}>
      {children}
    </div>
  ),
  TabsList: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div data-testid="tabs-list" role="tablist" aria-orientation="horizontal" className={className}>
      {children}
    </div>
  ),
  TabsTrigger: ({
    children,
    value,
    className,
    'data-state': dataState,
  }: {
    children: React.ReactNode;
    value: string;
    className?: string;
    'data-state'?: 'active' | 'inactive';
  }) => (
    <button
      data-testid={`tab-trigger-${value}`}
      role="tab"
      data-state={dataState || 'inactive'}
      className={className}
    >
      {children}
    </button>
  ),
  TabsContent: ({ children, value }: { children: React.ReactNode; value: string }) => (
    <div data-testid={`tabs-content-${value}`} role="tabpanel">
      {children}
    </div>
  ),
}));

describe('MyPageTabs', () => {
  it('タブトリガーが正しくレンダリングされること', () => {
    render(<MyPageTabs />);

    expect(screen.getByText('アイテム')).toBeInTheDocument();
    expect(screen.getByText('コーディネート')).toBeInTheDocument();
    expect(screen.getByTestId('mock-shirt-icon')).toBeInTheDocument();
    expect(screen.getByTestId('mock-closet-icon')).toBeInTheDocument();
  });

  it('デフォルトでアイテムタブのコンテンツが表示されること', () => {
    render(<MyPageTabs />);

    // FashionItemsProviderとそのコンテンツが表示されているか確認
    expect(screen.getByTestId('fashion-items-provider')).toBeInTheDocument();
    expect(screen.getByTestId('mock-fashion-items')).toBeInTheDocument();
  });

  it('タブの構造とスタイリングが正しいこと', () => {
    render(<MyPageTabs />);

    // Tabsコンポーネントの基本構造を確認
    const tabs = screen.getByTestId('tabs');
    expect(tabs).toHaveAttribute('data-default-value', 'items');
    expect(tabs).toHaveClass('w-full m-0');

    // TabsListのスタイリングを確認
    const tabsList = screen.getByTestId('tabs-list');
    expect(tabsList).toHaveClass(
      'w-full justify-around bg-transparent border-b-2 py-5 rounded-none shadow',
    );
  });

  it('タブトリガーが適切なスタイリングを持つこと', () => {
    render(<MyPageTabs />);

    const itemsTab = screen.getByTestId('tab-trigger-items');
    expect(itemsTab).toHaveClass('gap-2 px-4 py-2.5 text-sm text-gray-500');
  });

  it('各タブのコンテンツが正しく配置されていること', () => {
    render(<MyPageTabs />);

    // itemsタブのコンテンツ確認
    const itemsContent = screen.getByTestId('tabs-content-items');
    expect(itemsContent).toBeInTheDocument();
    expect(itemsContent).toHaveAttribute('role', 'tabpanel');

    // coordinateタブのコンテンツ確認
    const coordinateContent = screen.getByTestId('tabs-content-coordinate');
    expect(coordinateContent).toBeInTheDocument();
    expect(coordinateContent).toHaveAttribute('role', 'tabpanel');
  });

  it('アクセシビリティ要件を満たしていること', () => {
    render(<MyPageTabs />);

    const tabList = screen.getByRole('tablist');
    expect(tabList).toHaveAttribute('aria-orientation', 'horizontal');

    const tabs = screen.getAllByRole('tab');
    expect(tabs).toHaveLength(2); // アイテムとコーディネートの2つのタブ

    const tabPanels = screen.getAllByRole('tabpanel');
    expect(tabPanels).toHaveLength(2); // 両方のタブのコンテンツパネル
  });
});
