import type { FormFieldsProps } from '@/features/fashion-items/types';
import type { Brand, Category, Color, Design, PriceRange, Season } from '@/types';
import { render, screen } from '@testing-library/react';
import ItemEditorSelectFormFields from '../ItemEditorSelectFormFields';

// SubmitButtonのモック
jest.mock('@/components/elements/button/SubmitButton', () => {
  return function MockSubmitButton({ label, disabled }: { label: string; disabled?: boolean }) {
    return <button disabled={disabled}>{label}</button>;
  };
});

// その他のフォームフィールドのモック
jest.mock('@/components/elements/form/select/SheetSelectFormField', () => {
  return function MockSheetSelectField({ label }: { label: string }) {
    return <div>{label}</div>;
  };
});

jest.mock('../BrandSelectFormField', () => {
  return function MockBrandSelectField({ label }: { label: string }) {
    return <div>{label}</div>;
  };
});

jest.mock('../CategorySelectField', () => {
  return function MockCategorySelectField({ label }: { label: string }) {
    return <div>{label}</div>;
  };
});

jest.mock('../ColorSelectFormField', () => {
  return function MockColorSelectField({ label }: { label: string }) {
    return <div>{label}</div>;
  };
});

describe('ItemEditorSelectFormFields', () => {
  const mockMetaData = {
    categories: [] as Category[],
    popular_brands: [] as Brand[],
    price_ranges: [] as PriceRange[],
    designs: [] as Design[],
    colors: [] as Color[],
    seasons: [] as Season[],
  };

  const mockInitialData = {
    id: '1',
    image: 'test-image.jpg',
    sub_category: {
      id: '1',
      subcategory_name: 'Test Category',
    },
    brand: {
      id: '1',
      brand_name: 'Nike',
      brand_name_kana: 'ナイキ',
    },
    seasons: [
      {
        id: '1',
        season_name: 'Spring',
      },
    ] as [{ id: string; season_name: string }],
    price_range: {
      id: '1',
      price_range: '1000-2000',
    },
    design: {
      id: '1',
      design_pattern: 'Stripe',
    },
    main_color: {
      id: '1',
      color_name: 'Red',
      color_code: '#FF0000',
    },
    is_owned: true,
    is_old_clothes: false,
    created_at: new Date(),
    updated_at: new Date(),
  };

  const defaultProps: FormFieldsProps = {
    metaData: mockMetaData,
    initialData: mockInitialData,
    isProcessing: false,
    state: {
      message: null,
      errors: null,
      success: false,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('すべての主要なフォームフィールドがレンダリングされること', () => {
    render(<ItemEditorSelectFormFields {...defaultProps} />);

    expect(screen.getByText('カテゴリー')).toBeInTheDocument();
    expect(screen.getByText('ブランド')).toBeInTheDocument();
    expect(screen.getByText('価格帯')).toBeInTheDocument();
    expect(screen.getByText('柄・特徴')).toBeInTheDocument();
    expect(screen.getByText('メインカラー')).toBeInTheDocument();
    expect(screen.getByText('シーズン')).toBeInTheDocument();
    expect(screen.getByText('所有している')).toBeInTheDocument();
    expect(screen.getByText('古着')).toBeInTheDocument();
  });

  it('送信ボタンが正しくレンダリングされること', () => {
    render(<ItemEditorSelectFormFields {...defaultProps} />);
    expect(screen.getByText('保存')).toBeInTheDocument();
  });

  it('処理中の場合、送信ボタンが無効化されること', () => {
    render(<ItemEditorSelectFormFields {...defaultProps} isProcessing={true} />);
    const submitButton = screen.getByText('保存');
    expect(submitButton).toHaveAttribute('disabled');
  });
});
