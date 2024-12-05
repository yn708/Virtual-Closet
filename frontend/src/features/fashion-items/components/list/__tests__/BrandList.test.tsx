import type { Brand } from '@/types';
import { fireEvent, render, screen } from '@testing-library/react';
import BrandList from '../BrandList';

// SheetCloseのモック
jest.mock('@/components/ui/sheet', () => ({
  SheetClose: ({ children }: { children: React.ReactNode }) => children,
}));

describe('BrandList', () => {
  // テストデータ
  const mockBrands: Brand[] = [
    {
      id: '1',
      brand_name: 'Nike',
      brand_name_kana: 'ナイキ',
      is_popular: true,
    },
    {
      id: '2',
      brand_name: 'Adidas',
      brand_name_kana: 'アディダス',
      is_popular: true,
    },
  ];

  const defaultProps = {
    brands: mockBrands,
    isLoading: false,
    onValueChange: jest.fn(),
    selectedValue: '',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('ローディング中の表示が正しく動作すること', () => {
    render(<BrandList {...defaultProps} isLoading={true} />);

    expect(screen.getByText('読み込み中')).toBeInTheDocument();
  });

  it('ブランドが空の場合のメッセージが表示されること', () => {
    render(<BrandList {...defaultProps} brands={[]} />);

    expect(screen.getByText('ブランドが見つかりません')).toBeInTheDocument();
  });

  it('カスタムの空メッセージが表示されること', () => {
    const customEmptyMessage = 'カスタムメッセージ';
    render(<BrandList {...defaultProps} brands={[]} emptyMessage={customEmptyMessage} />);

    expect(screen.getByText(customEmptyMessage)).toBeInTheDocument();
  });

  it('ラベルが正しく表示されること', () => {
    const label = 'ブランド一覧';
    render(<BrandList {...defaultProps} label={label} />);

    expect(screen.getByText(label)).toBeInTheDocument();
  });

  it('ブランドリストが正しくレンダリングされること', () => {
    render(<BrandList {...defaultProps} />);

    mockBrands.forEach((brand) => {
      expect(screen.getByText(brand.brand_name)).toBeInTheDocument();
      expect(screen.getByText(brand.brand_name_kana)).toBeInTheDocument();
    });
    expect(screen.getByText('未選択')).toBeInTheDocument();
  });

  it('ブランドが選択されたときにonValueChangeが呼ばれること', () => {
    const onValueChange = jest.fn();
    render(<BrandList {...defaultProps} onValueChange={onValueChange} />);

    fireEvent.click(screen.getByText('Nike'));
    expect(onValueChange).toHaveBeenCalledWith('1');
  });

  it('未選択ボタンをクリックしたときに空文字が渡されること', () => {
    const onValueChange = jest.fn();
    render(<BrandList {...defaultProps} onValueChange={onValueChange} />);

    fireEvent.click(screen.getByText('未選択'));
    expect(onValueChange).toHaveBeenCalledWith('');
  });

  it('選択されたブランドが強調表示されること', () => {
    render(<BrandList {...defaultProps} selectedValue="1" />);

    const selectedButton = screen.getByText('Nike').closest('button');
    expect(selectedButton).toHaveClass('border-2', 'border-primary', 'bg-primary/5');
  });

  it('グリッドレイアウトが正しく適用されること', () => {
    render(<BrandList {...defaultProps} />);

    const gridContainer = screen.getByText('Nike').closest('div');
    expect(gridContainer).toHaveClass(
      'grid',
      'grid-cols-1',
      'lg:grid-cols-3',
      'md:grid-cols-2',
      'gap-2',
    );
  });
});
