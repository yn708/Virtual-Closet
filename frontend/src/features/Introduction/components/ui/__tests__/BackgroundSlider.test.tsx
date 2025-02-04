import { render } from '@testing-library/react';
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
      // expect(img).toHaveAttribute('data-sizes', '100vw');
    });
  });

  it('コンポーネントのアンマウント時にイベントリスナーが削除されること', () => {
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
    const { unmount } = render(<BackgroundSlider />);

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
  });
});
