import { useImage } from '@/context/ImageContext';
import type { ImageUploadSectionProps } from '@/features/navItems/types';
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

// AccordionSectionコンポーネントのモック
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

// IconButtonコンポーネントのモック
jest.mock('@/components/elements/button/IconButton', () => ({
  __esModule: true,
  default: ({
    Icon,
    label,
    onClick,
    disabled,
    type,
    size: _size,
    rounded: _rounded,
  }: {
    Icon?: React.ComponentType;
    label: string;
    onClick?: () => void;
    disabled?: boolean;
    type: 'button' | 'submit';
    size: 'sm' | 'md' | 'lg';
    rounded?: boolean;
  }) => (
    <button data-testid="icon-button" onClick={onClick} disabled={disabled} type={type}>
      {Icon && <Icon data-testid="button-icon" />}
      <span>{label}</span>
    </button>
  ),
}));

// HiddenFileInputコンポーネントのモック
jest.mock('@/components/elements/form/input/HiddenFileInput', () => ({
  __esModule: true,
  default: ({ onChange }: { onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) => (
    <input type="file" data-testid="hidden-file-input" onChange={onChange} />
  ),
}));

describe('ImageUploadSection', () => {
  // デフォルトのテストプロパティ
  const defaultProps: ImageUploadSectionProps = {
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

    // モックフックの設定
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useImage as jest.Mock).mockReturnValue({
      optimizationProcess: jest.fn(),
    });
    (useImageSelection as jest.Mock).mockReturnValue({
      openFileDialog: jest.fn(),
      handleFileChange: jest.fn(),
      isLoading: false,
    });
  });

  it('正しくレンダリングされること', () => {
    render(<ImageUploadSection {...defaultProps} />);

    expect(screen.getByTestId('accordion-section')).toBeInTheDocument();
    expect(screen.getByTestId('value')).toHaveTextContent('test-section');
    expect(screen.getByTestId('label')).toHaveTextContent('Test Section');
    expect(screen.getByTestId('section-icon')).toBeInTheDocument();
    expect(screen.getByTestId('test-children')).toBeInTheDocument();
    expect(screen.getByTestId('hidden-file-input')).toBeInTheDocument();
    expect(screen.getByTestId('icon-button')).toBeInTheDocument();
  });

  it('ローディング状態に応じてボタンの表示が変更されること', () => {
    const { rerender } = render(<ImageUploadSection {...defaultProps} />);
    expect(screen.getByTestId('icon-button')).toHaveTextContent('カメラロールから選択');
    expect(screen.getByTestId('icon-button')).not.toBeDisabled();

    (useImageSelection as jest.Mock).mockReturnValue({
      openFileDialog: jest.fn(),
      handleFileChange: jest.fn(),
      isLoading: true,
    });
    rerender(<ImageUploadSection {...defaultProps} />);

    expect(screen.getByTestId('icon-button')).toHaveTextContent('処理中');
    expect(screen.getByTestId('icon-button')).toBeDisabled();
  });

  it('ファイル選択が正しく処理されること', async () => {
    const mockOptimizationProcess = jest.fn();
    const mockHandleFileChange = jest.fn().mockResolvedValue({ file: new File([], 'test.jpg') });

    (useImage as jest.Mock).mockReturnValue({
      optimizationProcess: mockOptimizationProcess,
    });
    (useImageSelection as jest.Mock).mockReturnValue({
      openFileDialog: jest.fn(),
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
    expect(mockOptimizationProcess).toHaveBeenCalledWith(file);
    expect(mockRouter.push).toHaveBeenCalledWith(defaultProps.redirectUrl);
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('ファイル選択がキャンセルされた場合、処理が中断されること', async () => {
    const mockOptimizationProcess = jest.fn();
    const mockHandleFileChange = jest.fn().mockResolvedValue({ file: null });

    (useImage as jest.Mock).mockReturnValue({
      optimizationProcess: mockOptimizationProcess,
    });
    (useImageSelection as jest.Mock).mockReturnValue({
      openFileDialog: jest.fn(),
      handleFileChange: mockHandleFileChange,
      isLoading: false,
    });

    render(<ImageUploadSection {...defaultProps} />);

    const input = screen.getByTestId('hidden-file-input');

    await waitFor(() => {
      fireEvent.change(input, { target: { files: [] } });
    });

    expect(mockHandleFileChange).toHaveBeenCalled();
    expect(mockOptimizationProcess).not.toHaveBeenCalled();
    expect(mockRouter.push).not.toHaveBeenCalled();
    expect(defaultProps.onClose).not.toHaveBeenCalled();
  });

  it('IconButtonクリック時にファイルダイアログが開くこと', () => {
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
