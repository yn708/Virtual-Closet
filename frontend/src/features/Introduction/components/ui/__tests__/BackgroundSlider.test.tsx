import { ORIGINAL_WIDTH } from '@/utils/constants';
import { act, render } from '@testing-library/react';
import BackgroundSlider from '../BackgroundSlider';

// Image コンポーネントのモック
jest.mock('next/image', () => ({
  __esModule: true,
  default: function MockImage({
    src,
    alt,
    fill,
    priority,
    className,
    sizes,
  }: {
    src: string;
    alt: string;
    fill?: boolean;
    priority?: boolean;
    className?: string;
    sizes?: string;
  }) {
    return (
      <img
        src={src}
        alt={alt}
        data-fill={fill}
        data-priority={priority}
        className={className}
        data-sizes={sizes}
      />
    );
  },
}));

describe('BackgroundSlider', () => {
  const mockScreenSize = {
    width: 1920,
    height: 1080,
  };

  beforeEach(() => {
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: mockScreenSize.height,
    });

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
      expect(img).toHaveAttribute('src', '/images/fashion-bg.webp');
      expect(img).toHaveAttribute('alt', 'Fashion background');
      expect(img).toHaveAttribute('data-sizes', '100vw');
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

    // スタイルの検証
    const slideContainer = container.querySelector('.animate-slide');
    expect(slideContainer).toHaveStyle({
      '--image-width': `${ORIGINAL_WIDTH}px`,
    });

    // 画像コンテナのサイズ検証
    const imageContainers = container.querySelectorAll('.slider-image');
    imageContainers.forEach((container) => {
      expect(container).toHaveStyle({
        width: `${ORIGINAL_WIDTH}px`,
      });
    });
  });

  it('コンポーネントのアンマウント時にイベントリスナーが削除されること', () => {
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
    const { unmount } = render(<BackgroundSlider />);

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
  });
});
