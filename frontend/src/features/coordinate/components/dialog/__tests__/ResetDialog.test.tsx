import { useCoordinateCanvasState } from '@/context/CoordinateCanvasContext';
import { fireEvent, render, screen } from '@testing-library/react';
import ResetDialog from '../ResetDialog';

// モックの設定
jest.mock('@/context/CoordinateCanvasContext');
jest.mock('@/components/elements/dialog/BaseDialog', () => {
  return function MockBaseDialog({
    children,
    trigger,
    title,
    description,
  }: {
    children: React.ReactNode;
    trigger: React.ReactNode;
    title: string;
    description: string;
  }) {
    return (
      <div data-testid="base-dialog">
        <div data-testid="dialog-trigger">{trigger}</div>
        <div data-testid="dialog-title">{title}</div>
        <div data-testid="dialog-description">{description}</div>
        <div data-testid="dialog-content">{children}</div>
      </div>
    );
  };
});

// Dialog関連のコンポーネントのモック
jest.mock('@/components/ui/dialog', () => ({
  DialogClose: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogFooter: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={className}>{children}</div>
  ),
}));

const mockUseCoordinateCanvasState = useCoordinateCanvasState as jest.MockedFunction<
  typeof useCoordinateCanvasState
>;

describe('ResetDialog', () => {
  const mockHandleFullReset = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseCoordinateCanvasState.mockReturnValue({
      state: {
        selectedItems: [],
        itemStyles: {},
        background: '',
      },
      handlers: {
        handleSelectItem: jest.fn(),
        handleRemoveItem: jest.fn(),
        handleUpdateStyles: jest.fn(),
        handleFullReset: mockHandleFullReset,
        handleBackgroundChange: jest.fn(),
      },
    });
  });

  it('ダイアログのトリガーとなるIconButtonが表示されること', () => {
    render(<ResetDialog />);

    const triggerButton = screen.getByText('クリア');
    expect(triggerButton).toBeInTheDocument();
  });

  it('ダイアログに正しいタイトルと説明が表示されること', () => {
    render(<ResetDialog />);

    expect(screen.getByText('コーディネートをリセット')).toBeInTheDocument();
    expect(
      screen.getByText('選択した全てのアイテムが削除されます。よろしいですか？'),
    ).toBeInTheDocument();
  });

  it('キャンセルボタンとリセットボタンが表示されること', () => {
    render(<ResetDialog />);

    expect(screen.getByText('キャンセル')).toBeInTheDocument();
    expect(screen.getByText('リセット')).toBeInTheDocument();
  });

  it('リセットボタンをクリックするとhandleFullResetが呼ばれること', () => {
    render(<ResetDialog />);

    const resetButton = screen.getByText('リセット');
    fireEvent.click(resetButton);

    expect(mockHandleFullReset).toHaveBeenCalledTimes(1);
  });
});
