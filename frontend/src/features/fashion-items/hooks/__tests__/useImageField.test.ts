import { useImage } from '@/context/ImageContext';
import { useImageSelection } from '@/hooks/image/useImageSelection';
import { act, renderHook } from '@testing-library/react';
import { useImageField } from '../useImageField';

jest.mock('@/context/ImageContext', () => ({
  useImage: jest.fn(),
}));

jest.mock('@/hooks/image/useImageSelection', () => ({
  useImageSelection: jest.fn(),
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

  // 最初の2つのテストケースは変更なし
  it('初期状態でfileInputRefが存在すること', () => {
    const { result } = renderHook(() => useImageField());
    expect(result.current.fileInputRef).toBeDefined();
    expect(result.current.fileInputRef.current).toBeNull();
  });

  it('handleChangeClickが呼び出されたときにfileInputのclickが実行されること', () => {
    const { result } = renderHook(() => useImageField());
    const mockClick = jest.fn();

    Object.defineProperty(result.current.fileInputRef, 'current', {
      value: { click: mockClick },
      writable: true,
    });

    result.current.handleChangeClick();
    expect(mockClick).toHaveBeenCalled();
  });

  it('handleFileSelectが正しく動作すること', async () => {
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
      await result.current.handleFileSelect(mockEvent);
    });

    expect(mockHandleFileChange).toHaveBeenCalledWith(mockEvent);
    expect(mockOptimizationProcess).toHaveBeenCalledWith(mockImage);
    expect(mockMinimumImageSet).toHaveBeenCalledWith(mockOptimizedFile);
  });

  it('handleToggleImageが通常画像から背景除去画像に切り替わること', async () => {
    // 初期状態で通常画像を設定
    const mockNormalImage = new File([''], 'normal.png', { type: 'image/png' });
    const { result, rerender } = renderHook(() => useImageField());

    // 通常画像の状態を設定
    (useImage as jest.Mock).mockReturnValue({
      image: mockNormalImage,
      optimizationProcess: mockOptimizationProcess,
      removeBgProcess: mockRemoveBgProcess,
      minimumImageSet: mockMinimumImageSet,
    });

    // コンポーネントの再レンダリングをトリガー
    rerender();

    // useEffect内の状態更新を待つ
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    // handleToggleImageを実行
    await act(async () => {
      await result.current.handleToggleImage();
    });

    expect(mockRemoveBgProcess).toHaveBeenCalled();
    expect(result.current.isShowingRemovedBg).toBe(true);
  });

  it('背景除去画像と通常画像の切り替えが正しく動作すること', async () => {
    const mockNormalImage = new File([''], 'normal.png', { type: 'image/png' });
    const mockRemovedBgImage = new File([''], 'image_removed_bg.png', { type: 'image/png' });

    // カスタムフックをレンダリング
    const { result, rerender } = renderHook(() => useImageField());

    // 通常画像の状態を設定
    (useImage as jest.Mock).mockReturnValue({
      image: mockNormalImage,
      optimizationProcess: mockOptimizationProcess,
      removeBgProcess: jest.fn().mockResolvedValue(mockRemovedBgImage),
      minimumImageSet: mockMinimumImageSet,
    });

    // コンポーネントの再レンダリングをトリガー
    rerender();

    // useEffect内の状態更新を待つ
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    // 最初の切り替え（通常画像 → 背景除去画像）
    await act(async () => {
      await result.current.handleToggleImage();
    });

    // 背景除去画像の状態を設定
    (useImage as jest.Mock).mockReturnValue({
      image: mockRemovedBgImage,
      optimizationProcess: mockOptimizationProcess,
      removeBgProcess: jest.fn().mockResolvedValue(mockRemovedBgImage),
      minimumImageSet: mockMinimumImageSet,
    });

    rerender();

    // useEffect内の状態更新を待つ
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    // 2回目の切り替え（背景除去画像 → 通常画像）
    await act(async () => {
      await result.current.handleToggleImage();
    });

    expect(mockMinimumImageSet).toHaveBeenCalledWith(mockNormalImage);
    expect(result.current.isShowingRemovedBg).toBe(false);
  });

  it('imageの状態変更でDataTransferが正しく設定されること', async () => {
    const mockAdd = jest.fn();
    const mockDataTransfer = {
      items: { add: mockAdd },
      files: {},
    };

    global.DataTransfer = jest.fn(() => mockDataTransfer) as unknown as typeof DataTransfer;

    const { result, rerender } = renderHook(() => useImageField());

    Object.defineProperty(result.current.fileInputRef, 'current', {
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
});
