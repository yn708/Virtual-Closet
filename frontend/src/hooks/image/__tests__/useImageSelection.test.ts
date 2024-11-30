import { useToast } from '@/hooks/use-toast';
import { validateImage } from '@/utils/imageUtils';
import { act, renderHook } from '@testing-library/react';
import type { ChangeEvent } from 'react';
import { useImageSelection } from '../useImageSelection';

// モックの設定
jest.mock('@/utils/imageUtils', () => ({
  validateImage: jest.fn(),
}));

jest.mock('@/hooks/use-toast', () => ({
  useToast: jest.fn(),
}));

describe('useImageSelection', () => {
  const mockToast = jest.fn();
  const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

  // イベントオブジェクトを作成するヘルパー関数
  const createMockFileEvent = (files: File[]): ChangeEvent<HTMLInputElement> => {
    return {
      target: {
        files,
        value: files.length ? 'C:\\fakepath\\image.jpg' : '',
      } as unknown as EventTarget & HTMLInputElement,
      currentTarget: {
        files,
        value: files.length ? 'C:\\fakepath\\image.jpg' : '',
      } as unknown as EventTarget & HTMLInputElement,
      nativeEvent: new Event('change'),
      bubbles: true,
      cancelable: true,
      defaultPrevented: false,
      eventPhase: 0,
      isTrusted: true,
      preventDefault: jest.fn(),
      isDefaultPrevented: jest.fn(),
      stopPropagation: jest.fn(),
      isPropagationStopped: jest.fn(),
      persist: jest.fn(),
      timeStamp: Date.now(),
      type: 'change',
    } as ChangeEvent<HTMLInputElement>;
  };

  // DOM要素のモックを設定するヘルパー関数
  const setupMockFileInput = () => {
    const mockFileInput = document.createElement('input');
    mockFileInput.id = 'image-upload';
    mockFileInput.type = 'file';
    const clickSpy = jest.spyOn(mockFileInput, 'click');
    document.body.appendChild(mockFileInput);
    return { mockFileInput, clickSpy };
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useToast as jest.Mock).mockReturnValue({ toast: mockToast });
    // テスト前にDOMをクリーンアップ
    document.body.innerHTML = '';
  });

  afterAll(() => {
    consoleErrorSpy.mockRestore();
  });

  // フックの初期値をテスト
  it('should initialize with default values', () => {
    const { result } = renderHook(() => useImageSelection());

    expect(result.current.isLoading).toBe(false);
    expect(typeof result.current.openFileDialog).toBe('function');
    expect(typeof result.current.handleFileChange).toBe('function');
  });

  // openFileDialog のテスト
  it('should trigger file input click when openFileDialog is called', () => {
    const { mockFileInput, clickSpy } = setupMockFileInput();
    const { result } = renderHook(() => useImageSelection());

    act(() => {
      result.current.openFileDialog();
    });

    expect(clickSpy).toHaveBeenCalled();
    mockFileInput.remove();
  });

  it('should not throw error when file input is not found', () => {
    const { result } = renderHook(() => useImageSelection());

    expect(() => {
      act(() => {
        result.current.openFileDialog();
      });
    }).not.toThrow();
  });

  // 有効なファイルが選択された場合のテスト
  it('should handle valid file selection', async () => {
    (validateImage as jest.Mock).mockReturnValue(null);

    const { result } = renderHook(() => useImageSelection());
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const event = createMockFileEvent([file]);

    let selectionResult;
    await act(async () => {
      selectionResult = await result.current.handleFileChange(event);
    });

    expect(selectionResult).toEqual({ file });
    expect(validateImage).toHaveBeenCalledWith(file);
    expect(result.current.isLoading).toBe(false);
    expect(mockToast).not.toHaveBeenCalled();
  });

  // バリデーションエラーが発生した場合のテスト
  it('should handle validation error', async () => {
    const validationError = '画像サイズは5MB以下にしてください。';
    (validateImage as jest.Mock).mockReturnValue(validationError);

    const { result } = renderHook(() => useImageSelection());
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const event = createMockFileEvent([file]);

    let selectionResult;
    await act(async () => {
      selectionResult = await result.current.handleFileChange(event);
    });

    expect(selectionResult).toEqual({ file });
    expect(mockToast).toHaveBeenCalledWith({
      variant: 'destructive',
      title: 'エラー',
      description: validationError,
    });
    expect(result.current.isLoading).toBe(false);
  });

  // ファイル処理中にエラーが発生した場合のテスト
  it('should handle error during file processing', async () => {
    (validateImage as jest.Mock).mockImplementation(() => {
      throw new Error('Processing error');
    });

    const { result } = renderHook(() => useImageSelection());
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const event = createMockFileEvent([file]);

    let selectionResult;
    await act(async () => {
      selectionResult = await result.current.handleFileChange(event);
    });

    expect(selectionResult).toEqual({ file: null });
    expect(mockToast).toHaveBeenCalledWith({
      variant: 'destructive',
      title: 'エラー',
      description: '画像の処理中にエラーが発生しました。もう一度お試しください。',
    });
    expect(result.current.isLoading).toBe(false);
    expect(consoleErrorSpy).toHaveBeenCalled();
  });

  // ファイルが選択されなかった場合のテスト
  it('should handle no file selection', async () => {
    const { result } = renderHook(() => useImageSelection());
    const event = createMockFileEvent([]);

    let selectionResult;
    await act(async () => {
      selectionResult = await result.current.handleFileChange(event);
    });

    expect(selectionResult).toEqual({ file: null });
    expect(result.current.isLoading).toBe(false);
    expect(mockToast).not.toHaveBeenCalled();
  });
});
