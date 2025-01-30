import { render, screen } from '@testing-library/react';
import type { FilterSheetConfig } from '../../../types';
import CategorySelectButton from '../../button/CategorySelectButton';
import FilterSheet from '../../sheet/FilterSheet';
import CategorySelector from '../CategorySelector';

// コンポーネントのモック
jest.mock('../../button/CategorySelectButton', () => {
  return jest.fn(() => <div data-testid="category-select-button">CategorySelectButton</div>);
});

jest.mock('../../sheet/FilterSheet', () => {
  return jest.fn(() => <div data-testid="filter-sheet">FilterSheet</div>);
});

// テスト用のデフォルト設定
const defaultConfig: FilterSheetConfig = {
  title: 'Test Categories',
  categories: [
    { id: '1', label: 'Category 1' },
    { id: '2', label: 'Category 2' },
  ],
  filterGroups: [],
  layout: {
    categoryGrid: {
      small: 'grid-cols-2',
      large: 'grid-cols-3',
    },
  },
  filterHandlers: {
    defaultFilters: {},
  },
};

describe('CategorySelector', () => {
  // 基本的なprops
  const defaultProps = {
    onCategoryChange: jest.fn(),
    onFilterChange: jest.fn(),
    filters: {},
    config: defaultConfig,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('カテゴリーが選択されていない場合、CategorySelectButtonをレンダリングすること', () => {
    render(<CategorySelector {...defaultProps} />);

    // CategorySelectButtonが表示されていることを確認
    expect(screen.getByTestId('category-select-button')).toBeInTheDocument();
    // FilterSheetが表示されていないことを確認
    expect(screen.queryByTestId('filter-sheet')).not.toBeInTheDocument();

    // CategorySelectButtonに正しいpropsが渡されていることを確認
    expect(CategorySelectButton).toHaveBeenCalledWith(
      expect.objectContaining({
        onCategoryChange: defaultProps.onCategoryChange,
        size: 'large',
        config: defaultProps.config,
        selectedId: undefined,
      }),
      expect.any(Object),
    );
  });

  it('カテゴリーが選択されている場合、FilterSheetをレンダリングすること', () => {
    render(<CategorySelector {...defaultProps} selectedCategory="1" />);

    // FilterSheetが表示されていることを確認
    expect(screen.getByTestId('filter-sheet')).toBeInTheDocument();
    // CategorySelectButtonが表示されていないことを確認
    expect(screen.queryByTestId('category-select-button')).not.toBeInTheDocument();

    // FilterSheetに正しいpropsが渡されていることを確認
    expect(FilterSheet).toHaveBeenCalledWith(
      expect.objectContaining({
        filters: defaultProps.filters,
        onFilterChange: defaultProps.onFilterChange,
        onCategoryChange: defaultProps.onCategoryChange,
        config: defaultProps.config,
      }),
      expect.any(Object),
    );
  });

  it('正しいスタイリングが適用されること', () => {
    // カテゴリー未選択時のスタイリング
    const { rerender } = render(<CategorySelector {...defaultProps} />);
    expect(screen.getByTestId('category-select-button').parentElement).toHaveClass(
      'px-3 md:px-10 py-16 max-w-screen-2xl mx-auto',
    );

    // カテゴリー選択時のスタイリング
    rerender(<CategorySelector {...defaultProps} selectedCategory="1" />);
    expect(screen.getByTestId('filter-sheet').parentElement).toHaveClass('ml-4');
  });

  // エラー処理のテスト
  it('configが未定義の場合でも正しく処理されること', () => {
    const { config: _config, ...propsWithoutConfig } = defaultProps;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore - 意図的にconfigを省略してテスト
    expect(() => render(<CategorySelector {...propsWithoutConfig} />)).not.toThrow();
  });
});
