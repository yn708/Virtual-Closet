import { useImage } from '@/context/ImageContext';
import { useIsOpen } from '@/hooks/utils/useIsOpen';
import { act, renderHook } from '@testing-library/react';
import { useImageCropDisplay } from '../useImageCropDisplay';
import { useImageSelection } from '../useImageSelection';

// 依存モジュールのモック化
jest.mock('@/context/ImageContext', () => ({
  useImage: jest.fn(),
}));
jest.mock('../../utils/useIsOpen', () => ({
  useIsOpen: jest.fn(),
}));
jest.mock('./../useImageSelection', () => ({
  useImageSelection: jest.fn(),
}));

describe('useImageCropDisplay', () => {
  const onCloseMock = jest.fn();
  const onToggleMock = jest.fn();
  const handleFileChangeMock = jest.fn();
  const minimumImageSetMock = jest.fn();
  const compressImageProcessMock = jest.fn();
  const createImageUrlMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    // useIsOpen のモック
    (useIsOpen as jest.Mock).mockReturnValue({
      isOpen: false,
      onClose: onCloseMock,
      onToggle: onToggleMock,
    });
    // useImageSelection のモック
    (useImageSelection as jest.Mock).mockReturnValue({
      handleFileChange: handleFileChangeMock,
    });
    // useImage のモック
    (useImage as jest.Mock).mockReturnValue({
      minimumImageSet: minimumImageSetMock,
      compressImageProcess: compressImageProcessMock,
      createImageUrl: createImageUrlMock,
    });
  });

  // 初期状態の検証
  it('should initialize with default values', () => {
    const { result } = renderHook(() => useImageCropDisplay());
    expect(result.current.isOpen).toBe(false);
    expect(result.current.imageToEdit).toBeNull();
    expect(result.current.processLoading).toBe(false);
  });

  // handleFileSelect のテスト
  it('handleFileSelect should process file and update imageToEdit and processLoading', async () => {
    // テスト用ファイルとプレビュー用URLを用意
    const file = new File(['dummy content'], 'test.png', { type: 'image/png' });
    const previewUrl = 'preview-url.png';
    // handleFileChange はファイルを返す
    handleFileChangeMock.mockResolvedValue({ file });
    // createImageUrl は previewUrl を返す
    createImageUrlMock.mockResolvedValue(previewUrl);

    const { result } = renderHook(() => useImageCropDisplay());
    // ダミーの change event（内容は不要なのでキャスト）
    const fakeEvent = {} as React.ChangeEvent<HTMLInputElement>;

    await act(async () => {
      await result.current.handleFileSelect(fakeEvent);
    });

    // handleFileChange に渡されたイベントが正しいこと
    expect(handleFileChangeMock).toHaveBeenCalledWith(fakeEvent);
    // ファイルが存在した場合は onToggle が呼ばれる
    expect(onToggleMock).toHaveBeenCalled();
    // createImageUrl にファイルが渡される
    expect(createImageUrlMock).toHaveBeenCalledWith(file);
    // imageToEdit がプレビューURLに更新される
    expect(result.current.imageToEdit).toBe(previewUrl);
    // processLoading が最終的に false になっている
    expect(result.current.processLoading).toBe(false);
  });

  // handleCropComplete のテスト
  it('handleCropComplete should compress file, call minimumImageSet, invoke callback if provided, and call onClose', async () => {
    const fakeCroppedFile = new File(['dummy'], 'cropped.png', { type: 'image/png' });
    const fakeCompressedFile = new File(['dummy'], 'compressed.png', { type: 'image/png' });
    compressImageProcessMock.mockResolvedValue(fakeCompressedFile);

    const callbackMock = jest.fn();

    const { result } = renderHook(() => useImageCropDisplay());

    // コールバックなしの場合
    await act(async () => {
      await result.current.handleCropComplete(fakeCroppedFile);
    });
    expect(compressImageProcessMock).toHaveBeenCalledWith(fakeCroppedFile);
    expect(minimumImageSetMock).toHaveBeenCalledWith(fakeCompressedFile);
    expect(callbackMock).not.toHaveBeenCalled();
    expect(onCloseMock).toHaveBeenCalled();
    expect(result.current.processLoading).toBe(false);

    // モックのクリア
    jest.clearAllMocks();
    (useIsOpen as jest.Mock).mockReturnValue({
      isOpen: false,
      onClose: onCloseMock,
      onToggle: onToggleMock,
    });
    (useImage as jest.Mock).mockReturnValue({
      minimumImageSet: minimumImageSetMock,
      compressImageProcess: compressImageProcessMock,
      createImageUrl: createImageUrlMock,
    });

    const { result: result2 } = renderHook(() => useImageCropDisplay());
    // コールバックありの場合
    await act(async () => {
      await result2.current.handleCropComplete(fakeCroppedFile, callbackMock);
    });
    expect(compressImageProcessMock).toHaveBeenCalledWith(fakeCroppedFile);
    expect(minimumImageSetMock).toHaveBeenCalledWith(fakeCompressedFile);
    expect(callbackMock).toHaveBeenCalledWith(fakeCompressedFile);
    expect(onCloseMock).toHaveBeenCalled();
    expect(result2.current.processLoading).toBe(false);
  });

  // handleCropClose のテスト
  it('handleCropClose should call onClose and set imageToEdit to null', async () => {
    // まずは handleFileSelect を使って imageToEdit を更新する流れをシミュレーション
    const file = new File(['dummy content'], 'test.png', { type: 'image/png' });
    const previewUrl = 'preview-url.png';
    handleFileChangeMock.mockResolvedValue({ file });
    createImageUrlMock.mockResolvedValue(previewUrl);

    const { result } = renderHook(() => useImageCropDisplay());
    const fakeEvent = {} as React.ChangeEvent<HTMLInputElement>;
    await act(async () => {
      await result.current.handleFileSelect(fakeEvent);
    });
    // imageToEdit が更新されていることを確認
    expect(result.current.imageToEdit).toBe(previewUrl);

    // handleCropClose の実行
    await act(async () => {
      await result.current.handleCropClose();
    });
    // onClose が呼ばれていること、かつ imageToEdit が null にリセットされることを検証
    expect(onCloseMock).toHaveBeenCalled();
    expect(result.current.imageToEdit).toBeNull();
  });
});
