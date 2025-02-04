import type { CroppedArea } from '@/features/my-page/profile/types';
import { act, renderHook } from '@testing-library/react';
import { useImageCrop } from '../useImageCrop';

describe('useImageCrop', () => {
  let mockCanvasContext: Partial<CanvasRenderingContext2D>;
  let mockCanvas: Partial<HTMLCanvasElement>;

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

    // document.createElement('canvas') のモック化
    const originalCreateElement = document.createElement.bind(document);
    jest.spyOn(document, 'createElement').mockImplementation((tagName: string): HTMLElement => {
      if (tagName === 'canvas') {
        return mockCanvas as HTMLCanvasElement;
      }
      return originalCreateElement(tagName);
    });

    // Image 要素のモック化
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

  // モック用の props（cropShape は 'round' を指定）
  const mockProps = {
    image: 'test-image.jpg',
    onCropComplete: jest.fn(),
    onClose: jest.fn(),
    cropShape: 'round' as const,
  };

  // 初期値の検証（crop と zoom）
  it('should initialize with default values', () => {
    const { result } = renderHook(() => useImageCrop(mockProps));
    expect(result.current.crop).toEqual({ x: 0, y: 0 });
    expect(result.current.zoom).toBe(1);
  });

  // crop の更新テスト
  it('should update crop position', () => {
    const { result } = renderHook(() => useImageCrop(mockProps));
    act(() => {
      result.current.setCrop({ x: 10, y: 20 });
    });
    expect(result.current.crop).toEqual({ x: 10, y: 20 });
  });

  // zoom の更新テスト
  it('should update zoom level', () => {
    const { result } = renderHook(() => useImageCrop(mockProps));
    act(() => {
      result.current.setZoom(2);
    });
    expect(result.current.zoom).toBe(2);
  });

  // onCropCompleteCallback の直接テストは行わず、createCroppedImage で副作用を確認
  it('should create cropped image and call callbacks', async () => {
    const { result } = renderHook(() => useImageCrop(mockProps));
    const cropArea: CroppedArea = { x: 0, y: 0, width: 100, height: 100 };

    // onCropCompleteCallback を呼び出し、内部状態（croppedAreaPixels）を更新する
    act(() => {
      result.current.onCropCompleteCallback(cropArea, cropArea);
    });

    // createCroppedImage の呼び出し時に、内部で画像の描画や変換が行われ、onCropComplete と onClose が呼ばれることを確認
    await act(async () => {
      await result.current.createCroppedImage();
    });

    // 円形クロップの場合、クリッピング処理が呼ばれているはず
    expect(mockCanvasContext.beginPath).toHaveBeenCalled();
    expect(mockCanvasContext.arc).toHaveBeenCalledWith(
      50, // canvas.width / 2
      50, // canvas.height / 2
      50, // Math.min(canvas.width, canvas.height) / 2 (100 / 2)
      0,
      2 * Math.PI,
    );
    expect(mockCanvasContext.clip).toHaveBeenCalled();
    expect(mockCanvasContext.drawImage).toHaveBeenCalled();
    // コールバックの呼び出しを確認
    expect(mockProps.onCropComplete).toHaveBeenCalled();
    expect(mockProps.onClose).toHaveBeenCalled();
  });

  // croppedAreaPixels が未設定の場合、createCroppedImage は何も実行しないことを確認
  it('should not create cropped image when croppedAreaPixels is null', async () => {
    const { result } = renderHook(() => useImageCrop(mockProps));
    await act(async () => {
      await result.current.createCroppedImage();
    });
    expect(mockProps.onCropComplete).not.toHaveBeenCalled();
    expect(mockProps.onClose).not.toHaveBeenCalled();
  });
});
