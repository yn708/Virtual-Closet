import { useImage } from '@/context/ImageContext';
import { useImageSelection } from '@/hooks/image/useImageSelection';
import { renderHook } from '@testing-library/react';
import { useImageField } from '../useImageField';

// モックの設定
jest.mock('@/context/ImageContext', () => ({
  useImage: jest.fn(),
}));

jest.mock('@/hooks/image/useImageSelection', () => ({
  useImageSelection: jest.fn(),
}));

describe('useImageField', () => {
  const mockRemoveBgProcess = jest.fn();
  const mockHandleFileChange = jest.fn();
  const mockImage = new File([''], 'test.png', { type: 'image/png' });
  let mockFileList: FileList;

  beforeEach(() => {
    jest.clearAllMocks();

    // FileListのモック作成
    mockFileList = {
      0: mockImage,
      length: 1,
      item: () => mockImage,
    } as unknown as FileList;

    // useImage のモック実装
    (useImage as jest.Mock).mockReturnValue({
      image: null,
      removeBgProcess: mockRemoveBgProcess,
    });

    // useImageSelection のモック実装
    (useImageSelection as jest.Mock).mockReturnValue({
      handleFileChange: mockHandleFileChange,
    });
  });

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
    const mockFile = new File([''], 'test.png', { type: 'image/png' });
    mockHandleFileChange.mockResolvedValue({ file: mockFile });

    const { result } = renderHook(() => useImageField());

    const mockEvent = {
      target: {
        files: mockFileList,
      },
      currentTarget: {
        files: mockFileList,
      },
      preventDefault: jest.fn(),
      stopPropagation: jest.fn(),
      nativeEvent: new Event('change'),
      bubbles: true,
      cancelable: true,
      timeStamp: Date.now(),
      type: 'change',
    } as unknown as React.ChangeEvent<HTMLInputElement>;

    await result.current.handleFileSelect(mockEvent);

    expect(mockHandleFileChange).toHaveBeenCalledWith(mockEvent);
    expect(mockRemoveBgProcess).toHaveBeenCalledWith(mockFile);
  });

  it('handleFileSelectでファイルが返されない場合、removeBgProcessが呼ばれないこと', async () => {
    mockHandleFileChange.mockResolvedValue({ file: null });

    const { result } = renderHook(() => useImageField());

    const mockEvent = {
      target: {
        files: null,
      },
      currentTarget: {
        files: null,
      },
      preventDefault: jest.fn(),
      stopPropagation: jest.fn(),
      nativeEvent: new Event('change'),
      bubbles: true,
      cancelable: true,
      timeStamp: Date.now(),
      type: 'change',
    } as unknown as React.ChangeEvent<HTMLInputElement>;

    await result.current.handleFileSelect(mockEvent);

    expect(mockHandleFileChange).toHaveBeenCalledWith(mockEvent);
    expect(mockRemoveBgProcess).not.toHaveBeenCalled();
  });

  it('イメージが変更されたときにDataTransferが正しく設定されること', async () => {
    const mockAdd = jest.fn();
    const mockDataTransfer = {
      items: {
        add: mockAdd,
      },
      files: mockFileList,
    };

    // グローバルのDataTransfer型を拡張
    global.DataTransfer = jest.fn(() => mockDataTransfer) as unknown as typeof DataTransfer;

    const { result, rerender } = renderHook(() => useImageField());

    // fileInputRef.currentのモックを設定
    Object.defineProperty(result.current.fileInputRef, 'current', {
      value: { files: null },
      writable: true,
    });

    // 画像が更新された状態をシミュレート
    (useImage as jest.Mock).mockReturnValue({
      image: mockImage,
      removeBgProcess: mockRemoveBgProcess,
    });

    // コンポーネントを再レンダリング
    rerender();

    expect(mockAdd).toHaveBeenCalledWith(mockImage);
  });

  it('fileInputRef.currentが存在しない場合、DataTransferが設定されないこと', () => {
    const mockAdd = jest.fn();
    const mockDataTransfer = {
      items: {
        add: mockAdd,
      },
      files: mockFileList,
    };

    global.DataTransfer = jest.fn(() => mockDataTransfer) as unknown as typeof DataTransfer;

    renderHook(() => useImageField());

    expect(mockAdd).not.toHaveBeenCalled();
  });
});
