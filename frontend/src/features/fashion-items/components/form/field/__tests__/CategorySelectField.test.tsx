import type { Category, SubCategory } from '@/types';
import { render, screen } from '@testing-library/react';
import CategorySelectField from '../CategorySelectField';

// 必要なモジュールのモック
jest.mock('@/components/ui/sheet', () => ({
  SheetClose: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock('@/components/ui/accordion', () => ({
  Accordion: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div data-testid="accordion" className={className}>
      {children}
    </div>
  ),
  AccordionItem: ({ children, value }: { children: React.ReactNode; value: string }) => (
    <div data-testid={`accordion-item-${value}`}>{children}</div>
  ),
  AccordionTrigger: ({ children }: { children: React.ReactNode }) => (
    <button data-testid="accordion-trigger">{children}</button>
  ),
  AccordionContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="accordion-content">{children}</div>
  ),
}));

jest.mock('@/components/elements/form/select/BaseSheetSelectFormField', () => {
  return function MockBaseSheetSelectField({
    label,
    value,
    error,
    trigger,
    children,
  }: {
    name: string;
    label: string;
    value?: string;
    error?: string;
    trigger: (value: string) => React.ReactNode;
    children: ({
      value,
      onChange,
    }: {
      value: string;
      onChange: (value: string) => void;
    }) => React.ReactNode;
  }) {
    return (
      <div data-testid="base-sheet-select">
        <label>{label}</label>
        <div data-testid="trigger-content">{value && trigger(value)}</div>
        {error && <div data-testid="error-message">{error}</div>}
        {children({
          value: value || '',
          onChange: () => {},
        })}
      </div>
    );
  };
});

// テスト用モックデータ
// 循環参照を解決するため、データを段階的に構築
const tops: Category = {
  id: '1',
  category_name: 'トップス',
  subcategories: [], // 一時的に空配列を設定
};

const bottoms: Category = {
  id: '2',
  category_name: 'ボトムス',
  subcategories: [], // 一時的に空配列を設定
};

const tshirt: SubCategory = {
  id: '1-1',
  subcategory_name: 'Tシャツ',
  category: tops,
};

const shirt: SubCategory = {
  id: '1-2',
  subcategory_name: 'シャツ',
  category: tops,
};

const pants: SubCategory = {
  id: '2-1',
  subcategory_name: 'パンツ',
  category: bottoms,
};

const skirt: SubCategory = {
  id: '2-2',
  subcategory_name: 'スカート',
  category: bottoms,
};

// サブカテゴリーを親カテゴリーに割り当て
tops.subcategories = [tshirt, shirt];
bottoms.subcategories = [pants, skirt];

const mockCategories: Category[] = [tops, bottoms];

describe('CategorySelectField', () => {
  const defaultProps = {
    name: 'category',
    label: 'カテゴリー',
    value: '',
    options: mockCategories,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('正しくレンダリングされること', () => {
    render(<CategorySelectField {...defaultProps} />);

    expect(screen.getByTestId('base-sheet-select')).toBeInTheDocument();
    expect(screen.getByText('カテゴリー')).toBeInTheDocument();
    mockCategories.forEach((category) => {
      expect(screen.getByText(category.category_name)).toBeInTheDocument();
    });
  });

  it('選択された値が正しく表示されること', () => {
    const selectedValue = '1-1'; // Tシャツ
    render(<CategorySelectField {...defaultProps} value={selectedValue} />);

    const triggerContent = screen.getByTestId('trigger-content');
    expect(triggerContent).toHaveTextContent('Tシャツ');
  });

  it('カテゴリーとそのサブカテゴリーが表示されること', () => {
    render(<CategorySelectField {...defaultProps} />);

    mockCategories.forEach((category) => {
      expect(screen.getByText(category.category_name)).toBeInTheDocument();
      category.subcategories.forEach((sub) => {
        expect(screen.getByText(sub.subcategory_name)).toBeInTheDocument();
      });
    });
  });

  it('アイコンが正しく表示されること', () => {
    const mockRenderIcon = (categoryId: string) => (
      <span data-testid={`icon-${categoryId}`}>🎨</span>
    );

    render(<CategorySelectField {...defaultProps} renderIcon={mockRenderIcon} />);

    mockCategories.forEach((category) => {
      expect(screen.getByTestId(`icon-${category.id}`)).toBeInTheDocument();
    });
  });

  it('すべてのサブカテゴリーが正しく表示されること', () => {
    render(<CategorySelectField {...defaultProps} />);

    const allSubcategories = mockCategories.flatMap((category) => category.subcategories);

    allSubcategories.forEach((sub) => {
      expect(screen.getByText(sub.subcategory_name)).toBeInTheDocument();
    });
  });
});
