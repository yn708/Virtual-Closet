import { act, render } from '@testing-library/react';
import BackgroundSlider from '../BackgroundSlider';

// Image コンポーネントのモック
jest.mock('next/image', () => ({
  __esModule: true,
  default: function MockImage({
    src,
    alt,
    className,
    priority,
    sizes,
  }: {
    src: string;
    alt: string;
    className?: string;
    priority?: boolean;
    sizes?: string;
  }) {
    return (
      <img src={src} alt={alt} className={className} data-priority={priority} data-sizes={sizes} />
    );
  },
}));

describe('BackgroundSlider', () => {
  // 画面サイズのモック値
  const mockScreenSize = {
    width: 1920,
    height: 1080,
  };

  beforeEach(() => {
    // window.innerHeight のモック
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: mockScreenSize.height,
    });

    // ResizeObserver のモック
    global.ResizeObserver = jest.fn().mockImplementation(() => ({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('コンポーネントが正しくレンダリングされること', () => {
    const { container } = render(<BackgroundSlider />);

    // 背景画像コンテナの存在確認
    expect(container.querySelector('.fixed')).toBeInTheDocument();

    // 2つの画像要素が存在することを確認
    const images = container.getElementsByTagName('img');
    expect(images).toHaveLength(2);

    // 各画像の属性を確認
    Array.from(images).forEach((img) => {
      expect(img).toHaveAttribute('src', '/images/fashion-bg.png');
      expect(img).toHaveAttribute('alt', 'Fashion items background');
      expect(img).toHaveAttribute('data-priority', 'true');
    });
  });

  it('画面サイズ変更時にdimensionsが正しく更新されること', () => {
    const { container } = render(<BackgroundSlider />);

    // 新しい画面サイズを設定
    const newHeight = 800;
    act(() => {
      window.innerHeight = newHeight;
      window.dispatchEvent(new Event('resize'));
    });

    // スケールと幅の計算
    const expectedScale = newHeight / 1080;
    const expectedWidth = 3840 * expectedScale;

    // スタイルの検証
    const slideContainer = container.querySelector('.animate-slide');
    expect(slideContainer).toHaveStyle({
      '--image-width': `${expectedWidth}px`,
    });

    // 画像コンテナのサイズ検証
    const imageContainers = container.querySelectorAll('.shrink-0');
    imageContainers.forEach((container) => {
      expect(container).toHaveStyle({
        width: `${expectedWidth}px`,
        height: '100vh',
      });
    });
  });

  it('コンポーネントのアンマウント時にイベントリスナーが削除されること', () => {
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
    const { unmount } = render(<BackgroundSlider />);

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
  });

  it('画像のsizes属性が正しく設定されること', () => {
    const { container } = render(<BackgroundSlider />);

    const expectedScale = mockScreenSize.height / 1080;
    const expectedWidth = 3840 * expectedScale;

    const images = container.getElementsByTagName('img');
    Array.from(images).forEach((img) => {
      expect(img).toHaveAttribute('data-sizes', `${expectedWidth}px`);
    });
  });
});
