import type { ItemStyle } from '@/features/coordinate/types';
import type { InitialItems } from '@/features/my-page/coordinate/types';
import type { FashionItem, FormState, FormStateCoordinateUpdate } from '@/types';
import type { BaseCoordinate, CoordinateMetaDataType } from '@/types/coordinate';
import { initialState } from '@/utils/data/initialState';
import { render, screen } from '@testing-library/react';
import CustomCoordinateEditorForm from '../CustomCoordinateEditorForm';

// モックの定義をテストファイルの先頭に配置
const mockFormAction = jest.fn();
const mockUseCustomCoordinateForm = jest.fn();
const mockUsePreviewGeneration = jest.fn();
const mockUseFormStatus = jest.fn();
const mockUseCoordinateCanvasState = jest.fn();

// コンテキストのモック
jest.mock('@/context/CoordinateCanvasContext', () => ({
  useCoordinateCanvasState: () => mockUseCoordinateCanvasState(),
}));

// カスタムフックのモック
jest.mock('../../../hooks/useCustomCoordinateForm', () => ({
  useCustomCoordinateForm: (props: {
    initialItems?: InitialItems;
    initialData?: BaseCoordinate;
    onSuccess?: (item: BaseCoordinate) => void;
  }) => {
    mockUseCustomCoordinateForm(props);
    return {
      state: initialState,
      formAction: mockFormAction,
    };
  },
}));

jest.mock('../../../hooks/usePreviewGeneration', () => ({
  usePreviewGeneration: () => mockUsePreviewGeneration(),
}));

// React DOM のフックをモック
jest.mock('react-dom', () => ({
  ...jest.requireActual('react-dom'),
  useFormStatus: () => mockUseFormStatus(),
}));

interface SelectFormFieldsProps {
  isProcessing: boolean;
  state: FormState | FormStateCoordinateUpdate;
  initialData?: BaseCoordinate;
  metaData: CoordinateMetaDataType;
}

// 子コンポーネントのモック
jest.mock('../field/CoordinateEditorSelectFormFields', () => {
  const MockCoordinateEditorSelectFormFields = ({
    isProcessing,
    state,
    initialData,
  }: SelectFormFieldsProps) => (
    <div data-testid="select-form-fields">
      {isProcessing && <span>Processing...</span>}
      {state?.errors && <span>Error State</span>}
      {initialData && <span>Has Initial Data</span>}
    </div>
  );
  return MockCoordinateEditorSelectFormFields;
});

describe('CustomCoordinateEditorForm', () => {
  // テスト用のモックデータ
  const mockMetaData: CoordinateMetaDataType = {
    seasons: [{ id: '1', name: '春', season_name: '春' }],
    scenes: [{ id: '1', name: 'カジュアル', scene: 'カジュアル' }],
    tastes: [{ id: '1', name: 'シンプル', taste: 'シンプル' }],
  };

  const mockSelectedItems: FashionItem[] = [
    {
      id: '1',
      image: '/test.jpg',
      sub_category: { id: '1', subcategory_name: 'Tシャツ', category: 'トップス' },
      brand: { id: '1', brand_name: 'TestBrand', brand_name_kana: 'テストブランド' },
      seasons: [{ id: '1', season_name: '春' }],
      price_range: { id: '1', price_range: '~5000' },
      design: { id: '1', design_pattern: 'プレーン' },
      main_color: { id: '1', color_name: '白', color_code: '#FFFFFF' },
      is_owned: true,
      is_old_clothes: false,
      created_at: new Date(),
      updated_at: new Date(),
    },
  ];

  const mockItemStyles: Record<string, ItemStyle> = {
    '1': {
      zIndex: 1,
      scale: 1,
      rotate: 0,
      xPercent: 0,
      yPercent: 0,
    },
  };

  const mockBackground = {
    type: 'color' as const,
    value: '#FFFFFF',
  };

  const mockInitialItems: InitialItems = {
    items: [
      {
        item_id: '1',
        image: '/test.jpg',
        position_data: {
          scale: 1,
          rotate: 0,
          zIndex: 1,
          xPercent: 0,
          yPercent: 0,
        },
      },
    ],
    background: '#FFFFFF',
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // モックの戻り値を設定
    mockUseCoordinateCanvasState.mockReturnValue({
      state: {
        selectedItems: mockSelectedItems,
        itemStyles: mockItemStyles,
        background: mockBackground,
      },
    });

    mockUseCustomCoordinateForm.mockReturnValue({
      state: initialState,
      formAction: mockFormAction,
    });

    mockUsePreviewGeneration.mockReturnValue({
      isProcessing: false,
    });

    mockUseFormStatus.mockReturnValue({
      pending: false,
    });
  });

  it('フォームが正しくレンダリングされること', () => {
    const { container } = render(
      <CustomCoordinateEditorForm metaData={mockMetaData} initialItems={mockInitialItems} />,
    );

    const formElement = container.querySelector('form');
    expect(formElement).toBeInTheDocument();
    expect(formElement).toHaveClass('w-full');

    const fileInput = container.querySelector('input[name="image"]');
    expect(fileInput).toBeInTheDocument();
    expect(fileInput).toHaveAttribute('type', 'file');
    expect(fileInput).toHaveAttribute('hidden');

    const itemsInput = container.querySelector('input[name="items"]');
    expect(itemsInput).toBeInTheDocument();
    expect(itemsInput).toHaveAttribute('type', 'hidden');
  });

  it('アイテムデータが正しくJSONとして変換されること', () => {
    const { container } = render(
      <CustomCoordinateEditorForm metaData={mockMetaData} initialItems={mockInitialItems} />,
    );

    const expectedItemsData = {
      items: [
        {
          item: '1',
          position_data: mockItemStyles['1'],
        },
      ],
      background: mockBackground,
    };

    const itemsInput = container.querySelector('input[name="items"]') as HTMLInputElement;
    expect(JSON.parse(itemsInput.value)).toEqual(expectedItemsData);
  });

  it('処理中の状態が正しく反映されること', () => {
    mockUsePreviewGeneration.mockReturnValue({
      isProcessing: true,
    });

    render(<CustomCoordinateEditorForm metaData={mockMetaData} initialItems={mockInitialItems} />);

    expect(screen.getByTestId('select-form-fields')).toHaveTextContent('Processing...');
  });

  it('カスタムフックが正しいパラメータで呼び出されること', () => {
    const onSuccess = jest.fn();
    const initialData: BaseCoordinate = {
      id: '1',
      image: '/test.jpg',
      seasons: [{ id: '1', season_name: '春' }],
      scenes: [{ id: '1', scene: 'カジュアル' }],
      tastes: [{ id: '1', taste: 'シンプル' }],
    };

    render(
      <CustomCoordinateEditorForm
        metaData={mockMetaData}
        initialItems={mockInitialItems}
        initialData={initialData}
        onSuccess={onSuccess}
      />,
    );

    expect(mockUseCustomCoordinateForm).toHaveBeenCalledWith({
      initialItems: mockInitialItems,
      initialData,
      onSuccess,
    });
  });
});
