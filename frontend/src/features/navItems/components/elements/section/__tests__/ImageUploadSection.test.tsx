import { useImage } from '@/context/ImageContext';
import { useImageSelection } from '@/hooks/image/useImageSelection';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { BiCamera } from 'react-icons/bi';
import ImageUploadSection from '../ImageUploadSection';

// モックの設定
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/context/ImageContext', () => ({
  useImage: jest.fn(),
}));

jest.mock('@/hooks/image/useImageSelection', () => ({
  useImageSelection: jest.fn(),
}));

// AccordionSectionコンポーネントのモック設定
jest.mock('../AccordionSection', () => ({
  __esModule: true,
  default: ({
    children,
    value,
    Icon,
    label,
  }: {
    children: React.ReactNode;
    value: string;
    Icon?: React.ComponentType;
    label: string;
  }) => (
    <div data-testid="accordion-section">
      <div data-testid="value">{value}</div>
      <div data-testid="label">{label}</div>
      {Icon && (
        <div data-testid="section-icon">
          <Icon />
        </div>
      )}
      <div data-testid="section-content">{children}</div>
    </div>
  ),
}));

// IconButtonコンポーネントのモック設定
jest.mock('@/components/elements/button/IconButton', () => ({
  __esModule: true,
  default: ({
    Icon,
    label,
    onClick,
    disabled,
  }: {
    Icon?: React.ComponentType;
    label: string;
    onClick?: () => void;
    disabled?: boolean;
  }) => (
    <button data-testid="icon-button" onClick={onClick} disabled={disabled}>
      {Icon && <Icon data-testid="button-icon" />}
      <span>{label}</span>
    </button>
  ),
}));

// HiddenFileInputコンポーネントのモック設定
jest.mock('@/components/elements/form/input/HiddenFileInput', () => ({
  __esModule: true,
  default: ({ onChange }: { onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) => (
    <input type="file" data-testid="hidden-file-input" onChange={onChange} />
  ),
}));

describe('ImageUploadSection', () => {
  // デフォルトのテストプロパティ
  const defaultProps = {
    value: 'test-section',
    label: 'Test Section',
    Icon: BiCamera,
    redirectUrl: '/test-redirect',
    onClose: jest.fn(),
    children: <div data-testid="test-children">Test Children</div>,
  };

  // モックRouter
  const mockRouter = {
    push: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // 必要なモックフックを設定
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useImage as jest.Mock).mockReturnValue({
      removeBgProcess: jest.fn(),
    });
    (useImageSelection as jest.Mock).mockReturnValue({
      openFileDialog: jest.fn(),
      handleFileChange: jest.fn(),
      isLoading: false,
    });
  });

  it('renders correctly with all props', () => {
    // コンポーネントがすべてのプロパティとともに正しく描画されるかを確認
    render(<ImageUploadSection {...defaultProps} />);

    // 基本的なUI要素の存在を確認
    expect(screen.getByTestId('accordion-section')).toBeInTheDocument();
    expect(screen.getByTestId('value')).toHaveTextContent('test-section');
    expect(screen.getByTestId('label')).toHaveTextContent('Test Section');
    expect(screen.getByTestId('section-icon')).toBeInTheDocument();
    expect(screen.getByTestId('test-children')).toBeInTheDocument();
    expect(screen.getByTestId('hidden-file-input')).toBeInTheDocument();
    expect(screen.getByTestId('icon-button')).toBeInTheDocument();
  });

  it('shows correct icon button label and state based on loading', () => {
    // isLoadingがfalseの状態でのラベルと状態を確認
    const { rerender } = render(<ImageUploadSection {...defaultProps} />);
    expect(screen.getByTestId('icon-button')).toHaveTextContent('カメラロールから選択');
    expect(screen.getByTestId('icon-button')).not.toBeDisabled();

    // isLoadingがtrueの場合のラベルと状態を確認
    (useImageSelection as jest.Mock).mockReturnValue({
      openFileDialog: jest.fn(),
      handleFileChange: jest.fn(),
      isLoading: true,
    });
    rerender(<ImageUploadSection {...defaultProps} />);

    expect(screen.getByTestId('icon-button')).toHaveTextContent('処理中');
    expect(screen.getByTestId('icon-button')).toBeDisabled();
  });

  it('handles file selection correctly', async () => {
    // ファイル選択時のハンドリングを確認
    const mockRemoveBgProcess = jest.fn();
    const mockHandleFileChange = jest.fn().mockResolvedValue({ file: new File([], 'test.jpg') });

    (useImage as jest.Mock).mockReturnValue({
      removeBgProcess: mockRemoveBgProcess,
    });
    (useImageSelection as jest.Mock).mockReturnValue({
      openFileDialog: jest.fn(),
      handleFileChange: mockHandleFileChange,
      isLoading: false,
    });

    render(<ImageUploadSection {...defaultProps} />);

    const input = screen.getByTestId('hidden-file-input');
    const file = new File([], 'test.jpg', { type: 'image/jpeg' });

    // ファイル変更イベントをトリガー
    await waitFor(() => {
      fireEvent.change(input, { target: { files: [file] } });
    });

    // 関連する関数が呼び出されることを確認
    expect(mockHandleFileChange).toHaveBeenCalled();
    expect(mockRemoveBgProcess).toHaveBeenCalledWith(file);
    expect(mockRouter.push).toHaveBeenCalledWith(defaultProps.redirectUrl);
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('handles file selection cancellation correctly', async () => {
    // ファイル選択キャンセル時のハンドリングを確認
    const mockRemoveBgProcess = jest.fn();
    const mockHandleFileChange = jest.fn().mockResolvedValue({ file: null });

    (useImage as jest.Mock).mockReturnValue({
      removeBgProcess: mockRemoveBgProcess,
    });
    (useImageSelection as jest.Mock).mockReturnValue({
      openFileDialog: jest.fn(),
      handleFileChange: mockHandleFileChange,
      isLoading: false,
    });

    render(<ImageUploadSection {...defaultProps} />);

    const input = screen.getByTestId('hidden-file-input');

    // 空のファイルリストでイベントをトリガー
    await waitFor(() => {
      fireEvent.change(input, { target: { files: [] } });
    });

    // 関連する関数が呼び出されないことを確認
    expect(mockHandleFileChange).toHaveBeenCalled();
    expect(mockRemoveBgProcess).not.toHaveBeenCalled();
    expect(mockRouter.push).not.toHaveBeenCalled();
    expect(defaultProps.onClose).not.toHaveBeenCalled();
  });

  it('triggers file dialog when IconButton is clicked', () => {
    // アイコンボタンクリック時にファイルダイアログが開くかを確認
    const mockOpenFileDialog = jest.fn();
    (useImageSelection as jest.Mock).mockReturnValue({
      openFileDialog: mockOpenFileDialog,
      handleFileChange: jest.fn(),
      isLoading: false,
    });

    render(<ImageUploadSection {...defaultProps} />);

    fireEvent.click(screen.getByTestId('icon-button'));
    expect(mockOpenFileDialog).toHaveBeenCalled();
  });
});
