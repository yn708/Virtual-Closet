import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ImageCropDialog from '../ImageCropDialog';
import { useImageCrop } from '../../../hooks/useImageCrop';

// カスタムフックのモック
jest.mock('../../../hooks/useImageCrop', () => ({
  useImageCrop: jest.fn(),
}));

// UIコンポーネントのモック
jest.mock('@/components/ui/dialog', () => ({
  Dialog: ({ children, open }: { children: React.ReactNode; open: boolean }) =>
    open ? <div role="dialog">{children}</div> : null,
  DialogContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

jest.mock('@/components/ui/slider', () => ({
  Slider: ({
    value,
    onValueChange,
  }: {
    value: number[];
    onValueChange: (value: number[]) => void;
  }) => (
    <input
      type="range"
      value={value[0]}
      onChange={(e) => onValueChange([Number(e.target.value)])}
      min={1}
      max={3}
      step={0.05}
      aria-label="Zoom control"
    />
  ),
}));

// クロップライブラリのモック
jest.mock('react-easy-crop', () => {
  return jest.fn(({ onCropChange, onZoomChange, onCropComplete }) => (
    <div data-testid="mock-cropper">
      <button data-testid="mock-crop-change" onClick={() => onCropChange({ x: 10, y: 10 })}>
        Crop Change
      </button>
      <button data-testid="mock-zoom-change" onClick={() => onZoomChange(2)}>
        Zoom Change
      </button>
      <button
        data-testid="mock-crop-complete"
        onClick={() =>
          onCropComplete(
            { x: 0, y: 0, width: 100, height: 100 },
            { x: 0, y: 0, width: 100, height: 100 },
          )
        }
      >
        Crop Complete
      </button>
    </div>
  ));
});

describe('ImageCropDialog', () => {
  const mockSetCrop = jest.fn();
  const mockSetZoom = jest.fn();
  const mockCreateCroppedImage = jest.fn();
  const mockOnCropCompleteCallback = jest.fn();

  const mockHookReturn = {
    crop: { x: 0, y: 0 },
    setCrop: mockSetCrop,
    zoom: 1,
    setZoom: mockSetZoom,
    onCropCompleteCallback: mockOnCropCompleteCallback,
    createCroppedImage: mockCreateCroppedImage,
  };

  beforeEach(() => {
    (useImageCrop as jest.Mock).mockReturnValue(mockHookReturn);
  });

  const mockProps = {
    open: true,
    onClose: jest.fn(),
    image: 'test-image.jpg',
    onCropComplete: jest.fn(),
  };

  // 基本的なコンポーネントのレンダリングテスト
  it('renders the component with all necessary elements', () => {
    render(<ImageCropDialog {...mockProps} />);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByTestId('mock-cropper')).toBeInTheDocument();
    expect(screen.getByRole('slider')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '完了' })).toBeInTheDocument();
  });

  // 各種インタラクションのテスト
  it('calls hook functions when interactions occur', async () => {
    const user = userEvent.setup();
    render(<ImageCropDialog {...mockProps} />);

    // クロップ位置変更のテスト
    const cropChangeButton = screen.getByTestId('mock-crop-change');
    await user.click(cropChangeButton);
    expect(mockSetCrop).toHaveBeenCalledWith({ x: 10, y: 10 });

    // ズーム変更のテスト
    const zoomChangeButton = screen.getByTestId('mock-zoom-change');
    await user.click(zoomChangeButton);
    expect(mockSetZoom).toHaveBeenCalledWith(2);

    // クロップ完了のテスト
    const cropCompleteButton = screen.getByTestId('mock-crop-complete');
    await user.click(cropCompleteButton);
    expect(mockOnCropCompleteCallback).toHaveBeenCalledWith(
      { x: 0, y: 0, width: 100, height: 100 },
      { x: 0, y: 0, width: 100, height: 100 },
    );
  });

  // 完了ボタンクリック時の処理テスト
  it('calls createCroppedImage when complete button is clicked', async () => {
    const user = userEvent.setup();
    render(<ImageCropDialog {...mockProps} />);

    const completeButton = screen.getByRole('button', { name: '完了' });
    await user.click(completeButton);

    expect(mockCreateCroppedImage).toHaveBeenCalled();
  });

  // ダイアログの非表示テスト
  it('does not render when open is false', () => {
    render(<ImageCropDialog {...mockProps} open={false} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  // ズームスライダーの操作テスト
  it('handles zoom slider changes', async () => {
    const user = userEvent.setup();
    render(<ImageCropDialog {...mockProps} />);

    const slider = screen.getByRole('slider');
    await user.type(slider, '2');

    expect(mockSetZoom).toHaveBeenCalled();
  });
});
