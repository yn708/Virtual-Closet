// useImageCrop.test.ts
import { act, renderHook } from '@testing-library/react';
import type { CroppedArea } from '../../types';
import { useImageCrop } from '../useImageCrop';

describe('useImageCrop', () => {
  // キャンバス関連のモック設定
  let mockCanvasContext: Partial<CanvasRenderingContext2D>;
  let mockCanvas: Partial<HTMLCanvasElement>;
  // テスト実行前の共通セットアップ
  beforeAll(() => {
    // キャンバスコンテキストのモック作成
    mockCanvasContext = {
      beginPath: jest.fn(),
      arc: jest.fn(),
      clip: jest.fn(),
      drawImage: jest.fn(),
    };

    // キャンバス要素のモック作成
    mockCanvas = {
      getContext: jest.fn().mockReturnValue(mockCanvasContext),
      toDataURL: jest.fn().mockReturnValue('data:image/png;base64,mockedData'),
    };

    // canvas要素生成のモック化
    const originalCreateElement = document.createElement.bind(document);
    jest.spyOn(document, 'createElement').mockImplementation((tagName: string): HTMLElement => {
      if (tagName === 'canvas') {
        return mockCanvas as HTMLCanvasElement;
      }
      return originalCreateElement(tagName);
    });

    // Image要素のモック化
    global.Image = class {
      public onload: (() => void) | null = null;
      public src: string = '';

      constructor() {
        setTimeout(() => {
          if (this.onload) {
            this.onload();
          }
        }, 0);
      }
    } as unknown as typeof Image;
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Mock props
  const mockProps = {
    image: 'test-image.jpg',
    onCropComplete: jest.fn(),
    onClose: jest.fn(),
  };

  // 初期値の検証テスト
  it('should initialize with default values', () => {
    const { result } = renderHook(() => useImageCrop(mockProps));

    expect(result.current.crop).toEqual({ x: 0, y: 0 });
    expect(result.current.zoom).toBe(1);
  });

  // クロップ位置更新のテスト
  it('should update crop position', () => {
    const { result } = renderHook(() => useImageCrop(mockProps));

    act(() => {
      result.current.setCrop({ x: 10, y: 20 });
    });

    expect(result.current.crop).toEqual({ x: 10, y: 20 });
  });

  // ズームレベル更新のテスト
  it('should update zoom level', () => {
    const { result } = renderHook(() => useImageCrop(mockProps));

    act(() => {
      result.current.setZoom(2);
    });

    expect(result.current.zoom).toBe(2);
  });

  // クロップ完了コールバックのテスト
  it('should handle onCropCompleteCallback', () => {
    const { result } = renderHook(() => useImageCrop(mockProps));
    const mockCroppedArea: CroppedArea = { x: 0, y: 0, width: 100, height: 100 };
    const mockCroppedAreaPixels: CroppedArea = { x: 0, y: 0, width: 200, height: 200 };

    act(() => {
      result.current.onCropCompleteCallback(mockCroppedArea, mockCroppedAreaPixels);
    });
  });

  // 画像生成処理の正常系テスト
  it('should create cropped image and call callbacks', async () => {
    const { result } = renderHook(() => useImageCrop(mockProps));

    // クロップエリアの設定
    act(() => {
      result.current.onCropCompleteCallback(
        { x: 0, y: 0, width: 100, height: 100 },
        { x: 0, y: 0, width: 100, height: 100 },
      );
    });

    await act(async () => {
      await result.current.createCroppedImage();
    });

    expect(mockCanvasContext.beginPath).toHaveBeenCalled();
    expect(mockCanvasContext.arc).toHaveBeenCalled();
    expect(mockCanvasContext.clip).toHaveBeenCalled();
    expect(mockCanvasContext.drawImage).toHaveBeenCalled();
    expect(mockProps.onCropComplete).toHaveBeenCalled();
    expect(mockProps.onClose).toHaveBeenCalled();
  });

  // クロップエリアが未設定時のエラー処理テスト
  it('should not create cropped image when croppedAreaPixels is null', async () => {
    const { result } = renderHook(() => useImageCrop(mockProps));

    await act(async () => {
      await result.current.createCroppedImage();
    });

    expect(mockProps.onCropComplete).not.toHaveBeenCalled();
    expect(mockProps.onClose).not.toHaveBeenCalled();
  });
});
