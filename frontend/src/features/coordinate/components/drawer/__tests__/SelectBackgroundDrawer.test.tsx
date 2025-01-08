import { useCoordinateCanvasState } from '@/context/CoordinateCanvasContext';
import { BG_COLOR } from '@/utils/data/selectData';
import { fireEvent, render, screen } from '@testing-library/react';
import SelectBackgroundDrawer from '../SelectBackgroundDrawer';

// モックの設定
jest.mock('@/context/CoordinateCanvasContext');
jest.mock('@/features/navItems/components/elements/button/ThemeToggleButton', () => {
  return function MockThemeToggleButton() {
    return <div data-testid="theme-toggle-button">Theme Toggle Button</div>;
  };
});

// Drawerコンポーネントのモック
jest.mock('@/components/ui/drawer', () => ({
  Drawer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DrawerContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DrawerTrigger: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DrawerClose: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

const mockUseCoordinateCanvasState = useCoordinateCanvasState as jest.MockedFunction<
  typeof useCoordinateCanvasState
>;

describe('SelectBackgroundDrawer', () => {
  const mockHandleBackgroundChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseCoordinateCanvasState.mockReturnValue({
      state: {
        selectedItems: [],
        itemStyles: {},
        background: 'bg-white',
      },
      handlers: {
        handleSelectItem: jest.fn(),
        handleRemoveItem: jest.fn(),
        handleUpdateStyles: jest.fn(),
        handleFullReset: jest.fn(),
        handleBackgroundChange: mockHandleBackgroundChange,
      },
    });
  });

  it('背景色のボタンが全て表示されること', () => {
    render(<SelectBackgroundDrawer />);

    // BG_COLORの数だけボタンが存在することを確認
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(BG_COLOR.length + 1); // +1 はIconButtonのため
  });

  it('背景色ボタンをクリックすると、handleBackgroundChangeが呼ばれること', () => {
    render(<SelectBackgroundDrawer />);

    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[1]); // 最初のボタンはIconButtonなので2番目を選択

    expect(mockHandleBackgroundChange).toHaveBeenCalledWith(BG_COLOR[0].value);
  });

  it('現在選択されている背景色のボタンにring-2クラスが適用されること', () => {
    const selectedBackground = BG_COLOR[0].value;

    mockUseCoordinateCanvasState.mockReturnValue({
      state: {
        selectedItems: [],
        itemStyles: {},
        background: selectedBackground,
      },
      handlers: {
        handleSelectItem: jest.fn(),
        handleRemoveItem: jest.fn(),
        handleUpdateStyles: jest.fn(),
        handleFullReset: jest.fn(),
        handleBackgroundChange: mockHandleBackgroundChange,
      },
    });

    render(<SelectBackgroundDrawer />);

    const selectedButton = screen.getAllByRole('button')[1];
    expect(selectedButton).toHaveClass('ring-2');
  });

  it('ThemeToggleButtonが表示されること', () => {
    render(<SelectBackgroundDrawer />);

    expect(screen.getByTestId('theme-toggle-button')).toBeInTheDocument();
  });
});
