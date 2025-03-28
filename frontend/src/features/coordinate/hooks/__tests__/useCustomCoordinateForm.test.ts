/**
 * @jest-environment jsdom
 */
import type { InitialItems } from '@/features/my-page/coordinate/types';
import { useToast } from '@/hooks/use-toast';
import {
  customCoordinateCreateAction,
  customCoordinateUpdateAction,
} from '@/lib/actions/outfit/customCoordinateAction';
import type { BaseCoordinate } from '@/types/coordinate';
import { ERROR_MESSAGE } from '@/utils/constants';
import { renderHook } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { useCustomCoordinateForm } from '../useCustomCoordinateForm';

// モックの設定
jest.mock('@/hooks/use-toast', () => ({
  useToast: jest.fn(),
}));

jest.mock('@/lib/actions/outfit/customCoordinateAction', () => ({
  customCoordinateCreateAction: jest.fn(),
  customCoordinateUpdateAction: jest.fn(),
}));

// CoordinateCanvasContextのモック
jest.mock('@/context/CoordinateCanvasContext', () => ({
  useCoordinateCanvasState: jest.fn(() => ({
    state: {
      selectedItems: [{ id: '1', image: 'item1.jpg' }],
      itemStyles: {
        '1': {
          scale: 1,
          rotate: 0,
          zIndex: 1,
          xPercent: 50,
          yPercent: 50,
        },
      },
      background: 'background.jpg',
    },
  })),
}));

// react-domのモックを修正
jest.mock('react-dom', () => {
  const original = jest.requireActual('react-dom');
  return {
    ...original,
    useFormState: jest.fn((action, _initialState) => {
      const formAction = (formData: FormData) => {
        return action({ message: null, errors: {}, success: false }, formData);
      };
      return [{ message: null, errors: {}, success: false }, formAction];
    }),
  };
});

// useRouter をモックする
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

beforeEach(() => {
  jest.clearAllMocks();

  // useRouter のモックを明示的に設定
  (useRouter as jest.Mock).mockReturnValue({
    push: jest.fn(),
  });
});

describe('useCustomCoordinateForm', () => {
  // テスト用のモックデータ
  const mockInitialData: BaseCoordinate = {
    id: '1',
    image: 'test.jpg',
    seasons: [{ id: '1', season_name: 'Spring' }],
    scenes: [{ id: '1', scene: 'Casual' }],
    tastes: [{ id: '1', taste: 'Simple' }],
  };

  const mockInitialItems: InitialItems = {
    items: [
      {
        item_id: '1',
        image: 'item1.jpg',
        position_data: {
          scale: 1,
          rotate: 0,
          zIndex: 1,
          xPercent: 50,
          yPercent: 50,
        },
      },
    ],
    background: 'background.jpg',
  };

  const mockToast = jest.fn();
  const mockOnSuccess = jest.fn();
  const mockPush = jest.fn();

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

    // useToastのモック実装
    (useToast as jest.Mock).mockReturnValue({
      toast: mockToast,
    });

    // useRouterのモック実装
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });

    // アクション関数のモック実装
    (customCoordinateCreateAction as jest.Mock).mockResolvedValue({
      success: true,
      message: 'Created successfully',
    });

    (customCoordinateUpdateAction as jest.Mock).mockResolvedValue({
      success: true,
      hasChanges: true,
      updatedItem: mockInitialData,
    });
  });

  it('初期状態が正しく設定されていること', () => {
    const { result } = renderHook(() =>
      useCustomCoordinateForm({
        initialData: undefined,
        initialItems: mockInitialItems,
        onSuccess: mockOnSuccess,
      }),
    );

    expect(result.current.state).toEqual({ message: null, errors: {}, success: false });
  });

  it('新規作成アクションが成功した場合、正しい結果を返すこと', async () => {
    const { result } = renderHook(() =>
      useCustomCoordinateForm({
        initialData: undefined,
        initialItems: mockInitialItems,
        onSuccess: mockOnSuccess,
      }),
    );

    const formData = createMockFormData();
    await result.current.formAction(formData);

    expect(customCoordinateCreateAction).toHaveBeenCalledWith(
      expect.any(Object),
      expect.any(Object),
      expect.any(Object), // itemsDataが追加されたことを確認
    );
    expect(mockPush).toHaveBeenCalledWith(expect.any(String));
  });

  it('新規作成アクションが失敗した場合、エラートーストが表示されること', async () => {
    (customCoordinateCreateAction as jest.Mock).mockResolvedValue({
      success: false,
      message: 'Error occurred',
    });

    const { result } = renderHook(() =>
      useCustomCoordinateForm({
        initialData: undefined,
        initialItems: mockInitialItems,
        onSuccess: mockOnSuccess,
      }),
    );

    const formData = createMockFormData();
    await result.current.formAction(formData);

    expect(mockToast).toHaveBeenCalledWith({
      variant: 'destructive',
      title: 'エラー',
      description: 'Error occurred',
      duration: 3000,
    });
  });

  it('新規作成アクションがメッセージなしで失敗した場合、デフォルトエラーメッセージが表示されること', async () => {
    (customCoordinateCreateAction as jest.Mock).mockResolvedValue({
      success: false,
    });

    const { result } = renderHook(() =>
      useCustomCoordinateForm({
        initialData: undefined,
        initialItems: mockInitialItems,
        onSuccess: mockOnSuccess,
      }),
    );

    const formData = createMockFormData();
    await result.current.formAction(formData);

    expect(mockToast).toHaveBeenCalledWith({
      variant: 'destructive',
      title: 'エラー',
      description: ERROR_MESSAGE,
      duration: 3000,
    });
  });

  it('更新アクションが成功し変更がある場合、onSuccessが呼ばれること', async () => {
    const { result } = renderHook(() =>
      useCustomCoordinateForm({
        initialData: mockInitialData,
        initialItems: mockInitialItems,
        onSuccess: mockOnSuccess,
      }),
    );

    const formData = createMockFormData();
    await result.current.formAction(formData);

    expect(customCoordinateUpdateAction).toHaveBeenCalledWith(
      expect.any(Object),
      expect.any(Object),
      mockInitialData,
      expect.any(Object), // itemsData
      mockInitialItems,
    );
    expect(mockOnSuccess).toHaveBeenCalledWith(mockInitialData);
  });

  it('更新アクションで変更がない場合、toastが表示されること', async () => {
    (customCoordinateUpdateAction as jest.Mock).mockResolvedValue({
      success: true,
      hasChanges: false,
      message: 'No changes detected',
      errors: null,
    });

    const { result } = renderHook(() =>
      useCustomCoordinateForm({
        initialData: mockInitialData,
        initialItems: mockInitialItems,
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

  it('エラーがある場合、onSuccessが呼ばれないこと', async () => {
    (customCoordinateUpdateAction as jest.Mock).mockResolvedValue({
      success: false,
      errors: { message: 'Error occurred' },
    });

    const { result } = renderHook(() =>
      useCustomCoordinateForm({
        initialData: mockInitialData,
        initialItems: mockInitialItems,
        onSuccess: mockOnSuccess,
      }),
    );

    const formData = createMockFormData();
    await result.current.formAction(formData);

    expect(mockOnSuccess).not.toHaveBeenCalled();
  });
});
