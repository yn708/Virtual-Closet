import type { FashionItem } from '@/types';
import { fireEvent, render, screen } from '@testing-library/react';
import type { FashionItemListProps } from '../../../types';
import FashionItemList from '../FashionItemList';

// 各コンポーネントのモック
jest.mock('@/components/elements/loading/LoadingElements', () => {
  return function MockLoadingElements({ message }: { message: string }) {
    return <div data-testid="loading-elements">{message}</div>;
  };
});

jest.mock('../EmptyState', () => {
  return function MockEmptyState() {
    return <div data-testid="empty-state">アイテムがありません</div>;
  };
});

jest.mock('../../drawer/ItemImageDrawer', () => {
  return function MockItemImageDrawer({
    item,
    onDelete: _onDelete,
    onUpdate: _onUpdate,
  }: {
    item: FashionItem;
    onDelete?: (id: string) => void;
    onUpdate?: (item: FashionItem) => void;
  }) {
    return <div data-testid={`item-drawer-${item.id}`}>{item.brand?.brand_name}</div>;
  };
});

jest.mock('../ItemImage', () => {
  return function MockItemImage({ src }: { src: string }) {
    return <img data-testid="item-image" src={src} alt="" />;
  };
});

describe('FashionItemList', () => {
  // 共通のprops
  const defaultProps: FashionItemListProps = {
    items: [],
    isLoading: false,
    onDelete: jest.fn(),
    onUpdate: jest.fn(),
  };

  // テスト用のモックデータ
  const mockItems: FashionItem[] = [
    {
      id: '1',
      image: '/images/item1.jpg',
      sub_category: {
        id: '1',
        subcategory_name: 'Test Sub Category 1',
        category: 'tops',
      },
      brand: {
        id: '1',
        brand_name: 'Test Brand 1',
        brand_name_kana: 'テストブランド1',
      },
      seasons: [{ id: '1', season_name: '春' }],
      price_range: { id: '1', price_range: '~5000円' },
      design: { id: '1', design_pattern: 'ストライプ' },
      main_color: { id: '1', color_name: '黒', color_code: '#000000' },
      is_owned: true,
      is_old_clothes: false,
      created_at: new Date('2024-01-01'),
      updated_at: new Date('2024-01-01'),
    },
    {
      id: '2',
      image: '/images/item2.jpg',
      sub_category: {
        id: '2',
        subcategory_name: 'Test Sub Category 2',
        category: 'bottoms',
      },
      brand: {
        id: '2',
        brand_name: 'Test Brand 2',
        brand_name_kana: 'テストブランド2',
      },
      seasons: [{ id: '2', season_name: '夏' }],
      price_range: null,
      design: null,
      main_color: null,
      is_owned: true,
      is_old_clothes: false,
      created_at: new Date('2024-01-01'),
      updated_at: new Date('2024-01-01'),
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('ローディング状態が正しく表示されること', () => {
    render(<FashionItemList {...defaultProps} isLoading={true} />);
    expect(screen.getByTestId('loading-elements')).toBeInTheDocument();
    expect(screen.getByText('アイテムを取得中...')).toBeInTheDocument();
  });

  it('アイテムが空の場合、EmptyStateが表示されること', () => {
    render(<FashionItemList {...defaultProps} />);
    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
  });

  it('選択モードがない場合、ItemImageDrawerとして表示されること', () => {
    render(<FashionItemList {...defaultProps} items={mockItems} />);

    mockItems.forEach((item) => {
      expect(screen.getByTestId(`item-drawer-${item.id}`)).toBeInTheDocument();
    });
  });

  it('選択モードの場合、アイテムが選択可能であること', () => {
    const handleSelectItem = jest.fn();
    const selectedItems = [mockItems[0]];

    const { container } = render(
      <FashionItemList
        {...defaultProps}
        items={mockItems}
        onSelectItem={handleSelectItem}
        selectedItems={selectedItems}
      />,
    );

    // 選択可能なアイテムを探して選択
    const selectableItem = container.querySelector(`div[class*="group"]:not([class*="ring-2"])`);
    expect(selectableItem).toBeInTheDocument();
    fireEvent.click(selectableItem!);
    expect(handleSelectItem).toHaveBeenCalledWith(mockItems[1]);

    // 選択済みアイテムのスタイル確認
    const selectedItem = container.querySelector(`div[class*="ring-2"][class*="ring-blue-500"]`);
    expect(selectedItem).toBeInTheDocument();
  });

  it('画像URLが正しく生成されること', () => {
    const { container } = render(
      <FashionItemList {...defaultProps} items={mockItems} onSelectItem={jest.fn()} />,
    );

    const images = container.querySelectorAll('[data-testid="item-image"]');
    images.forEach((image, index) => {
      const imgElement = image as HTMLImageElement;
      expect(imgElement.src).toContain(mockItems[index].image.replace('http://backend:8000', ''));
    });
  });

  it('選択状態のインジケーターが正しく表示されること', () => {
    const { container } = render(
      <FashionItemList
        {...defaultProps}
        items={mockItems}
        onSelectItem={jest.fn()}
        selectedItems={[mockItems[0]]}
      />,
    );

    // 選択状態のインジケーター（チェックマークの円）を確認
    const checkmarkContainer = container.querySelector(
      'div[class*="bg-blue-500"][class*="rounded-full"]',
    );
    expect(checkmarkContainer).toBeInTheDocument();

    // SVGチェックマークの存在を確認
    const checkmarkSvg = checkmarkContainer?.querySelector('svg');
    expect(checkmarkSvg).toBeInTheDocument();
  });
});
