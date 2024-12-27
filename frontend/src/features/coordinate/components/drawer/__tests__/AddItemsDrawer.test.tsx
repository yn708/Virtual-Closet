import { useIsOpen } from '@/hooks/utils/useIsOpen';
import { render, screen } from '@testing-library/react';
import AddItemsDrawer from '../AddItemsDrawer';

// モックの設定
jest.mock('@/hooks/utils/useIsOpen');
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

// useIsOpenのモック型定義
const mockUseIsOpen = useIsOpen as jest.MockedFunction<typeof useIsOpen>;

describe('AddItemsDrawer', () => {
  // テスト共通のプロップス
  const defaultProps = {
    selectedItems: [],
    onSelectItem: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('selectedItemsが空の場合、Drawerが開かれること', () => {
    const mockSetIsOpen = jest.fn();
    mockUseIsOpen.mockReturnValue({
      isOpen: false,
      setIsOpen: mockSetIsOpen,
      onClose: jest.fn(),
      onToggle: jest.fn(),
    });

    render(<AddItemsDrawer {...defaultProps} />);

    expect(mockSetIsOpen).toHaveBeenCalledWith(true);
  });

  it('DrawerContentが開いている時、FashionItemsContentsが表示されること', () => {
    mockUseIsOpen.mockReturnValue({
      isOpen: true,
      setIsOpen: jest.fn(),
      onClose: jest.fn(),
      onToggle: jest.fn(),
    });

    render(<AddItemsDrawer {...defaultProps} />);

    expect(screen.getByTestId('fashion-items-contents')).toBeInTheDocument();
  });
});
