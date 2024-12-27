import type { ScrollToTopButtonProps } from '@/components/elements/button/ScrollToTopButton';
import { useFashionItems } from '@/context/FashionItemsContext';
import { useScroll } from '@/hooks/utils/useScroll';
import { render, screen } from '@testing-library/react';
import type { CategorySelectorProps, FashionItemListProps } from '../../../types';
import FashionItemsContents from '../FashionItemsContents';

// カスタムフックのモック
jest.mock('@/context/FashionItemsContext', () => ({
  useFashionItems: jest.fn(),
}));

jest.mock('@/hooks/utils/useScroll', () => ({
  useScroll: jest.fn(),
}));

// UIコンポーネントのモック
jest.mock('@/components/ui/scroll-area', () => ({
  ScrollArea: ({
    children,
    className,
    ref,
  }: {
    children: React.ReactNode;
    className?: string;
    ref?: React.RefObject<HTMLDivElement>;
  }) => (
    <div data-testid="scroll-area" className={className} ref={ref}>
      <div
        data-testid="scroll-viewport"
        data-radix-scroll-area-viewport
        style={{ width: '1000px' }}
      >
        {children}
      </div>
    </div>
  ),
  ScrollBar: ({ orientation }: { orientation: 'horizontal' | 'vertical' }) => (
    <div data-testid="scroll-bar" data-orientation={orientation} />
  ),
}));

jest.mock('@/components/ui/button', () => ({
  Button: ({
    children,
    onClick,
    variant,
    className,
    ref,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    variant?: string;
    className?: string;
    ref?: React.Ref<HTMLButtonElement>;
  }) => (
    <button
      data-testid="category-button"
      onClick={onClick}
      data-variant={variant}
      className={className}
      ref={ref}
    >
      {children}
    </button>
  ),
}));

// 子コンポーネントのモック
jest.mock('../CategorySelector', () => {
  return function MockCategorySelector({
    onCategoryChange,
    selectedCategory,
  }: CategorySelectorProps) {
    return (
      <div data-testid="category-selector">
        <select
          data-testid="category-select"
          value={selectedCategory || ''}
          onChange={(e) => onCategoryChange(e.target.value)}
        >
          <option value="">選択してください</option>
          <option value="tops">トップス</option>
        </select>
      </div>
    );
  };
});

jest.mock('../FashionItemList', () => {
  return function MockFashionItemList({ items, isLoading }: FashionItemListProps) {
    return (
      <div data-testid="fashion-item-list">
        {isLoading ? 'Loading...' : `${items.length} items`}
      </div>
    );
  };
});

jest.mock('@/components/elements/button/ScrollToTopButton', () => {
  return function MockScrollToTopButton({ show, onClick }: ScrollToTopButtonProps) {
    return (
      <button
        data-testid="scroll-to-top"
        onClick={onClick}
        style={{ display: show ? 'block' : 'none' }}
      >
        トップへ戻る
      </button>
    );
  };
});

describe('FashionItemsContents', () => {
  const mockScrollIntoView = jest.fn();
  const mockScrollTo = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    // デフォルトのモック値を設定
    (useFashionItems as jest.Mock).mockReturnValue({
      selectedCategory: '',
      filters: { sort: 'newest' },
      isPending: false,
      handleCategoryChange: jest.fn(),
      handleDelete: jest.fn(),
      handleUpdate: jest.fn(),
      handleFilterChange: jest.fn(),
      currentItems: [],
    });

    (useScroll as jest.Mock).mockReturnValue({
      showScrollButton: false,
      scrollToTop: jest.fn(),
      elementRef: { current: document.createElement('div') },
    });

    // DOMメソッドのモック
    Element.prototype.scrollIntoView = mockScrollIntoView;
    Element.prototype.scrollTo = mockScrollTo;
    Element.prototype.getBoundingClientRect = () => ({
      width: 1000,
      height: 100,
      top: 0,
      left: 0,
      right: 1000,
      bottom: 100,
      x: 0,
      y: 0,
      toJSON: () => {},
    });
  });

  it('初期状態で正しくレンダリングされること', () => {
    render(<FashionItemsContents />);
    expect(screen.getByTestId('category-selector')).toBeInTheDocument();
    expect(screen.queryByTestId('fashion-item-list')).not.toBeInTheDocument();
  });

  it('カテゴリー選択時にスクロールエリアとアイテムリストが表示されること', () => {
    (useFashionItems as jest.Mock).mockReturnValue({
      selectedCategory: 'tops',
      filters: { sort: 'newest' },
      isPending: false,
      handleCategoryChange: jest.fn(),
      handleDelete: jest.fn(),
      handleUpdate: jest.fn(),
      handleFilterChange: jest.fn(),
      currentItems: [],
    });

    render(<FashionItemsContents />);

    expect(screen.getByTestId('scroll-area')).toBeInTheDocument();
    expect(screen.getByTestId('fashion-item-list')).toBeInTheDocument();
    expect(mockScrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'start',
    });
  });

  it('ローディング状態が正しく表示されること', () => {
    (useFashionItems as jest.Mock).mockReturnValue({
      selectedCategory: 'tops',
      filters: { sort: 'newest' },
      isPending: true,
      handleCategoryChange: jest.fn(),
      handleDelete: jest.fn(),
      handleUpdate: jest.fn(),
      handleFilterChange: jest.fn(),
      currentItems: [],
    });

    render(<FashionItemsContents />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.getByTestId('fashion-item-list').parentElement).toHaveClass('opacity-50');
  });

  it('スクロールボタンの表示制御が正しく動作すること', () => {
    (useScroll as jest.Mock).mockReturnValue({
      showScrollButton: true,
      scrollToTop: jest.fn(),
      elementRef: { current: document.createElement('div') },
    });

    render(<FashionItemsContents />);
    expect(screen.getByTestId('scroll-to-top')).toHaveStyle({ display: 'block' });
  });
});
