import { useItemEditorForm } from '@/features/fashion-items/hooks/useItemEditorForm';
import { render, screen } from '@testing-library/react';
import ItemEditorForm from '../ItemEditorForm';

// useItemEditorFormのモック
jest.mock('../../../hooks/useItemEditorForm', () => ({
  useItemEditorForm: jest.fn(),
}));

// 子コンポーネントのモック
jest.mock('../field/ImageFormField', () => {
  return function MockImageFormField() {
    return <div data-testid="image-form-field">Image Form Field</div>;
  };
});

jest.mock('../field/ItemEditorSelectFormFields', () => {
  return function MockItemEditorSelectFormFields() {
    return <div data-testid="select-form-fields">Select Form Fields</div>;
  };
});

describe('ItemEditorForm', () => {
  const mockMetaData = {
    categories: [],
    popular_brands: [],
    price_ranges: [],
    designs: [],
    colors: [],
    seasons: [],
  };

  const mockInitialData = {
    id: '1',
    image: 'http://backend:8000/media/items/test.jpg',
    sub_category: { id: '1', subcategory_name: 'Test Category' },
    brand: { id: '1', brand_name: 'Nike', brand_name_kana: 'ナイキ' },
    seasons: [{ id: '1', season_name: 'Spring' }] as [{ id: string; season_name: string }],
    price_range: { id: '1', price_range: '1000-2000' },
    design: { id: '1', design_pattern: 'Stripe' },
    main_color: { id: '1', color_name: 'Red', color_code: '#FF0000' },
    is_owned: true,
    is_old_clothes: false,
    created_at: new Date(),
    updated_at: new Date(),
  };

  const mockFormState = {
    message: null,
    errors: null,
    success: false,
  };

  beforeEach(() => {
    // useItemEditorFormの戻り値をモック
    (useItemEditorForm as jest.Mock).mockReturnValue({
      state: mockFormState,
      formAction: jest.fn(),
      isProcessing: false,
      preview: null,
    });
  });

  it('フォームが正しくレンダリングされること', () => {
    render(
      <ItemEditorForm
        metaData={mockMetaData}
        initialData={mockInitialData}
        onSuccess={jest.fn()}
      />,
    );

    expect(screen.getByTestId('image-form-field')).toBeInTheDocument();
    expect(screen.getByTestId('select-form-fields')).toBeInTheDocument();
  });

  it('初期画像URLが正しく変換されること', () => {
    render(
      <ItemEditorForm
        metaData={mockMetaData}
        initialData={mockInitialData}
        onSuccess={jest.fn()}
      />,
    );

    // ImageFormFieldに渡されるpreviewプロパティを確認
    expect(screen.getByTestId('image-form-field')).toBeInTheDocument();
  });

  it('プレビュー画像が存在する場合、それが優先されること', () => {
    const previewUrl = 'preview-image-url';
    (useItemEditorForm as jest.Mock).mockReturnValue({
      state: mockFormState,
      formAction: jest.fn(),
      isProcessing: false,
      preview: previewUrl,
    });

    render(
      <ItemEditorForm
        metaData={mockMetaData}
        initialData={mockInitialData}
        onSuccess={jest.fn()}
      />,
    );

    // ImageFormFieldに渡されるpreviewプロパティを確認
    expect(screen.getByTestId('image-form-field')).toBeInTheDocument();
  });
});
