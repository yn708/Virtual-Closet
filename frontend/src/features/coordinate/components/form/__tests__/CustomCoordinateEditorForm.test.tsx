import type { ItemStyle } from '@/features/coordinate/types';
import type { FashionItem } from '@/types';
import type { CoordinateMetaDataType } from '@/types/coordinate';
import { initialState } from '@/utils/data/initialState';
import { generatePreviewImage } from '@/utils/imageUtils';
import { render, screen, waitFor } from '@testing-library/react';
import CustomCoordinateEditorForm from '../CustomCoordinateEditorForm';

// モジュールのモック
jest.mock('@/utils/imageUtils', () => ({
  generatePreviewImage: jest.fn().mockResolvedValue(undefined),
}));

// Server Actionのモック
jest.mock('@/lib/actions/outfit/customCoordinateCreateAction', () => ({
  customCoordinateCreateAction: jest.fn(),
}));

// React DOM のフックをモック
jest.mock('react-dom', () => {
  const originalModule = jest.requireActual('react-dom');
  return {
    ...originalModule,
    useFormState: jest.fn(() => [initialState, jest.fn()]),
    useFormStatus: jest.fn(() => ({ pending: false })),
  };
});

// 子コンポーネントのモック
jest.mock('../field/CoordinateEditorSelectFormFields', () => {
  return function MockCoordinateEditorSelectFormFields({
    isProcessing,
  }: {
    isProcessing: boolean;
  }) {
    return (
      <div data-testid="select-form-fields">
        {isProcessing ? 'Processing...' : 'Select Form Fields'}
      </div>
    );
  };
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

  beforeEach(() => {
    jest.clearAllMocks();
    document.body.innerHTML = '<div class="coordinate-canvas"></div>';
  });

  it('フォームが正しくレンダリングされること', () => {
    const { container } = render(
      <CustomCoordinateEditorForm
        metaData={mockMetaData}
        selectedItems={mockSelectedItems}
        itemStyles={mockItemStyles}
      />,
    );

    // form要素の確認
    const formElement = container.querySelector('form');
    expect(formElement).toBeInTheDocument();
    expect(formElement).toHaveClass('w-full');

    // hidden inputsの確認
    const previewImageInput = container.querySelector('input[name="preview_image"]');
    expect(previewImageInput).toBeInTheDocument();
    expect(previewImageInput).toHaveAttribute('type', 'file');
    expect(previewImageInput).toHaveAttribute('hidden');

    // SelectFormFieldsの確認
    expect(screen.getByTestId('select-form-fields')).toBeInTheDocument();
  });

  it('選択されたアイテムのデータがJSONとして正しく変換されること', () => {
    const { container } = render(
      <CustomCoordinateEditorForm
        metaData={mockMetaData}
        selectedItems={mockSelectedItems}
        itemStyles={mockItemStyles}
      />,
    );

    const expectedItemsData = JSON.stringify([
      {
        item: '1',
        position_data: mockItemStyles['1'],
      },
    ]);

    const itemsInput = container.querySelector('input[name="items"]') as HTMLInputElement;
    expect(itemsInput).toBeInTheDocument();
    expect(itemsInput.value).toBe(expectedItemsData);
  });

  it('プレビュー画像生成プロセスが正しく動作すること', async () => {
    render(
      <CustomCoordinateEditorForm
        metaData={mockMetaData}
        selectedItems={mockSelectedItems}
        itemStyles={mockItemStyles}
      />,
    );

    await waitFor(() => {
      expect(generatePreviewImage).toHaveBeenCalled();
    });
  });

  it('プレビュー画像生成中はisProcessingがtrueになること', async () => {
    (generatePreviewImage as jest.Mock).mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100)),
    );

    render(
      <CustomCoordinateEditorForm
        metaData={mockMetaData}
        selectedItems={mockSelectedItems}
        itemStyles={mockItemStyles}
      />,
    );

    await waitFor(() => {
      const formFields = screen.getByTestId('select-form-fields');
      expect(formFields).toHaveTextContent('Processing...');
    });
  });
});
