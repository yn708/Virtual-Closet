/**
 * @jest-environment jsdom
 */
import { useImage } from '@/context/ImageContext';
import { useToast } from '@/hooks/use-toast';
import {
  photoCoordinateCreateAction,
  photoCoordinateUpdateAction,
} from '@/lib/actions/outfit/photoCoordinateAction';
import type { BaseCoordinate } from '@/types/coordinate';
import { renderHook } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { usePhotoCoordinateForm } from '../usePhotoCoordinateForm';

// モックの設定
// useRouter をモックする
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/context/ImageContext', () => ({
  useImage: jest.fn(),
}));

jest.mock('@/hooks/use-toast', () => ({
  useToast: jest.fn(),
}));

jest.mock('@/lib/actions/outfit/photoCoordinateAction', () => ({
  photoCoordinateCreateAction: jest.fn(),
  photoCoordinateUpdateAction: jest.fn(),
}));

// react-domのモックを修正
jest.mock('react-dom', () => {
  const original = jest.requireActual('react-dom');
  return {
    ...original,
    useFormState: jest.fn((action, initialState) => {
      const formAction = (formData: FormData) => {
        return action({ message: '', errors: null }, formData);
      };
      return [initialState, formAction];
    }),
  };
});

beforeEach(() => {
  jest.clearAllMocks();

  // useRouter のモックを明示的に設定
  (useRouter as jest.Mock).mockReturnValue({
    push: jest.fn(), // ここで push を定義
  });
});

describe('usePhotoCoordinateForm', () => {
  // テスト用のモックデータ
  const mockInitialData: BaseCoordinate = {
    id: '1',
    image: 'test.jpg',
    seasons: [{ id: '1', season_name: 'Spring' }],
    scenes: [{ id: '1', scene: 'Casual' }],
    tastes: [{ id: '1', taste: 'Simple' }],
  };

  const mockToast = jest.fn();
  const mockClearImage = jest.fn();
  const mockOnSuccess = jest.fn();

  // テスト用のダミーFormDataを作成する関数
  const createMockFormData = () => {
    const formData = {
      append: jest.fn(),
      delete: jest.fn(),
      get: jest.fn(),
      getAll: jest.fn(),
      has: jest.fn(),
      set: jest.fn(),
      forEach: jest.fn(),
    };
    return formData as unknown as FormData;
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // useImageのモック実装
    (useImage as jest.Mock).mockReturnValue({
      isProcessing: false,
      preview: 'preview-url',
      clearImage: mockClearImage,
    });

    // useToastのモック実装
    (useToast as jest.Mock).mockReturnValue({
      toast: mockToast,
    });

    // アクション関数のモック実装
    (photoCoordinateCreateAction as jest.Mock).mockResolvedValue({
      success: true,
      message: 'Created successfully',
    });

    (photoCoordinateUpdateAction as jest.Mock).mockResolvedValue({
      success: true,
      hasChanges: true,
      updatedItem: mockInitialData,
    });
  });

  it('初期状態が正しく設定されていること', () => {
    const { result } = renderHook(() =>
      usePhotoCoordinateForm({
        initialData: undefined,
        onSuccess: mockOnSuccess,
      }),
    );

    expect(result.current.isProcessing).toBe(false);
    expect(result.current.preview).toBe('preview-url');
  });

  it('新規作成アクションが成功した場合、画像がクリアされること', async () => {
    const { result } = renderHook(() =>
      usePhotoCoordinateForm({
        initialData: undefined,
        onSuccess: mockOnSuccess,
      }),
    );

    const formData = createMockFormData();
    await result.current.formAction(formData);

    expect(photoCoordinateCreateAction).toHaveBeenCalledWith(
      expect.any(Object),
      expect.any(Object),
    );
    expect(mockClearImage).toHaveBeenCalled();
  });

  it('更新アクションが成功し変更がある場合、onSuccessが呼ばれること', async () => {
    const { result } = renderHook(() =>
      usePhotoCoordinateForm({
        initialData: mockInitialData,
        onSuccess: mockOnSuccess,
      }),
    );

    const formData = createMockFormData();
    await result.current.formAction(formData);

    expect(photoCoordinateUpdateAction).toHaveBeenCalledWith(
      expect.any(Object),
      expect.any(Object),
      mockInitialData,
    );
    expect(mockOnSuccess).toHaveBeenCalledWith(mockInitialData);
    expect(mockClearImage).toHaveBeenCalled();
  });

  it('更新アクションで変更がない場合、toastが表示されること', async () => {
    (photoCoordinateUpdateAction as jest.Mock).mockResolvedValue({
      success: true,
      hasChanges: false,
      message: 'No changes detected',
      errors: null,
    });

    const { result } = renderHook(() =>
      usePhotoCoordinateForm({
        initialData: mockInitialData,
        onSuccess: mockOnSuccess,
      }),
    );

    const formData = createMockFormData();
    await result.current.formAction(formData);

    expect(mockToast).toHaveBeenCalledWith({
      title: 'No changes detected',
      duration: 3000,
    });
    expect(mockOnSuccess).not.toHaveBeenCalled();
  });
});
