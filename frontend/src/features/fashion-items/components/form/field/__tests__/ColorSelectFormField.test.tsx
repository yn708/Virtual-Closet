import type { Color } from '@/types';
import { render, screen } from '@testing-library/react';
import ColorSelectFormField from '../ColorSelectFormField';

// 必要なモジュールのモック
jest.mock('@/components/ui/sheet', () => ({
  SheetClose: ({ children }: { children: React.ReactNode }) => children,
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
const mockColors: Color[] = [
  {
    id: '1',
    color_name: 'レッド',
    color_code: '#FF0000',
  },
  {
    id: '2',
    color_name: 'ブルー',
    color_code: '#0000FF',
  },
  {
    id: '3',
    color_name: 'グリーン',
    color_code: '#00FF00',
  },
];

describe('ColorSelectFormField', () => {
  const defaultProps = {
    name: 'color',
    label: 'カラー',
    value: '',
    options: mockColors,
    onChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('正しくレンダリングされること', () => {
    render(<ColorSelectFormField {...defaultProps} />);

    // 基本的なUI要素の確認
    expect(screen.getByTestId('base-sheet-select')).toBeInTheDocument();
    expect(screen.getByText('カラー')).toBeInTheDocument();

    // すべてのカラーオプションが表示されていることを確認
    mockColors.forEach((color) => {
      expect(screen.getByText(color.color_name)).toBeInTheDocument();
    });

    // 未選択オプションが表示されていることを確認
    expect(screen.getByText('未選択')).toBeInTheDocument();
  });

  it('各カラーオプションが正しいスタイルで表示されること', () => {
    render(<ColorSelectFormField {...defaultProps} />);

    mockColors.forEach((color) => {
      const button = screen.getByText(color.color_name).closest('button');
      const colorCircle = button?.querySelector('div.size-5');
      expect(colorCircle).toHaveStyle({ backgroundColor: color.color_code });
    });
  });
});
