import { useImage } from '@/context/ImageContext';
import { useImageSelection } from '@/hooks/image/useImageSelection';
import { act, renderHook } from '@testing-library/react';
import type React from 'react';
import { useImageField } from '../useImageField';

jest.mock('@/context/ImageContext', () => ({
  useImage: jest.fn(),
}));

jest.mock('@/hooks/image/useImageSelection', () => ({
  useImageSelection: jest.fn(),
}));

// toast フックのモック
jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: jest.fn(),
  }),
}));

// isOpen フックのモック
jest.mock('@/hooks/utils/useIsOpen', () => ({
  useIsOpen: () => ({
    isOpen: false,
    onToggle: jest.fn(),
    onClose: jest.fn(),
  }),
}));

// imageUtils のモック（handleCropOpen 用）
jest.mock('@/utils/imageUtils', () => ({
  createImagePreview: jest.fn().mockResolvedValue('mock-preview-url'),
}));

describe('useImageField', () => {
  const mockOptimizationProcess = jest.fn();
  const mockRemoveBgProcess = jest.fn();
  const mockMinimumImageSet = jest.fn();
  const mockHandleFileChange = jest.fn();
  const mockImage = new File([''], 'test.png', { type: 'image/png' });

  beforeEach(() => {
    jest.clearAllMocks();

    (useImage as jest.Mock).mockReturnValue({
      image: null,
      optimizationProcess: mockOptimizationProcess,
      removeBgProcess: mockRemoveBgProcess,
      minimumImageSet: mockMinimumImageSet,
    });

    (useImageSelection as jest.Mock).mockReturnValue({
      handleFileChange: mockHandleFileChange,
    });
  });

  it('初期状態で state.fileInputRef が存在すること', () => {
    const { result } = renderHook(() => useImageField());
    expect(result.current.state.fileInputRef).toBeDefined();
    expect(result.current.state.fileInputRef.current).toBeNull();
  });

  it('handleChangeClick が呼ばれたときに fileInput の click が実行されること', () => {
    const { result } = renderHook(() => useImageField());
    const mockClick = jest.fn();
    Object.defineProperty(result.current.state.fileInputRef, 'current', {
      value: { click: mockClick },
      writable: true,
    });
    result.current.handlers.handleChangeClick();
    expect(mockClick).toHaveBeenCalled();
  });

  it('handleFileSelect が正しく動作すること', async () => {
    const mockOptimizedFile = new File([''], 'optimized.png', { type: 'image/png' });
    mockHandleFileChange.mockResolvedValue({ file: mockImage });
    mockOptimizationProcess.mockResolvedValue(mockOptimizedFile);

    const { result } = renderHook(() => useImageField());
    const mockEvent = {
      target: {
        files: [mockImage],
      },
    } as unknown as React.ChangeEvent<HTMLInputElement>;

    await act(async () => {
      await result.current.handlers.handleFileSelect(mockEvent);
    });

    expect(mockHandleFileChange).toHaveBeenCalledWith(mockEvent);
    expect(mockOptimizationProcess).toHaveBeenCalledWith(mockImage);
    expect(mockMinimumImageSet).toHaveBeenCalledWith(mockOptimizedFile);
  });

  it('handleToggleImage が通常画像から背景除去画像に切り替わること', async () => {
    // 初期状態で通常画像を設定
    const mockNormalImage = new File([''], 'normal.png', { type: 'image/png' });
    const mockRemovedBgImage = new File([''], 'normal_removed_bg.png', { type: 'image/png' });
    const { result, rerender } = renderHook(() => useImageField());

    // 通常画像の状態を設定
    (useImage as jest.Mock).mockReturnValue({
      image: mockNormalImage,
      optimizationProcess: mockOptimizationProcess,
      // ここで返り値を File に設定する
      removeBgProcess: jest.fn().mockResolvedValue(mockRemovedBgImage),
      minimumImageSet: mockMinimumImageSet,
    });

    // コンポーネントの再レンダリングをトリガー
    rerender();

    // useEffect 内の状態更新を待つ
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    // handleToggleImage を実行
    await act(async () => {
      await result.current.handlers.handleToggleImage();
    });

    expect(result.current.state.isShowingRemovedBg).toBe(true);
  });

  it('背景除去画像と通常画像の切り替えが正しく動作すること', async () => {
    const mockNormalImage = new File([''], 'normal.png', { type: 'image/png' });
    const mockRemovedBgImage = new File([''], 'image_removed_bg.png', { type: 'image/png' });
    const { result, rerender } = renderHook(() => useImageField());

    (useImage as jest.Mock).mockReturnValue({
      image: mockNormalImage,
      optimizationProcess: mockOptimizationProcess,
      removeBgProcess: jest.fn().mockResolvedValue(mockRemovedBgImage),
      minimumImageSet: mockMinimumImageSet,
    });
    rerender();

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    // 最初の切り替え：通常画像 → 背景除去画像
    await act(async () => {
      await result.current.handlers.handleToggleImage();
    });

    // 次の切り替えのため、背景除去画像の状態を設定
    (useImage as jest.Mock).mockReturnValue({
      image: mockRemovedBgImage,
      optimizationProcess: mockOptimizationProcess,
      removeBgProcess: jest.fn().mockResolvedValue(mockRemovedBgImage),
      minimumImageSet: mockMinimumImageSet,
    });
    rerender();

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    // 2回目の切り替え：背景除去画像 → 通常画像
    await act(async () => {
      await result.current.handlers.handleToggleImage();
    });

    expect(mockMinimumImageSet).toHaveBeenCalledWith(mockNormalImage);
    expect(result.current.state.isShowingRemovedBg).toBe(false);
  });

  it('image の状態変更で DataTransfer が正しく設定されること', async () => {
    const mockAdd = jest.fn();
    const mockDataTransfer = {
      items: { add: mockAdd },
      files: {},
    };
    global.DataTransfer = jest.fn(() => mockDataTransfer) as unknown as typeof DataTransfer;

    const { result, rerender } = renderHook(() => useImageField());
    Object.defineProperty(result.current.state.fileInputRef, 'current', {
      value: { files: null },
      writable: true,
    });

    await act(async () => {
      (useImage as jest.Mock).mockReturnValue({
        image: mockImage,
        optimizationProcess: mockOptimizationProcess,
        removeBgProcess: mockRemoveBgProcess,
        minimumImageSet: mockMinimumImageSet,
      });
      rerender();
    });

    expect(mockAdd).toHaveBeenCalledWith(mockImage);
  });

  // 新たに追加されたハンドラーのテスト

  it('handleCropOpen が正しく動作すること', async () => {
    const { result } = renderHook(() => useImageField());
    await act(async () => {
      await result.current.handlers.handleCropOpen();
    });
    // createImagePreview のモックで 'mock-preview-url' を返すため、それが imageToEdit にセットされる
    expect(result.current.state.imageToEdit).toBe('mock-preview-url');
  });

  it('handleCropComplete が正常に minimumImageSet を呼び出し、imageToEdit をクリアすること', async () => {
    const croppedFile = new File([''], 'cropped.png', { type: 'image/png' });
    const { result } = renderHook(() => useImageField());
    await act(async () => {
      await result.current.handlers.handleCropComplete(croppedFile);
    });
    expect(mockMinimumImageSet).toHaveBeenCalledWith(croppedFile);
    expect(result.current.state.imageToEdit).toBeNull();
  });

  it('handleCropClose が正常に onClose を呼び出し、imageToEdit をクリアすること', async () => {
    const { result } = renderHook(() => useImageField());
    await act(async () => {
      await result.current.handlers.handleCropClose();
    });
    expect(result.current.state.imageToEdit).toBeNull();
  });
});
