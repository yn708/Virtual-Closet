import { fireEvent, render, screen } from '@testing-library/react';
import type { FilterSheetConfig } from '../../../types';
import CategorySelectButton from '../CategorySelectButton';

// モックアイコンコンポーネントの作成
const MockIcon: React.FC<{ className?: string }> = ({ className }) => (
  <div data-testid="mock-icon" className={className} />
);

// テスト用のデフォルト設定
const defaultConfig: FilterSheetConfig = {
  title: 'Test Categories',
  categories: [
    {
      id: '1',
      label: 'Category 1',
      description: 'Description 1',
      icon: MockIcon,
    },
    {
      id: '2',
      label: 'Category 2',
    },
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

describe('CategorySelectButton', () => {
  // 基本的なprops
  const defaultProps = {
    onCategoryChange: jest.fn(),
    config: defaultConfig,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('全てのカテゴリーボタンが正しくレンダリングされること', () => {
    render(<CategorySelectButton {...defaultProps} />);

    // 各カテゴリーボタンの存在確認
    defaultConfig.categories.forEach((category) => {
      expect(screen.getByText(category.label)).toBeInTheDocument();
    });
  });

  it('アイコンが正しくレンダリングされること', () => {
    render(<CategorySelectButton {...defaultProps} />);

    // アイコンを持つカテゴリーのみアイコンが表示されていることを確認
    const icons = screen.getAllByTestId('mock-icon');
    expect(icons).toHaveLength(1); // 最初のカテゴリーのみアイコンを持つ
  });

  it('説明文が large サイズの時のみ表示されること', () => {
    // small サイズ（デフォルト）での確認
    const { rerender } = render(<CategorySelectButton {...defaultProps} />);
    expect(screen.queryByText('Description 1')).not.toBeInTheDocument();

    // large サイズでの確認
    rerender(<CategorySelectButton {...defaultProps} size="large" />);
    expect(screen.getByText('Description 1')).toBeInTheDocument();
  });

  it('クリックイベントが正しく発火すること', () => {
    render(<CategorySelectButton {...defaultProps} />);

    // 最初のカテゴリーボタンをクリック
    fireEvent.click(screen.getByText('Category 1'));
    expect(defaultProps.onCategoryChange).toHaveBeenCalledWith('1');
  });

  it('選択されたカテゴリーが正しくスタイリングされること', () => {
    render(<CategorySelectButton {...defaultProps} selectedId="1" />);

    // 選択されたボタンのスタイリングを確認
    const selectedButton = screen.getByText('Category 1').closest('button');
    expect(selectedButton).toHaveClass('bg-blue-500');
    expect(selectedButton).toHaveClass('text-white');

    // 選択されていないボタンのスタイリングを確認
    const unselectedButton = screen.getByText('Category 2').closest('button');
    expect(unselectedButton).not.toHaveClass('bg-blue-500');
  });

  it('gridのクラスが正しく適用されること', () => {
    // small サイズ（デフォルト）での確認
    const { rerender, container } = render(<CategorySelectButton {...defaultProps} />);
    expect(container.firstChild).toHaveClass('grid-cols-2');

    // large サイズでの確認
    rerender(<CategorySelectButton {...defaultProps} size="large" />);
    expect(container.firstChild).toHaveClass('grid-cols-3');
  });

  // エッジケースのテスト
  it('カテゴリーが空の場合でも正しくレンダリングされること', () => {
    const emptyConfig = {
      ...defaultConfig,
      categories: [],
    };
    render(<CategorySelectButton {...defaultProps} config={emptyConfig} />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
