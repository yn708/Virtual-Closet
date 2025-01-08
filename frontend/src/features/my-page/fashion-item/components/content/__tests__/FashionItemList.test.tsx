import type { FashionItem, FashionItemsContextValue } from '@/types';
import { fireEvent, render, screen } from '@testing-library/react';
import FashionItemList from '../FashionItemList';

// Next/Imageのモック
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({
    src,
    alt,
    ...props
  }: { src: string; alt: string } & React.ImgHTMLAttributes<HTMLImageElement>) => (
    <img src={src} alt={alt} {...props} />
  ),
}));

// モックアイテムの作成
const mockFashionItem: FashionItem = {
  id: '1',
  image: '/test-image.jpg',
  sub_category: {
    id: 'sub1',
    subcategory_name: 'T-shirts',
    category: 'tops',
  },
  brand: {
    id: 'brand1',
    brand_name: 'Test Brand',
    brand_name_kana: 'テストブランド',
  },
  seasons: [{ id: 'season1', season_name: 'ALL' }],
  price_range: { id: 'price1', price_range: '¥1,000-¥2,000' },
  design: { id: 'design1', design_pattern: 'Solid' },
  main_color: { id: 'color1', color_name: 'Black', color_code: '#000000' },
  is_owned: true,
  is_old_clothes: false,
  created_at: new Date(),
  updated_at: new Date(),
};

// モックコンテキスト値の作成
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
    isPending: false,
    currentItems: [mockFashionItem],
    ...overrides.state,
  },
  handlers: {
    handleCategoryChange: jest.fn(),
    handleDelete: jest.fn(),
    handleUpdate: jest.fn(),
    handleFilterChange: jest.fn(),
    ...overrides.handlers,
  },
});

// デフォルトのモックコンテキスト値
const mockContextValue = createMockContextValue();

// コンテキストのモック
jest.mock('@/context/FashionItemsContext', () => ({
  useFashionItems: () => mockContextValue,
}));

// 共通コンポーネントのモック
jest.mock('@/features/my-page/common/components/layout/BaseListLayout', () => ({
  __esModule: true,
  default: ({
    items,
    renderItem,
  }: {
    items: FashionItem[];
    renderItem: (item: FashionItem) => React.ReactNode;
  }) => (
    <div data-testid="base-list-layout">
      {items.map((item) => (
        <div key={item.id} data-testid="list-item">
          {renderItem(item)}
        </div>
      ))}
    </div>
  ),
}));

jest.mock('@/features/my-page/common/components/drawer/BaseImageDrawer', () => ({
  __esModule: true,
  default: ({
    item,
    renderTrigger,
  }: {
    item: FashionItem;
    renderTrigger: (imageUrl: string) => React.ReactNode;
  }) => <div data-testid="base-image-drawer">{renderTrigger(item.image)}</div>,
}));

jest.mock('../../button/ItemImageTrigger', () => ({
  __esModule: true,
  default: ({
    imageUrl,
    brand,
    subCategoryName,
  }: {
    imageUrl: string;
    brand: FashionItem['brand'];
    subCategoryName: string;
  }) => (
    <button data-testid="item-image-trigger">
      <img src={imageUrl} alt={subCategoryName} />
      <span>{brand?.brand_name}</span>
    </button>
  ),
}));

jest.mock('../SelectableItem', () => ({
  __esModule: true,
  default: ({
    item,
    onSelectItem,
    isSelected,
  }: {
    item: FashionItem;
    onSelectItem: () => void;
    isSelected: boolean;
  }) => (
    <button data-testid="selectable-item" onClick={onSelectItem} aria-pressed={isSelected}>
      {item.sub_category.subcategory_name}
    </button>
  ),
}));

describe('FashionItemList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // テスト前にデフォルトのモック値に戻す
    Object.assign(mockContextValue, createMockContextValue());
  });

  it('通常モードで正しくレンダリングされること', () => {
    render(<FashionItemList />);

    expect(screen.getByTestId('base-list-layout')).toBeInTheDocument();
    expect(screen.getByTestId('base-image-drawer')).toBeInTheDocument();
    expect(screen.getByTestId('item-image-trigger')).toBeInTheDocument();
  });

  it('選択モードで正しくレンダリングされること', () => {
    const mockOnSelectItem = jest.fn();
    const selectedItems: FashionItem[] = [];

    render(
      <FashionItemList
        selection={{
          onSelectItem: mockOnSelectItem,
          selectedItems,
        }}
      />,
    );

    const selectableItem = screen.getByTestId('selectable-item');
    fireEvent.click(selectableItem);

    expect(mockOnSelectItem).toHaveBeenCalledWith(mockFashionItem);
  });

  it('アイテムが選択された状態を正しく表示すること', () => {
    const mockOnSelectItem = jest.fn();

    render(
      <FashionItemList
        selection={{
          onSelectItem: mockOnSelectItem,
          selectedItems: [mockFashionItem],
        }}
      />,
    );

    const selectableItem = screen.getByTestId('selectable-item');
    expect(selectableItem).toHaveAttribute('aria-pressed', 'true');
  });

  it('ローディング状態を正しく表示すること', () => {
    // モック値を上書き
    Object.assign(
      mockContextValue,
      createMockContextValue({
        state: {
          categoryCache: {},
          selectedCategory: 'tops',
          filters: {
            category: '',
            status: '',
            season: [],
          },
          isPending: true,
          currentItems: [mockFashionItem],
        },
      }),
    );

    render(<FashionItemList />);

    const container = screen.getByTestId('base-list-layout').parentElement;
    expect(container).toHaveClass('opacity-50');
  });
});
