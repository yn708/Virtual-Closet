import { act, renderHook } from '@testing-library/react';
import { useProfileImage } from '../useProfileImage';

// コンテキストと依存フックのモック
jest.mock('@/context/ImageContext', () => ({
  useImage: () => ({
    minimumImageSet: jest.fn(),
    preview: null,
    clearImage: jest.fn(),
  }),
}));

jest.mock('@/hooks/image/useImageSelection', () => ({
  useImageSelection: () => ({
    handleFileChange: jest.fn().mockResolvedValue({ file: new File([], 'test.jpg') }),
  }),
}));

jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: jest.fn(),
  }),
}));

jest.mock('@/utils/imageUtils', () => ({
  compressImage: jest.fn().mockResolvedValue(new File([], 'compressed.jpg')),
  conversionImage: jest.fn().mockResolvedValue(new File([], 'converted.jpg')),
  createImagePreview: jest.fn().mockResolvedValue('data:image/jpeg;base64,test'),
}));

describe('useProfileImage', () => {
  const mockProps = {
    profileImage: '/test.jpg',
    onDelete: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('初期状態の確認', () => {
    const { result } = renderHook(() => useProfileImage(mockProps));

    expect(result.current.isProcessing).toBe(false);
    expect(result.current.imageToEdit).toBeNull();
    expect(result.current.defaultProfileImage).toBe(mockProps.profileImage);
  });

  it('ファイル選択処理の実行', async () => {
    const { result } = renderHook(() => useProfileImage(mockProps));
    const mockEvent = {
      target: { files: [new File([], 'test.jpg')] },
    } as unknown as React.ChangeEvent<HTMLInputElement>;

    await act(async () => {
      await result.current.handleFileSelect(mockEvent);
    });

    expect(result.current.imageToEdit).toBeTruthy();
    expect(result.current.isProcessing).toBe(false);
  });

  it('画像削除処理の実行', () => {
    const { result } = renderHook(() => useProfileImage(mockProps));

    act(() => {
      result.current.handleDelete();
    });

    expect(mockProps.onDelete).toHaveBeenCalled();
  });
});
