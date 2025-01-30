import { useScroll } from '@/hooks/utils/useScroll';
import { fireEvent, render, screen } from '@testing-library/react';
import BaseContentsLayout from '../BaseScrollContentsLayout';

// スクロール関連のモック
const mockScrollTo = jest.fn();
const mockScrollIntoView = jest.fn();
Object.defineProperty(window, 'scrollTo', { value: mockScrollTo });

// カスタムフックのモック
jest.mock('@/hooks/utils/useScroll');

// ScrollToTopButtonのモック
jest.mock('@/components/elements/button/ScrollToTopButton', () => {
  return jest.fn(({ show, onClick }) => (
    <button
      data-testid="scroll-to-top"
      onClick={onClick}
      style={{ display: show ? 'block' : 'none' }}
    >
      Scroll to Top
    </button>
  ));
});

describe('BaseContentsLayout', () => {
  // デフォルトのモック値
  const mockScrollToTop = jest.fn();
  const mockElementRef = { current: { scrollIntoView: mockScrollIntoView } };

  beforeEach(() => {
    jest.clearAllMocks();

    // useScrollのデフォルト実装
    (useScroll as jest.Mock).mockReturnValue({
      showScrollButton: false,
      scrollToTop: mockScrollToTop,
      elementRef: mockElementRef,
    });
  });

  it('子要素が正しくレンダリングされること', () => {
    render(
      <BaseContentsLayout>
        <div data-testid="test-child">Test Content</div>
      </BaseContentsLayout>,
    );

    expect(screen.getByTestId('test-child')).toBeInTheDocument();
  });

  it('スクロールボタンが非表示の状態で正しくレンダリングされること', () => {
    render(
      <BaseContentsLayout>
        <div>Test Content</div>
      </BaseContentsLayout>,
    );

    const scrollButton = screen.getByTestId('scroll-to-top');
    expect(scrollButton).toHaveStyle({ display: 'none' });
  });

  it('スクロールボタンが表示状態の時に正しくレンダリングされること', () => {
    (useScroll as jest.Mock).mockReturnValue({
      showScrollButton: true,
      scrollToTop: mockScrollToTop,
      elementRef: mockElementRef,
    });

    render(
      <BaseContentsLayout>
        <div>Test Content</div>
      </BaseContentsLayout>,
    );

    const scrollButton = screen.getByTestId('scroll-to-top');
    expect(scrollButton).toHaveStyle({ display: 'block' });
  });

  it('スクロールボタンをクリックするとscrollToTopが呼ばれること', () => {
    (useScroll as jest.Mock).mockReturnValue({
      showScrollButton: true,
      scrollToTop: mockScrollToTop,
      elementRef: mockElementRef,
    });

    render(
      <BaseContentsLayout>
        <div>Test Content</div>
      </BaseContentsLayout>,
    );

    const scrollButton = screen.getByTestId('scroll-to-top');
    fireEvent.click(scrollButton);
    expect(mockScrollToTop).toHaveBeenCalled();
  });

  it('カテゴリーが選択されていない場合はscrollIntoViewが呼ばれないこと', () => {
    render(
      <BaseContentsLayout>
        <div>Test Content</div>
      </BaseContentsLayout>,
    );

    expect(mockScrollIntoView).not.toHaveBeenCalled();
  });

  it('正しいスタイリングが適用されること', () => {
    const { container } = render(
      <BaseContentsLayout>
        <div>Test Content</div>
      </BaseContentsLayout>,
    );

    const outerDiv = container.firstChild as HTMLElement;
    expect(outerDiv).toHaveClass('min-h-screen w-full');

    const innerDiv = outerDiv.firstChild as HTMLElement;
    expect(innerDiv).toHaveClass(
      'mx-auto w-full max-w-[1400px] px-3 py-4 sm:px-4 sm:py-5 md:p-6 lg:px-8',
    );
  });
});
