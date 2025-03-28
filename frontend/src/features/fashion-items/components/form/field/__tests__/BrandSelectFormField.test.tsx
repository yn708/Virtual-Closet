import type { Brand } from '@/types';
import { render, screen } from '@testing-library/react';
import BrandSelectFormField from '../BrandSelectFormField';

// BrandContentのモックを修正
jest.mock('../../../content/BrandContent', () => {
  return function MockBrandContent({
    selectedValue,
    onValueChange,
    initialOptions,
  }: {
    selectedValue?: string;
    onValueChange: (value: Brand) => void;
    initialOptions: Brand[];
  }) {
    return (
      <div data-testid="brand-content">
        <select
          data-testid="brand-select"
          value={selectedValue || ''}
          onChange={(e) => {
            const selected = initialOptions.find((option) => option.id === e.target.value);
            if (selected) {
              onValueChange(selected);
            }
          }}
        >
          {initialOptions.map((option) => (
            <option key={option.id} value={option.id}>
              {option.brand_name}
            </option>
          ))}
        </select>
      </div>
    );
  };
});

// BaseSheetSelectFormFieldのモックを修正
jest.mock('@/components/elements/form/select/BaseSheetSelectFormField', () => {
  return function MockBaseSheetSelectFormField({
    label,
    value,
    error,
    trigger,
    children,
  }: {
    name: string;
    label: string;
    value?: string;
    error?: string[];
    trigger: () => React.ReactNode;
    children: ({
      value,
      onChange,
    }: {
      value?: string;
      onChange: (value: string) => void;
    }) => React.ReactNode;
  }) {
    return (
      <div data-testid="base-sheet-select">
        <label>{label}</label>
        <div data-testid="trigger-content">{trigger()}</div>
        {error && <div data-testid="error-message">{error}</div>}
        {children({
          value,
          onChange: () => {},
        })}
      </div>
    );
  };
});

const mockBrands: Brand[] = [
  { id: '1', brand_name: 'Nike', brand_name_kana: 'ナイキ', is_popular: true },
  { id: '2', brand_name: 'Adidas', brand_name_kana: 'アディダス', is_popular: true },
];

describe('BrandSelectFormField', () => {
  const defaultProps = {
    name: 'brand',
    label: 'ブランド',
    options: mockBrands,
    onChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('正しくレンダリングされること', () => {
    render(<BrandSelectFormField {...defaultProps} />);

    expect(screen.getByTestId('base-sheet-select')).toBeInTheDocument();
    expect(screen.getByText('ブランド')).toBeInTheDocument();
  });

  it('初期値が設定されている場合、その値が表示されること', () => {
    render(<BrandSelectFormField {...defaultProps} value={mockBrands[0]} />);

    const triggerContent = screen.getByTestId('trigger-content');
    expect(triggerContent).toHaveTextContent('Nike');
    expect(triggerContent).toHaveTextContent('ナイキ');
  });

  it('オプションが正しく表示されること', () => {
    render(<BrandSelectFormField {...defaultProps} />);

    const select = screen.getByTestId('brand-select');
    const options = select.getElementsByTagName('option');

    expect(options).toHaveLength(mockBrands.length);
    expect(options[0]).toHaveTextContent('Nike');
    expect(options[1]).toHaveTextContent('Adidas');
  });
});
