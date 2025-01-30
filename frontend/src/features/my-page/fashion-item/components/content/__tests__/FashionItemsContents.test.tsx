import type { FashionItem, FashionItemsContextValue } from '@/types';
import { render, screen } from '@testing-library/react';
import FashionItemsContents from '../FashionItemsContents';

// モックの型定義を正しく行う
const createMockContextValue = (
  overrides: Partial<FashionItemsContextValue> = {},
): FashionItemsContextValue => ({
  state: {
    categoryCache: {},
    selectedCategory: 'tops',
    filters: {
      category: '',
      status: '',
      season: [],
    },
    isInitialLoading: false,
    isLoadingMore: false,
    currentItems: [],
    ...overrides.state,
    hasMore: false,
    currentPage: 1,
  },
  handlers: {
    handleCategoryChange: jest.fn(),
    handleDelete: jest.fn(),
    handleUpdate: jest.fn(),
    handleFilterChange: jest.fn(),
    loadMore: jest.fn(),
    ...overrides.handlers,
  },
});

// コンテキストのモック
const mockContextValue = createMockContextValue();
jest.mock('@/context/FashionItemsContext', () => ({
  useFashionItems: () => mockContextValue,
}));

// 各コンポーネントのモック
jest.mock('@/features/my-page/common/components/layout/BaseScrollContentsLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="base-layout">{children}</div>
  ),
}));

jest.mock('@/features/my-page/common/components/contents/CategorySelector', () => ({
  __esModule: true,
  default: () => <div data-testid="category-selector" />,
}));

jest.mock('../HorizontalCategoryScroll', () => ({
  __esModule: true,
  default: () => <div data-testid="horizontal-category-scroll" />,
}));

jest.mock('../FashionItemList', () => ({
  __esModule: true,
  default: () => <div data-testid="fashion-item-list" />,
}));

describe('FashionItemsContents', () => {
  const defaultProps = {
    onSelectItem: jest.fn(),
    selectedItems: [] as FashionItem[],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // テスト前にデフォルトのモック値に戻す
    Object.assign(mockContextValue, createMockContextValue());
  });

  it('should render all components correctly', () => {
    render(<FashionItemsContents {...defaultProps} />);

    expect(screen.getByTestId('base-layout')).toBeInTheDocument();
    expect(screen.getByTestId('category-selector')).toBeInTheDocument();
    expect(screen.getByTestId('horizontal-category-scroll')).toBeInTheDocument();
    expect(screen.getByTestId('fashion-item-list')).toBeInTheDocument();
  });

  it('should not render category specific components when no category is selected', () => {
    // モック値を上書き
    Object.assign(
      mockContextValue,
      createMockContextValue({
        state: {
          selectedCategory: '',
          isInitialLoading: false,
          isLoadingMore: false,
          filters: {
            category: '',
            status: '',
            season: [],
          },
          categoryCache: {},
          currentItems: [],
          hasMore: false,
          currentPage: 1,
        },
      }),
    );

    render(<FashionItemsContents {...defaultProps} />);

    expect(screen.getByTestId('category-selector')).toBeInTheDocument();
    expect(screen.queryByTestId('horizontal-category-scroll')).not.toBeInTheDocument();
    expect(screen.queryByTestId('fashion-item-list')).not.toBeInTheDocument();
  });

  it('should show loading state correctly', () => {
    // モック値を上書き
    Object.assign(
      mockContextValue,
      createMockContextValue({
        state: {
          selectedCategory: 'tops',
          isInitialLoading: false,
          isLoadingMore: false,
          filters: {
            category: '',
            status: '',
            season: [],
          },
          categoryCache: {},
          currentItems: [],
          hasMore: false,
          currentPage: 1,
        },
      }),
    );

    render(<FashionItemsContents {...defaultProps} />);

    expect(screen.getByTestId('base-layout')).toBeInTheDocument();
  });

  it('should render without selection props', () => {
    render(<FashionItemsContents onSelectItem={undefined} selectedItems={undefined} />);

    expect(screen.getByTestId('base-layout')).toBeInTheDocument();
    expect(screen.getByTestId('category-selector')).toBeInTheDocument();
    expect(screen.getByTestId('horizontal-category-scroll')).toBeInTheDocument();
    expect(screen.getByTestId('fashion-item-list')).toBeInTheDocument();
  });
});
