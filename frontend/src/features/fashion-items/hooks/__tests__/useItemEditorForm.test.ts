/**
 * @jest-environment jsdom
 */
import { useImage } from '@/context/ImageContext';
import { useToast } from '@/hooks/use-toast';
import {
  fashionItemsCreateAction,
  fashionItemsUpdateAction,
} from '@/lib/actions/outfit/fashionItemsAction';
import type { FashionItem } from '@/types';
import { TOP_URL } from '@/utils/constants';
import { renderHook } from '@testing-library/react';
import { useItemEditorForm } from '../useItemEditorForm';

const mockRouterPush = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockRouterPush,
  }),
}));

jest.mock('@/context/ImageContext', () => ({
  useImage: jest.fn(),
}));

jest.mock('@/hooks/use-toast', () => ({
  useToast: jest.fn(),
}));

jest.mock('@/lib/actions/outfit/fashionItemsAction', () => ({
  fashionItemsCreateAction: jest.fn(),
  fashionItemsUpdateAction: jest.fn(),
}));

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

describe('useItemEditorForm', () => {
  const mockInitialData: FashionItem = {
    id: '1',
    image: 'test.jpg',
    sub_category: { id: '1', subcategory_name: 'カテゴリー', category: 'tops' },
    brand: { id: '1', brand_name: 'ブランド', brand_name_kana: 'ブランド' },
    seasons: [{ id: '1', season_name: 'シーズン' }] as [{ id: string; season_name: string }],
    price_range: { id: '1', price_range: '1000-2000' },
    design: { id: '1', design_pattern: 'パターン' },
    main_color: { id: '1', color_name: '色', color_code: '#000000' },
    is_owned: true,
    is_old_clothes: false,
    created_at: new Date(),
    updated_at: new Date(),
  };

  const mockToast = jest.fn();
  const mockClearImage = jest.fn();
  const mockOnSuccess = jest.fn();

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

    (useImage as jest.Mock).mockReturnValue({
      isProcessing: false,
      preview: 'preview-url',
      clearImage: mockClearImage,
    });

    (useToast as jest.Mock).mockReturnValue({
      toast: mockToast,
    });

    (fashionItemsCreateAction as jest.Mock).mockResolvedValue({
      success: true,
      message: 'Created successfully',
    });

    (fashionItemsUpdateAction as jest.Mock).mockResolvedValue({
      success: true,
      hasChanges: true,
      updatedItem: mockInitialData,
    });
  });

  it('初期状態が正しく設定されていること', () => {
    const { result } = renderHook(() =>
      useItemEditorForm({
        initialData: undefined,
        onSuccess: mockOnSuccess,
      }),
    );

    expect(result.current.isProcessing).toBe(false);
    expect(result.current.preview).toBe('preview-url');
    expect(result.current.state).toEqual({ message: null, errors: {}, success: false });
  });

  it('新規作成アクションが成功した場合、画像がクリアされトップページに遷移すること', async () => {
    const { result } = renderHook(() =>
      useItemEditorForm({
        initialData: undefined,
        onSuccess: mockOnSuccess,
      }),
    );

    const formData = createMockFormData();
    const action = await result.current.formAction(formData);

    expect(fashionItemsCreateAction).toHaveBeenCalledWith(
      { message: null, errors: {}, success: false },
      formData,
    );
    expect(mockClearImage).toHaveBeenCalled();
    expect(mockRouterPush).toHaveBeenCalledWith(TOP_URL);
    expect(action).toEqual({ success: true, message: 'Created successfully' });
  });

  it('更新アクションが成功し変更がある場合、onSuccessが呼ばれること', async () => {
    const { result } = renderHook(() =>
      useItemEditorForm({
        initialData: mockInitialData,
        onSuccess: mockOnSuccess,
      }),
    );

    const formData = createMockFormData();
    const action = await result.current.formAction(formData);

    expect(fashionItemsUpdateAction).toHaveBeenCalledWith(
      { message: null, errors: {}, success: false },
      formData,
      mockInitialData,
    );
    expect(mockOnSuccess).toHaveBeenCalledWith(mockInitialData);
    expect(mockClearImage).toHaveBeenCalled();
    expect(action).toEqual({
      success: true,
      hasChanges: true,
      updatedItem: mockInitialData,
    });
  });

  it('更新アクションで変更がない場合、toastが表示されること', async () => {
    (fashionItemsUpdateAction as jest.Mock).mockResolvedValue({
      success: true,
      hasChanges: false,
      message: 'No changes detected',
      errors: null,
    });

    const { result } = renderHook(() =>
      useItemEditorForm({
        initialData: mockInitialData,
        onSuccess: mockOnSuccess,
      }),
    );

    const formData = createMockFormData();
    const action = await result.current.formAction(formData);

    expect(mockToast).toHaveBeenCalledWith({
      title: 'No changes detected',
      duration: 3000,
    });
    expect(mockOnSuccess).not.toHaveBeenCalled();
    expect(action).toEqual({
      success: true,
      hasChanges: false,
      message: 'No changes detected',
      errors: null,
    });
  });

  it('エラーがある場合、onSuccessが呼ばれないこと', async () => {
    (fashionItemsUpdateAction as jest.Mock).mockResolvedValue({
      success: false,
      errors: { message: 'Error occurred' },
    });

    const { result } = renderHook(() =>
      useItemEditorForm({
        initialData: mockInitialData,
        onSuccess: mockOnSuccess,
      }),
    );

    const formData = createMockFormData();
    const action = await result.current.formAction(formData);

    expect(mockOnSuccess).not.toHaveBeenCalled();
    expect(mockClearImage).not.toHaveBeenCalled();
    expect(action).toEqual({
      success: false,
      errors: { message: 'Error occurred' },
    });
  });

  it('新規作成アクションがエラーの場合、トップページに遷移しないこと', async () => {
    (fashionItemsCreateAction as jest.Mock).mockResolvedValue({
      success: false,
      errors: { message: 'Error occurred' },
    });

    const { result } = renderHook(() =>
      useItemEditorForm({
        initialData: undefined,
        onSuccess: mockOnSuccess,
      }),
    );

    const formData = createMockFormData();
    const action = await result.current.formAction(formData);

    expect(mockRouterPush).not.toHaveBeenCalled();
    expect(mockClearImage).not.toHaveBeenCalled();
    expect(action).toEqual({
      success: false,
      errors: { message: 'Error occurred' },
    });
  });
});
