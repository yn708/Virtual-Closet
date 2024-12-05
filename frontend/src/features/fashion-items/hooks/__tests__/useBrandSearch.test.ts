import useDebounce from '@/hooks/utils/useDebounce';
import { searchBrandsAPI } from '@/lib/api/fashionItemsApi';
import { act, renderHook } from '@testing-library/react';
import { useBrandSearch } from '../useBrandSearch';

// APIモックの設定
jest.mock('@/lib/api/fashionItemsApi', () => ({
  searchBrandsAPI: jest.fn(),
}));

// useDebounceモックの設定
jest.mock('@/hooks/utils/useDebounce', () => ({
  __esModule: true,
  default: jest.fn((value) => value),
}));

describe('useBrandSearch', () => {
  const mockBrands = [
    { id: 1, name: 'Nike' },
    { id: 2, name: 'Adidas' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('検索文字列が変更されたときに自動的に検索が実行されること', async () => {
    (searchBrandsAPI as jest.Mock).mockResolvedValue(mockBrands);
    const { result } = renderHook(() => useBrandSearch());

    await act(async () => {
      result.current.setSearchTerm('Nike');
    });

    expect(searchBrandsAPI).toHaveBeenCalledWith('Nike');
    expect(result.current.searchResults).toEqual(mockBrands);
  });

  it('検索文字列が空の場合、結果がクリアされること', async () => {
    (searchBrandsAPI as jest.Mock).mockResolvedValueOnce(mockBrands);
    const { result } = renderHook(() => useBrandSearch());

    await act(async () => {
      result.current.setSearchTerm('Nike');
    });

    expect(result.current.searchResults).toEqual(mockBrands);

    await act(async () => {
      result.current.setSearchTerm(''); // 検索文字列を空に
    });

    expect(result.current.searchResults).toEqual([]);
    expect(searchBrandsAPI).toHaveBeenCalledTimes(1); // 再度APIが呼ばれない
  });

  it('最小文字数未満の検索文字列の場合、自動検索が実行されないこと', async () => {
    const { result } = renderHook(() => useBrandSearch());

    await act(async () => {
      result.current.setSearchTerm('a');
    });

    expect(searchBrandsAPI).not.toHaveBeenCalled();
    expect(result.current.searchResults).toEqual([]);
  });

  it('検索文字列が空の場合、結果がクリアされること', async () => {
    // 初期状態で検索結果がある状態を作る
    (searchBrandsAPI as jest.Mock).mockResolvedValueOnce(mockBrands);
    const { result } = renderHook(() => useBrandSearch());

    await act(async () => {
      result.current.setSearchTerm('Nike');
    });

    expect(result.current.searchResults).toEqual(mockBrands);

    // 検索文字列を空にする
    await act(async () => {
      result.current.setSearchTerm('');
    });

    expect(result.current.searchResults).toEqual([]);
    // 2回目のAPI呼び出しがないことを確認
    expect(searchBrandsAPI).toHaveBeenCalledTimes(1);
  });

  it('連続した検索でデバウンスが正しく機能すること', async () => {
    (searchBrandsAPI as jest.Mock).mockResolvedValue(mockBrands);
    let debouncedValue = '';
    (useDebounce as jest.Mock).mockImplementation(() => debouncedValue);

    const { result, rerender } = renderHook(() => useBrandSearch());

    // 複数回の検索文字列の変更
    await act(async () => {
      result.current.setSearchTerm('N');
      result.current.setSearchTerm('Ni');
      result.current.setSearchTerm('Nik');
      result.current.setSearchTerm('Nike');

      // 最終的なデバウンス値のみが反映されることをシミュレート
      debouncedValue = 'Nike';
      rerender();
    });

    expect(searchBrandsAPI).toHaveBeenCalledTimes(1);
    expect(searchBrandsAPI).toHaveBeenCalledWith('Nike');
  });
});
