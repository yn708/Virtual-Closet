import { FASHION_ITEMS_CATEGORY } from '@/utils/data/selectData';
import { fireEvent, render, screen } from '@testing-library/react';
import HorizontalCategoryScroll from '../HorizontalCategoryScroll';

// スクロール関連のモックを設定
const mockScrollTo = jest.fn();
Element.prototype.scrollTo = mockScrollTo;
Element.prototype.getBoundingClientRect = jest.fn().mockReturnValue({
  width: 1000,
  left: 0,
});

describe('HorizontalCategoryScroll', () => {
  // テストで使用する共通の props
  const defaultProps = {
    selectedCategory: FASHION_ITEMS_CATEGORY[0].id,
    onCategoryChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // 基本的なレンダリングテスト
  it('renders all category buttons', () => {
    render(<HorizontalCategoryScroll {...defaultProps} />);

    FASHION_ITEMS_CATEGORY.forEach((category) => {
      const button = screen.getByText(category.label);
      expect(button).toBeInTheDocument();
    });
  });

  // 選択されたカテゴリーの表示状態テスト
  it('applies correct styles to selected category', () => {
    const selectedId = FASHION_ITEMS_CATEGORY[1].id;
    render(<HorizontalCategoryScroll {...defaultProps} selectedCategory={selectedId} />);

    const selectedButton = screen.getByText(FASHION_ITEMS_CATEGORY[1].label);
    expect(selectedButton).toHaveClass('shadow-md');

    // 非選択のボタンのスタイル確認
    const nonSelectedButton = screen.getByText(FASHION_ITEMS_CATEGORY[0].label);
    expect(nonSelectedButton).not.toHaveClass('shadow-md');
  });

  // カテゴリークリック時の動作テスト
  it('calls onCategoryChange when clicking a category', () => {
    render(<HorizontalCategoryScroll {...defaultProps} />);

    const categoryToClick = FASHION_ITEMS_CATEGORY[2];
    const button = screen.getByText(categoryToClick.label);

    fireEvent.click(button);

    expect(defaultProps.onCategoryChange).toHaveBeenCalledWith(categoryToClick.id);
  });

  // スクロール機能のテスト
  it('scrolls to the selected category', () => {
    const { container } = render(<HorizontalCategoryScroll {...defaultProps} />);

    // スクロールエリアの要素を取得
    const scrollArea = container.querySelector('[data-radix-scroll-area-viewport]');
    expect(scrollArea).toBeInTheDocument();

    // カテゴリーをクリック
    const categoryToClick = FASHION_ITEMS_CATEGORY[2];
    const button = screen.getByText(categoryToClick.label);

    fireEvent.click(button);

    // スクロールが呼び出されたことを確認
    expect(mockScrollTo).toHaveBeenCalled();
    expect(mockScrollTo).toHaveBeenCalledWith(
      expect.objectContaining({
        behavior: 'smooth',
      }),
    );
  });

  // レスポンシブデザインのテスト
  it('applies correct responsive classes', () => {
    render(<HorizontalCategoryScroll {...defaultProps} />);

    const buttons = screen.getAllByRole('button');
    buttons.forEach((button) => {
      expect(button).toHaveClass('text-xs');
      expect(button).toHaveClass('md:text-sm');
    });
  });
});
