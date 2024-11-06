import { useImage } from '@/context/ImageContext';
import { useImageSelection } from '@/hooks/image/useImageSelection';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { BiCamera } from 'react-icons/bi';
import { ImageUploadSection } from '../ImageUploadSection';

// 各種モックの設定
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/context/ImageContext', () => ({
  useImage: jest.fn(),
}));

jest.mock('@/hooks/image/useImageSelection', () => ({
  useImageSelection: jest.fn(),
}));

// AccordionSectionのモック
jest.mock('../AccordionSection', () => ({
  AccordionSection: jest.fn(({ children, value, Icon, label }) => (
    <div data-testid="accordion-section">
      <div data-testid="value">{value}</div>
      <div data-testid="label">{label}</div>
      <div data-testid="icon">{Icon && <Icon data-testid="section-icon" />}</div>
      {children}
    </div>
  )),
}));

// IconButtonのモック
jest.mock('@/components/elements/button/IconButton', () => ({
  __esModule: true,
  default: jest.fn(({ Icon, label, onClick, disabled }) => (
    <button data-testid="icon-button" onClick={onClick} disabled={disabled}>
      {Icon && <Icon data-testid="button-icon" />}
      <span>{label}</span>
    </button>
  )),
}));

describe('ImageUploadSection', () => {
  // テスト用のプロップスとモック
  const defaultProps = {
    value: 'test-section',
    label: 'Test Section',
    Icon: BiCamera,
    redirectUrl: '/test-redirect',
    onClose: jest.fn(),
    children: <div data-testid="test-children">Test Children</div>,
  };

  const mockRouter = {
    push: jest.fn(),
  };

  const mockFileInputRef = { current: document.createElement('input') };

  beforeEach(() => {
    jest.clearAllMocks();

    // ルーターのモック
    (useRouter as jest.Mock).mockReturnValue(mockRouter);

    // ImageContextのモック
    (useImage as jest.Mock).mockReturnValue({
      image: null,
      setImage: jest.fn(),
      clearImage: jest.fn(),
    });

    // useImageSelectionのモック
    (useImageSelection as jest.Mock).mockReturnValue({
      fileInputRef: mockFileInputRef,
      handleFileInput: jest.fn(),
      handleFileChange: jest.fn(),
      isLoading: false,
    });
  });

  // 基本的なレンダリングテスト
  it('renders correctly with all props', () => {
    render(<ImageUploadSection {...defaultProps} />);

    expect(screen.getByTestId('accordion-section')).toBeInTheDocument();
    expect(screen.getByTestId('value')).toHaveTextContent('test-section');
    expect(screen.getByTestId('label')).toHaveTextContent('Test Section');
    expect(screen.getByTestId('section-icon')).toBeInTheDocument();
    expect(screen.getByTestId('test-children')).toBeInTheDocument();
  });

  // ファイル選択ボタンのテスト
  it('renders file selection button with correct label', () => {
    render(<ImageUploadSection {...defaultProps} />);

    const button = screen.getByTestId('icon-button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('カメラロールから選択');
  });

  // ローディング状態のテスト
  it('shows loading state correctly', () => {
    (useImageSelection as jest.Mock).mockReturnValue({
      fileInputRef: mockFileInputRef,
      handleFileInput: jest.fn(),
      handleFileChange: jest.fn(),
      isLoading: true,
    });

    render(<ImageUploadSection {...defaultProps} />);

    expect(screen.getByTestId('icon-button')).toHaveTextContent('処理中');
    expect(screen.getByTestId('icon-button')).toBeDisabled();
  });

  // ファイル選択処理のテスト
  it('handles file selection correctly', async () => {
    const mockSetImage = jest.fn();
    const mockClearImage = jest.fn();
    const mockHandleFileChange = jest.fn().mockResolvedValue({ file: new File([], 'test.jpg') });

    (useImage as jest.Mock).mockReturnValue({
      image: null,
      setImage: mockSetImage,
      clearImage: mockClearImage,
    });

    (useImageSelection as jest.Mock).mockReturnValue({
      fileInputRef: mockFileInputRef,
      handleFileInput: jest.fn(),
      handleFileChange: mockHandleFileChange,
      isLoading: false,
    });

    render(<ImageUploadSection {...defaultProps} />);

    const input = screen.getByTestId('hidden-file-input');
    const file = new File([], 'test.jpg', { type: 'image/jpeg' });

    await waitFor(() => {
      fireEvent.change(input, { target: { files: [file] } });
    });

    expect(mockHandleFileChange).toHaveBeenCalled();
    expect(mockSetImage).toHaveBeenCalled();
    expect(mockRouter.push).toHaveBeenCalledWith(defaultProps.redirectUrl);
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  // 既存画像がある場合のテスト
  it('clears existing image before setting new one', async () => {
    const mockSetImage = jest.fn();
    const mockClearImage = jest.fn();
    const mockHandleFileChange = jest.fn().mockResolvedValue({ file: new File([], 'test.jpg') });

    (useImage as jest.Mock).mockReturnValue({
      image: new File([], 'existing.jpg'),
      setImage: mockSetImage,
      clearImage: mockClearImage,
    });

    (useImageSelection as jest.Mock).mockReturnValue({
      fileInputRef: mockFileInputRef,
      handleFileInput: jest.fn(),
      handleFileChange: mockHandleFileChange,
      isLoading: false,
    });

    render(<ImageUploadSection {...defaultProps} />);

    const input = screen.getByTestId('hidden-file-input');
    const file = new File([], 'test.jpg', { type: 'image/jpeg' });

    await waitFor(() => {
      fireEvent.change(input, { target: { files: [file] } });
    });

    expect(mockClearImage).toHaveBeenCalled();
    expect(mockSetImage).toHaveBeenCalled();
  });

  // エラーケースのテスト
  it('handles file selection failure correctly', async () => {
    const mockHandleFileChange = jest.fn().mockResolvedValue({ file: null });
    const mockSetImage = jest.fn();
    const mockRouter = { push: jest.fn() };

    (useImageSelection as jest.Mock).mockReturnValue({
      fileInputRef: mockFileInputRef,
      handleFileInput: jest.fn(),
      handleFileChange: mockHandleFileChange,
      isLoading: false,
    });

    (useRouter as jest.Mock).mockReturnValue(mockRouter);

    render(<ImageUploadSection {...defaultProps} />);

    const input = screen.getByTestId('hidden-file-input');

    await waitFor(() => {
      fireEvent.change(input, { target: { files: [] } });
    });

    expect(mockSetImage).not.toHaveBeenCalled();
    expect(mockRouter.push).not.toHaveBeenCalled();
    expect(defaultProps.onClose).not.toHaveBeenCalled();
  });
});
