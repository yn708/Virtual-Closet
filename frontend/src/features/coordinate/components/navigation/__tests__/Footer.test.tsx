import { useCoordinateCanvasState } from '@/context/CoordinateCanvasContext';
import { render, screen } from '@testing-library/react';
import Footer from '../Footer';

// CoordinateCanvasContextのモック
jest.mock('@/context/CoordinateCanvasContext', () => ({
  useCoordinateCanvasState: jest.fn(),
}));

// 子コンポーネントのモック
jest.mock('../../dialog/ResetDialog', () => ({
  __esModule: true,
  default: () => <div data-testid="reset-dialog">Reset Dialog</div>,
}));

jest.mock('../../drawer/SelectBackgroundDrawer', () => ({
  __esModule: true,
  default: () => <div data-testid="background-drawer">Background Drawer</div>,
}));

jest.mock('../../drawer/AddItemsDrawer', () => ({
  __esModule: true,
  default: () => <div data-testid="add-items-drawer">Add Items Drawer</div>,
}));

jest.mock('@/context/FashionItemsContext', () => ({
  FashionItemsProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="fashion-items-provider">{children}</div>
  ),
}));

describe('Footer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('選択アイテムがない場合、ResetDialogを表示しないこと', () => {
    (useCoordinateCanvasState as jest.Mock).mockReturnValue({
      state: {
        selectedItems: [],
      },
    });

    render(<Footer />);

    expect(screen.queryByTestId('reset-dialog')).not.toBeInTheDocument();
    expect(screen.getByTestId('background-drawer')).toBeInTheDocument();
    expect(screen.getByTestId('add-items-drawer')).toBeInTheDocument();
  });

  it('選択アイテムがある場合、すべてのコンポーネントが表示されること', () => {
    (useCoordinateCanvasState as jest.Mock).mockReturnValue({
      state: {
        selectedItems: [{ id: '1' }, { id: '2' }],
      },
    });

    render(<Footer />);

    expect(screen.getByTestId('reset-dialog')).toBeInTheDocument();
    expect(screen.getByTestId('background-drawer')).toBeInTheDocument();
    expect(screen.getByTestId('add-items-drawer')).toBeInTheDocument();
  });

  it('FashionItemsProviderでラップされていること', () => {
    (useCoordinateCanvasState as jest.Mock).mockReturnValue({
      state: {
        selectedItems: [],
      },
    });

    render(<Footer />);

    expect(screen.getByTestId('fashion-items-provider')).toBeInTheDocument();
  });

  it('レイアウトのクラスが正しく適用されていること', () => {
    (useCoordinateCanvasState as jest.Mock).mockReturnValue({
      state: {
        selectedItems: [],
      },
    });

    render(<Footer />);

    const container = screen.getByTestId('fashion-items-provider').firstChild;
    expect(container).toHaveClass(
      'flex',
      'items-center',
      'justify-around',
      'pt-5',
      'pb-2',
      'w-full',
    );
  });

  it('selectedItemsがundefinedの場合、ResetDialogを表示しないこと', () => {
    (useCoordinateCanvasState as jest.Mock).mockReturnValue({
      state: {
        selectedItems: undefined,
      },
    });

    render(<Footer />);

    expect(screen.queryByTestId('reset-dialog')).not.toBeInTheDocument();
    expect(screen.getByTestId('background-drawer')).toBeInTheDocument();
    expect(screen.getByTestId('add-items-drawer')).toBeInTheDocument();
  });
});
