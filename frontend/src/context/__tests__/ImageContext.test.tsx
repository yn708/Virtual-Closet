import { processImage } from '@/utils/imageUtils';
import { act, render, renderHook, screen } from '@testing-library/react';
import { ImageProvider, useImage } from '../ImageContext';

// processImageのモック
jest.mock('@/utils/imageUtils', () => ({
  processImage: jest.fn(),
}));

// URL.createObjectURLとURL.revokeObjectURLのモック
const mockCreateObjectURL = jest.fn();
const mockRevokeObjectURL = jest.fn();
window.URL.createObjectURL = mockCreateObjectURL;
window.URL.revokeObjectURL = mockRevokeObjectURL;

describe('ImageProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCreateObjectURL.mockReturnValue('mock-url');
  });

  // 基本的なレンダリングテスト
  it('should provide image context', () => {
    const TestComponent = () => {
      const { image, preview, isProcessing } = useImage();
      return (
        <div>
          <div data-testid="image-state">{image ? 'has-image' : 'no-image'}</div>
          <div data-testid="preview-state">{preview || 'no-preview'}</div>
          <div data-testid="processing-state">{isProcessing ? 'processing' : 'not-processing'}</div>
        </div>
      );
    };

    render(
      <ImageProvider>
        <TestComponent />
      </ImageProvider>,
    );

    expect(screen.getByTestId('image-state')).toHaveTextContent('no-image');
    expect(screen.getByTestId('preview-state')).toHaveTextContent('no-preview');
    expect(screen.getByTestId('processing-state')).toHaveTextContent('not-processing');
  });

  // 通常の画像ファイル更新のテスト
  it('should handle regular image file update', async () => {
    const { result } = renderHook(() => useImage(), {
      wrapper: ImageProvider,
    });

    const file = new File(['dummy content'], 'test.jpg', { type: 'image/jpeg' });

    await act(async () => {
      result.current.setImage(file);
    });

    expect(result.current.image).toBe(file);
    expect(result.current.preview).toBe('mock-url');
    expect(result.current.isProcessing).toBe(false);
    expect(mockCreateObjectURL).toHaveBeenCalledWith(file);
  });

  // HEIC画像ファイル更新のテスト
  it('should handle HEIC image file update', async () => {
    const processedFile = new File(['processed'], 'test.jpg', {
      type: 'image/jpeg',
    });
    (processImage as jest.Mock).mockResolvedValue(processedFile);

    const { result } = renderHook(() => useImage(), {
      wrapper: ImageProvider,
    });

    const heicFile = new File(['dummy content'], 'test.heic', {
      type: 'image/heic',
    });

    await act(async () => {
      result.current.setImage(heicFile);
    });

    expect(processImage).toHaveBeenCalledWith(heicFile);
    expect(result.current.image).toBe(processedFile);
    expect(result.current.preview).toBe('mock-url');
    expect(result.current.isProcessing).toBe(false);
  });

  // 画像クリアのテスト
  it('should clear image and preview', async () => {
    const { result } = renderHook(() => useImage(), {
      wrapper: ImageProvider,
    });

    const file = new File(['dummy content'], 'test.jpg', { type: 'image/jpeg' });
    await act(async () => {
      result.current.setImage(file);
    });

    act(() => {
      result.current.clearImage();
    });

    expect(result.current.image).toBeNull();
    expect(result.current.preview).toBeNull();
    expect(result.current.isProcessing).toBe(false);
    expect(mockRevokeObjectURL).toHaveBeenCalledWith('mock-url');
  });

  // エラーハンドリングのテスト
  it('should handle errors during image processing', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    (processImage as jest.Mock).mockRejectedValue(new Error('Processing failed'));

    const { result } = renderHook(() => useImage(), {
      wrapper: ImageProvider,
    });

    const heicFile = new File(['dummy content'], 'test.heic', {
      type: 'image/heic',
    });

    await act(async () => {
      result.current.setImage(heicFile);
    });

    expect(result.current.isProcessing).toBe(false);
    expect(consoleErrorSpy).toHaveBeenCalled();
    expect(result.current.image).toBeNull();
    expect(result.current.preview).toBeNull();

    consoleErrorSpy.mockRestore();
  });

  // nullファイルでのクリアテスト
  it('should clear image when null file is provided', async () => {
    const { result } = renderHook(() => useImage(), {
      wrapper: ImageProvider,
    });

    const file = new File(['dummy content'], 'test.jpg', { type: 'image/jpeg' });
    await act(async () => {
      result.current.setImage(file);
    });

    await act(async () => {
      result.current.setImage(null);
    });

    expect(result.current.image).toBeNull();
    expect(result.current.preview).toBeNull();
    expect(result.current.isProcessing).toBe(false);
  });
});
