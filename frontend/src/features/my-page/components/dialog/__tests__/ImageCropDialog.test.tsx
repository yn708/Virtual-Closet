// ImageCropDialog.test.tsx
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ImageCropDialog from '../ImageCropDialog';

// Dialogコンポーネントのモック
jest.mock('@/components/ui/dialog', () => ({
  Dialog: ({ children, open }: { children: React.ReactNode; open: boolean }) =>
    open ? <div role="dialog">{children}</div> : null,
  DialogContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

// Sliderコンポーネントのモック
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
    />
  ),
}));

// react-easy-cropのモック
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
  const mockProps = {
    open: true,
    onClose: jest.fn(),
    image: 'test-image.jpg',
    onCropComplete: jest.fn(),
  };

  // 基本的なレンダリングテスト
  it('renders dialog when open is true', () => {
    render(<ImageCropDialog {...mockProps} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByTestId('mock-cropper')).toBeInTheDocument();
  });

  // ダイアログが閉じている場合のテスト
  it('does not render dialog when open is false', () => {
    render(<ImageCropDialog {...mockProps} open={false} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  // スライダーの動作テスト
  it('updates zoom when slider value changes', async () => {
    const user = userEvent.setup();
    render(<ImageCropDialog {...mockProps} />);

    const slider = screen.getByRole('slider');
    await user.click(slider);

    await waitFor(() => {
      expect(slider).toHaveValue('1');
    });
  });

  // クロップ位置の更新テスト
  it('updates crop position', () => {
    render(<ImageCropDialog {...mockProps} />);

    const cropChangeButton = screen.getByTestId('mock-crop-change');
    fireEvent.click(cropChangeButton);

    const completeButton = screen.getByRole('button', { name: '完了' });
    expect(completeButton).toBeInTheDocument();
  });

  // アクセシビリティテスト
  describe('accessibility', () => {
    it('has proper slider controls', () => {
      render(<ImageCropDialog {...mockProps} />);

      const slider = screen.getByRole('slider');
      expect(slider).toHaveAttribute('min', '1');
      expect(slider).toHaveAttribute('max', '3');
      expect(slider).toHaveAttribute('step', '0.05');
    });

    it('has accessible buttons', () => {
      render(<ImageCropDialog {...mockProps} />);

      const completeButton = screen.getByRole('button', { name: '完了' });
      expect(completeButton).toBeInTheDocument();
    });
  });
});
