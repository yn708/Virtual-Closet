import type { FashionItem } from '@/types';
import { BACKEND_URL } from '@/utils/constants';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ItemDetailInfoProps, ItemImageDrawerProps } from '../../../types';
import ItemImageDrawer from '../ItemImageDrawer';

// ResizeObserverのモック
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}
global.ResizeObserver = ResizeObserverMock;

// カスタムフックのモック
const mockUseIsOpen = jest.fn();
jest.mock('@/hooks/utils/useIsOpen', () => ({
  useIsOpen: () => mockUseIsOpen(),
}));

// 子コンポーネントのモック
jest.mock('../../content/ItemImage', () => {
  return function MockItemImage({ src }: { src: string }) {
    return <img data-testid="item-image" src={src} alt="アイテム画像" />;
  };
});

jest.mock('../../content/ItemDetailInfo', () => {
  return function MockItemDetailInfo({ item }: ItemDetailInfoProps) {
    return <div data-testid="item-detail-info">{item.brand?.brand_name}</div>;
  };
});

jest.mock('../../content/ItemActions', () => {
  return function MockItemActions({ item, onDelete, onUpdate }: ItemImageDrawerProps) {
    return (
      <div data-testid="item-actions">
        <button onClick={() => onDelete(item.id)}>削除</button>
        <button onClick={() => onUpdate({ ...item })}>更新</button>
      </div>
    );
  };
});

describe('ItemImageDrawer', () => {
  const mockItem: FashionItem = {
    id: '1',
    image: 'test-image.jpg',
    sub_category: { id: 'sub1', subcategory_name: 'Tシャツ' },
    brand: {
      id: 'brand1',
      brand_name: 'Test Brand',
      brand_name_kana: 'テストブランド',
    },
    seasons: [{ id: 'season1', season_name: '春' }] as [{ id: string; season_name: string }],
    price_range: { id: 'price1', price_range: '¥1,000-¥5,000' },
    design: { id: 'design1', design_pattern: 'ストライプ' },
    main_color: {
      id: 'color1',
      color_name: 'ホワイト',
      color_code: '#FFFFFF',
    },
    is_owned: true,
    is_old_clothes: false,
    created_at: new Date('2024-01-01'),
    updated_at: new Date('2024-01-01'),
  };
  const mockOnDelete = jest.fn();
  const mockOnUpdate = jest.fn();
  const mockOnClose = jest.fn();
  const mockOnToggle = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    // デフォルトのモック値を設定
    mockUseIsOpen.mockReturnValue({
      isOpen: false,
      onClose: mockOnClose,
      onToggle: mockOnToggle,
    });
  });

  it('閉じている状態で正しくレンダリングされること', () => {
    render(<ItemImageDrawer item={mockItem} onDelete={mockOnDelete} onUpdate={mockOnUpdate} />);

    const expectedImageUrl = `${BACKEND_URL}${mockItem.image.replace('http://backend:8000', '')}`;
    const image = screen.getByTestId('item-image');
    expect(image).toHaveAttribute('src', expectedImageUrl);
    expect(screen.getByText(mockItem?.brand?.brand_name as string)).toBeInTheDocument();
    expect(screen.getByText(mockItem.sub_category.subcategory_name)).toBeInTheDocument();
  });

  it('DrawerトリガーをクリックするとonToggleが呼ばれること', async () => {
    render(<ItemImageDrawer item={mockItem} onDelete={mockOnDelete} onUpdate={mockOnUpdate} />);

    const trigger = screen.getByTestId('item-image').parentElement;
    await userEvent.click(trigger!);

    expect(mockOnToggle).toHaveBeenCalled();
  });

  it('Drawerが開いているときに詳細情報が表示されること', async () => {
    mockUseIsOpen.mockReturnValue({
      isOpen: true,
      onClose: mockOnClose,
      onToggle: mockOnToggle,
    });

    render(<ItemImageDrawer item={mockItem} onDelete={mockOnDelete} onUpdate={mockOnUpdate} />);

    await waitFor(() => {
      expect(screen.getByText('アイテム詳細')).toBeInTheDocument();
      expect(screen.getByTestId('item-detail-info')).toBeInTheDocument();
      expect(screen.getByTestId('item-actions')).toBeInTheDocument();
      expect(screen.getByText('閉じる')).toBeInTheDocument();
    });
  });

  it('画像URLが正しく生成されること', () => {
    const itemWithDifferentImageUrl = {
      ...mockItem,
      image: 'http://backend:8000/different/path/image.jpg',
    };

    render(
      <ItemImageDrawer
        item={itemWithDifferentImageUrl}
        onDelete={mockOnDelete}
        onUpdate={mockOnUpdate}
      />,
    );

    const expectedImageUrl = `${BACKEND_URL}/different/path/image.jpg`;
    const image = screen.getByTestId('item-image');
    expect(image).toHaveAttribute('src', expectedImageUrl);
  });
});
