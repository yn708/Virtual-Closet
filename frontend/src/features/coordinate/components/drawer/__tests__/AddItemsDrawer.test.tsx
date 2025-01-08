import { useCoordinateCanvasState } from '@/context/CoordinateCanvasContext';
import { useIsOpen } from '@/hooks/utils/useIsOpen';
import type { CoordinateCanvasContextValue, FashionItem } from '@/types';
import { render, screen } from '@testing-library/react';
import AddItemsDrawer from '../AddItemsDrawer';

// モックの設定
jest.mock('@/hooks/utils/useIsOpen');
jest.mock('@/context/CoordinateCanvasContext');
jest.mock('@/features/my-page/fashion-item/components/content/FashionItemsContents', () => {
  return function MockFashionItemsContents() {
    return <div data-testid="fashion-items-contents">Fashion Items Contents</div>;
  };
});

// Drawerコンポーネントのモック
jest.mock('@/components/ui/drawer', () => ({
  Drawer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DrawerContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DrawerTrigger: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

// ScrollAreaのモック
jest.mock('@/components/ui/scroll-area', () => ({
  ScrollArea: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

// モックデータ
const mockFashionItem: FashionItem = {
  id: '1',
  image: 'test-image.jpg',
  sub_category: {
    id: 'sub1',
    subcategory_name: 'Tシャツ',
    category: 'トップス',
  },
  brand: {
    id: 'brand1',
    brand_name: 'テストブランド',
    brand_name_kana: 'テストブランド',
  },
  seasons: [{ id: 'season1', season_name: '春' }],
  price_range: {
    id: 'price1',
    price_range: '¥1,000-¥5,000',
  },
  design: {
    id: 'design1',
    design_pattern: 'シンプル',
  },
  main_color: {
    id: 'color1',
    color_name: '黒',
    color_code: '#000000',
  },
  is_owned: true,
  is_old_clothes: false,
  created_at: new Date(),
  updated_at: new Date(),
};

// useIsOpenのモック型定義
const mockUseIsOpen = useIsOpen as jest.MockedFunction<typeof useIsOpen>;
const mockUseCoordinateCanvasState = useCoordinateCanvasState as jest.MockedFunction<
  typeof useCoordinateCanvasState
>;

describe('AddItemsDrawer', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // CoordinateCanvasContextのモック値を設定
    const mockContextValue: CoordinateCanvasContextValue = {
      state: {
        selectedItems: [],
        itemStyles: {},
        background: '',
      },
      handlers: {
        handleSelectItem: jest.fn(),
        handleRemoveItem: jest.fn(),
        handleUpdateStyles: jest.fn(),
        handleFullReset: jest.fn(),
        handleBackgroundChange: jest.fn(),
      },
    };

    mockUseCoordinateCanvasState.mockReturnValue(mockContextValue);
  });

  it('selectedItemsが空の場合、Drawerが開かれること', () => {
    const mockSetIsOpen = jest.fn();
    mockUseIsOpen.mockReturnValue({
      isOpen: false,
      setIsOpen: mockSetIsOpen,
      onClose: jest.fn(),
      onToggle: jest.fn(),
    });

    render(<AddItemsDrawer />);

    expect(mockSetIsOpen).toHaveBeenCalledWith(true);
  });

  it('DrawerContentが開いている時、FashionItemsContentsが表示されること', () => {
    mockUseIsOpen.mockReturnValue({
      isOpen: true,
      setIsOpen: jest.fn(),
      onClose: jest.fn(),
      onToggle: jest.fn(),
    });

    render(<AddItemsDrawer />);

    expect(screen.getByTestId('fashion-items-contents')).toBeInTheDocument();
  });

  it('コンテキストから正しいpropsがFashionItemsContentsに渡されること', () => {
    const mockHandleSelectItem = jest.fn();
    const mockSelectedItems = [mockFashionItem];

    mockUseIsOpen.mockReturnValue({
      isOpen: true,
      setIsOpen: jest.fn(),
      onClose: jest.fn(),
      onToggle: jest.fn(),
    });

    mockUseCoordinateCanvasState.mockReturnValue({
      state: {
        selectedItems: mockSelectedItems,
        itemStyles: {},
        background: '',
      },
      handlers: {
        handleSelectItem: mockHandleSelectItem,
        handleRemoveItem: jest.fn(),
        handleUpdateStyles: jest.fn(),
        handleFullReset: jest.fn(),
        handleBackgroundChange: jest.fn(),
      },
    });

    render(<AddItemsDrawer />);

    const fashionItemsContents = screen.getByTestId('fashion-items-contents');
    expect(fashionItemsContents).toBeInTheDocument();
  });
});
