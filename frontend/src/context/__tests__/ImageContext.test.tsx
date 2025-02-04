import { removeBackgroundAPI } from '@/lib/api/imageApi';
import { compressImage, conversionImage, createImagePreview } from '@/utils/imageUtils';
import { act, render, renderHook, screen } from '@testing-library/react';
import { ImageProvider, useImage } from '../ImageContext';

// APIのモック
jest.mock('@/lib/api/imageApi', () => ({
  removeBackgroundAPI: jest.fn().mockImplementation((_formData) =>
    Promise.resolve({
      status: 'success',
      image: 'mock-base64-image',
    }),
  ),
}));

// ユーティリティ関数のモック
jest.mock('@/utils/imageUtils', () => ({
  compressImage: jest.fn().mockImplementation((file) => Promise.resolve(file)),
  conversionImage: jest.fn().mockImplementation((file) => Promise.resolve(file)),
  dataURLtoFile: jest.fn().mockImplementation(() => new File([''], 'test_removed_bg.png')),
  createImagePreview: jest.fn().mockImplementation(() => Promise.resolve('mock-url')),
}));

// URLユーティリティのモック
const mockCreateObjectURL = jest.fn().mockReturnValue('mock-url');
const mockRevokeObjectURL = jest.fn();
window.URL.createObjectURL = mockCreateObjectURL;
window.URL.revokeObjectURL = mockRevokeObjectURL;

describe('ImageProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // 基本的なコンテキスト提供のテスト
  it('provides default values', () => {
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

  // 最小限の画像設定テスト
  it('handles minimumImageSet correctly', async () => {
    const { result } = renderHook(() => useImage(), {
      wrapper: ImageProvider,
    });

    const testFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

    await act(async () => {
      await result.current.minimumImageSet(testFile);
    });

    expect(result.current.image).toBe(testFile);
    expect(result.current.preview).toBe('mock-url');
    expect(mockCreateObjectURL).toHaveBeenCalledWith(testFile);
  });

  // 画像の最適化処理テスト
  it('handles image optimization correctly', async () => {
    const { result } = renderHook(() => useImage(), {
      wrapper: ImageProvider,
    });

    const testFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

    await act(async () => {
      await result.current.optimizationProcess(testFile);
    });

    expect(compressImage).toHaveBeenCalled();
    expect(result.current.isProcessing).toBe(false);
    expect(result.current.image).toBeTruthy();
    expect(result.current.preview).toBe('mock-url');
  });

  // HEIC画像の最適化処理テスト
  it('handles HEIC image optimization', async () => {
    const { result } = renderHook(() => useImage(), {
      wrapper: ImageProvider,
    });

    const heicFile = new File(['test'], 'test.heic', { type: 'image/heic' });

    await act(async () => {
      await result.current.optimizationProcess(heicFile);
    });

    expect(conversionImage).toHaveBeenCalledWith(heicFile);
    expect(compressImage).toHaveBeenCalled();
    expect(result.current.isProcessing).toBe(false);
  });

  // 背景除去処理のテスト
  describe('removeBgProcess', () => {
    it('handles new image correctly', async () => {
      const { result } = renderHook(() => useImage(), {
        wrapper: ImageProvider,
      });

      const testFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

      await act(async () => {
        await result.current.removeBgProcess(testFile);
      });

      expect(removeBackgroundAPI).toHaveBeenCalled();
      expect(result.current.image).toBeTruthy();
      expect(result.current.preview).toBe('mock-url');
      expect(result.current.isProcessing).toBe(false);
    });
  });

  // クリア機能のテスト
  it('clears image state correctly', async () => {
    const { result } = renderHook(() => useImage(), {
      wrapper: ImageProvider,
    });

    const testFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

    await act(async () => {
      await result.current.minimumImageSet(testFile);
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
  it('handles errors in removeBgProcess', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const mockRemoveBackgroundAPI = removeBackgroundAPI as jest.Mock;
    mockRemoveBackgroundAPI.mockRejectedValueOnce(new Error('API Error'));

    const { result } = renderHook(() => useImage(), {
      wrapper: ImageProvider,
    });

    const testFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

    await act(async () => {
      const resultFile = await result.current.removeBgProcess(testFile);
      expect(resultFile).toBeNull();
    });

    expect(consoleErrorSpy).toHaveBeenCalled();
    expect(result.current.isProcessing).toBe(false);

    consoleErrorSpy.mockRestore();
  });

  // コンテキスト外使用のエラーテスト
  it('throws error when used outside provider', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      renderHook(() => useImage());
    }).toThrow('useImage must be used within an ImageProvider');

    consoleError.mockRestore();
  });

  // compressImageProcess のテスト
  it('handles compressImageProcess correctly', async () => {
    const { result } = renderHook(() => useImage(), { wrapper: ImageProvider });
    const testFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

    let returnedFile: File | null = null;
    await act(async () => {
      returnedFile = await result.current.compressImageProcess(testFile);
    });

    // compressImage のモック実装ではそのまま testFile を返す
    expect(returnedFile).toBe(testFile);
    expect(compressImage).toHaveBeenCalledWith(testFile);
    expect(result.current.isProcessing).toBe(false);
  });

  // createImageUrl のテスト
  it('handles createImageUrl correctly', async () => {
    const { result } = renderHook(() => useImage(), { wrapper: ImageProvider });
    const testFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

    let returnedUrl: string | null = null;
    await act(async () => {
      returnedUrl = await result.current.createImageUrl(testFile);
    });

    // conversionImage のモック実装ではそのまま testFile を返すため、
    // createImagePreview には testFile が渡される（またはモック実装に合わせた値）
    expect(returnedUrl).toBe('mock-url');
    expect(conversionImage).toHaveBeenCalledWith(testFile);
    expect(createImagePreview).toHaveBeenCalledWith(testFile);
    expect(result.current.isProcessing).toBe(false);
  });
});
