import type { ScrollToTopButtonProps } from '@/components/elements/button/ScrollToTopButton';
import { render, screen } from '@testing-library/react';
import type { CategorySelectorProps, FashionItemListProps } from '../../../types';
import FashionItemsContents from '../FashionItemsContents';

const mockUseFashionItems = jest.fn();
const mockUseScroll = jest.fn();

// カスタムフックのモック
jest.mock('../../../hooks/useFashionItems', () => ({
  useFashionItems: () => mockUseFashionItems(),
}));

// useScrollフックをモック
jest.mock('@/hooks/utils/useScroll', () => ({
  useScroll: () => mockUseScroll(),
}));

// 子コンポーネントをモック
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
  beforeEach(() => {
    jest.clearAllMocks();
    // デフォルトのモック値を設定
    mockUseFashionItems.mockReturnValue({
      selectedCategory: '',
      filters: { sort: 'newest' },
      isPending: false,
      handleCategoryChange: jest.fn(),
      handleDelete: jest.fn(),
      handleUpdate: jest.fn(),
      handleFilterChange: jest.fn(),
      currentItems: [],
    });
    mockUseScroll.mockReturnValue({
      showScrollButton: false,
      scrollToTop: jest.fn(),
      elementRef: { current: document.createElement('div') },
    });
    // scrollIntoViewのモックを設定
    const mockScrollIntoView = jest.fn();
    Element.prototype.scrollIntoView = mockScrollIntoView;
  });

  it('renders correctly without category selected', () => {
    render(<FashionItemsContents />);
    expect(screen.getByTestId('category-selector')).toBeInTheDocument();
    expect(screen.queryByTestId('fashion-item-list')).not.toBeInTheDocument();
  });

  it('renders fashion item list when category is selected', () => {
    const mockScrollIntoView = jest.fn();
    Element.prototype.scrollIntoView = mockScrollIntoView;

    mockUseFashionItems.mockReturnValue({
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
    expect(screen.getByTestId('fashion-item-list')).toBeInTheDocument();
    expect(mockScrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'start',
    });
  });

  it('shows loading state when isPending is true', () => {
    mockUseFashionItems.mockReturnValue({
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
    expect(screen.getByTestId('fashion-item-list')).toBeInTheDocument();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('shows scroll button when triggered', () => {
    mockUseScroll.mockReturnValue({
      showScrollButton: true,
      scrollToTop: jest.fn(),
      elementRef: { current: document.createElement('div') },
    });

    render(<FashionItemsContents />);
    expect(screen.getByTestId('scroll-to-top')).toHaveStyle({ display: 'block' });
  });
});
