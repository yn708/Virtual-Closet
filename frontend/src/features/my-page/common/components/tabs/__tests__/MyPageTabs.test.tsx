import { render, screen } from '@testing-library/react';
import MyPageTabs from '../MyPageTabs';

// コンテンツコンポーネントのモック
jest.mock('@/features/my-page/coordinate/components/content/CoordinateContents', () => {
  return jest.fn(() => <div data-testid="coordinate-contents">CoordinateContents</div>);
});

jest.mock('@/features/my-page/fashion-item/components/content/FashionItemsContents', () => {
  return jest.fn(() => <div data-testid="fashion-items-contents">FashionItemsContents</div>);
});

// FashionItemsProviderのモック
jest.mock('@/context/FashionItemsContext', () => ({
  FashionItemsProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="fashion-items-provider">{children}</div>
  ),
}));

// shadcn/uiのタブコンポーネントのモック
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
    <div data-testid="tabs-list" className={className}>
      {children}
    </div>
  ),
  TabsTrigger: ({
    children,
    value,
    className,
    onClick,
  }: {
    children: React.ReactNode;
    value: string;
    className?: string;
    onClick?: () => void;
  }) => (
    <button data-testid={`tab-trigger-${value}`} className={className} onClick={onClick}>
      {children}
    </button>
  ),
  TabsContent: ({
    children,
    value,
    className,
  }: {
    children: React.ReactNode;
    value: string;
    className?: string;
  }) => (
    <div data-testid={`tab-content-${value}`} className={className}>
      {children}
    </div>
  ),
}));

describe('MyPageTabs', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('すべてのタブトリガーが正しくレンダリングされること', () => {
    render(<MyPageTabs />);
    expect(screen.getByTestId('tab-trigger-coordinate')).toBeInTheDocument();
    expect(screen.getByTestId('tab-trigger-items')).toBeInTheDocument();
    expect(screen.getByText('コーディネート')).toBeInTheDocument();
    expect(screen.getByText('アイテム')).toBeInTheDocument();
  });

  it('タブコンテンツが正しくレンダリングされること', () => {
    render(<MyPageTabs />);
    expect(screen.getByTestId('tab-content-coordinate')).toBeInTheDocument();
    expect(screen.getByTestId('tab-content-items')).toBeInTheDocument();
  });

  it('アイテムタブでFashionItemsProviderが使用されていること', () => {
    render(<MyPageTabs />);
    expect(screen.getByTestId('fashion-items-provider')).toBeInTheDocument();
  });

  it('コンテンツコンポーネントが正しくレンダリングされること', () => {
    render(<MyPageTabs />);
    expect(screen.getByTestId('coordinate-contents')).toBeInTheDocument();
    expect(screen.getByTestId('fashion-items-contents')).toBeInTheDocument();
  });

  it('デフォルトでコーディネートタブが選択されていること', () => {
    render(<MyPageTabs />);
    expect(screen.getByTestId('tabs')).toHaveAttribute('data-default-value', 'coordinate');
  });

  it('タブリストが適切なスタイリングクラスを持つこと', () => {
    render(<MyPageTabs />);
    const tabsList = screen.getByTestId('tabs-list');
    expect(tabsList.className).toContain('w-full');
    expect(tabsList.className).toContain('justify-around');
    expect(tabsList.className).toContain('bg-transparent');
    expect(tabsList.className).toContain('border-b-2');
    expect(tabsList.className).toContain('py-5');
    expect(tabsList.className).toContain('rounded-none');
    expect(tabsList.className).toContain('shadow-md');
  });

  it('タブトリガーが適切なスタイリングクラスを持つこと', () => {
    render(<MyPageTabs />);
    const coordinateTab = screen.getByTestId('tab-trigger-coordinate');
    expect(coordinateTab.className).toContain('gap-2');
    expect(coordinateTab.className).toContain('px-4');
    expect(coordinateTab.className).toContain('py-2.5');
    expect(coordinateTab.className).toContain('text-sm');
    expect(coordinateTab.className).toContain('text-gray-500');
  });

  it('TabsContentが正しいマージン設定を持つこと', () => {
    render(<MyPageTabs />);
    const coordinateContent = screen.getByTestId('tab-content-coordinate');
    const itemsContent = screen.getByTestId('tab-content-items');

    expect(coordinateContent.className).toContain('m-0');
    expect(itemsContent.className).toContain('m-0');
  });
});
