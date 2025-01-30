import type { Brand } from '@/types';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useBrandSearch } from '../../../hooks/useBrandSearch';
import BrandContent from '../BrandContent';

// useBrandSearchフックのモック
jest.mock('../../../hooks/useBrandSearch', () => ({
  useBrandSearch: jest.fn(),
}));

// ScrollAreaのモック
jest.mock('@/components/ui/scroll-area', () => ({
  ScrollArea: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="scroll-area">{children}</div>
  ),
}));

// SearchInputのモック
jest.mock('@/components/elements/form/input/SearchInput', () => ({
  SearchInput: ({
    value,
    onChange,
    onClear,
    placeholder,
  }: {
    value: string;
    onChange: (value: string) => void;
    onClear: () => void;
    placeholder?: string;
  }) => (
    <div>
      <input
        type="text"
        data-testid="search-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      <button onClick={onClear} data-testid="clear-button">
        Clear
      </button>
    </div>
  ),
}));

// LoadingElementsのモック
jest.mock('@/components/elements/loading/LoadingElements', () => ({
  __esModule: true,
  default: ({ message, containerClassName }: { message: string; containerClassName?: string }) => (
    <div data-testid="loading-elements" className={containerClassName}>
      {message}
    </div>
  ),
}));

// BrandListのモック
jest.mock('../../list/BrandList', () => ({
  __esModule: true,
  default: ({
    brands,
    label,
    emptyMessage,
  }: {
    brands: Brand[];
    label: string;
    emptyMessage?: string;
  }) => (
    <div data-testid="brand-list">
      <h3>{label}</h3>
      {brands.length === 0 && emptyMessage ? (
        <p>{emptyMessage}</p>
      ) : (
        <ul>
          {brands.map((brand) => (
            <li key={brand.id}>
              {brand.brand_name} ({brand.brand_name_kana})
            </li>
          ))}
        </ul>
      )}
    </div>
  ),
}));

// テスト用モックデータ
const mockBrands: Brand[] = [
  { id: '1', brand_name: 'Nike', brand_name_kana: 'ナイキ', is_popular: true },
  { id: '2', brand_name: 'Adidas', brand_name_kana: 'アディダス', is_popular: true },
];

describe('BrandContent', () => {
  const defaultProps = {
    selectedValue: '',
    onValueChange: jest.fn(),
    initialOptions: mockBrands,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // useBrandSearchのデフォルト値を設定
    (useBrandSearch as jest.Mock).mockReturnValue({
      searchTerm: '',
      setSearchTerm: jest.fn(),
      isLoading: false,
      searchResults: [],
    });
  });

  it('初期状態で正しくレンダリングされること', () => {
    render(<BrandContent {...defaultProps} />);

    expect(screen.getByTestId('search-input')).toBeInTheDocument();
    expect(screen.getByTestId('scroll-area')).toBeInTheDocument();
    expect(screen.getByText('人気のブランド')).toBeInTheDocument();
  });

  it('検索中はローディング状態が表示されること', () => {
    (useBrandSearch as jest.Mock).mockReturnValue({
      searchTerm: 'Nike',
      setSearchTerm: jest.fn(),
      isLoading: true,
      searchResults: [],
    });

    render(<BrandContent {...defaultProps} />);

    expect(screen.getByTestId('loading-elements')).toBeInTheDocument();
    expect(screen.getByText('検索中...')).toBeInTheDocument();
  });

  it('検索結果が表示されること', () => {
    const searchResults = [{ id: '3', brand_name: 'Puma', brand_name_kana: 'プーマ' }];

    (useBrandSearch as jest.Mock).mockReturnValue({
      searchTerm: 'Pu',
      setSearchTerm: jest.fn(),
      isLoading: false,
      searchResults,
    });

    render(<BrandContent {...defaultProps} />);

    expect(screen.getByText('検索結果')).toBeInTheDocument();
    expect(screen.getByText('Puma (プーマ)')).toBeInTheDocument();
  });

  it('検索結果が空の場合、適切なメッセージが表示されること', async () => {
    (useBrandSearch as jest.Mock).mockReturnValue({
      searchTerm: 'xyz',
      setSearchTerm: jest.fn(),
      isLoading: false,
      searchResults: [],
    });

    render(<BrandContent {...defaultProps} />);

    expect(screen.getByText('ブランドが見つかりません')).toBeInTheDocument();
  });

  it('検索入力が正しく動作すること', async () => {
    const setSearchTerm = jest.fn();
    (useBrandSearch as jest.Mock).mockReturnValue({
      searchTerm: '',
      setSearchTerm,
      isLoading: false,
      searchResults: [],
    });

    render(<BrandContent {...defaultProps} />);

    const searchInput = screen.getByTestId('search-input');
    await userEvent.type(searchInput, 'Nike');

    expect(setSearchTerm).toHaveBeenCalledTimes(4); // N,i,k,e の4回
  });

  it('クリアボタンが正しく動作すること', async () => {
    const setSearchTerm = jest.fn();
    (useBrandSearch as jest.Mock).mockReturnValue({
      searchTerm: 'Nike',
      setSearchTerm,
      isLoading: false,
      searchResults: [],
    });

    render(<BrandContent {...defaultProps} />);

    const clearButton = screen.getByTestId('clear-button');
    await userEvent.click(clearButton);

    expect(setSearchTerm).toHaveBeenCalledWith('');
  });

  it('検索していない状態で初期オプションが表示されること', () => {
    (useBrandSearch as jest.Mock).mockReturnValue({
      searchTerm: '',
      setSearchTerm: jest.fn(),
      isLoading: false,
      searchResults: [],
    });

    render(<BrandContent {...defaultProps} />);

    expect(screen.getByText('人気のブランド')).toBeInTheDocument();
    mockBrands.forEach((brand) => {
      expect(
        screen.getByText(`${brand.brand_name} (${brand.brand_name_kana})`),
      ).toBeInTheDocument();
    });
  });
});
