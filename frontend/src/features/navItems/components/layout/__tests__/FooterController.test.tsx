import { COORDINATE_CREATE_CANVAS_URL } from '@/utils/constants';
import { render } from '@testing-library/react';
import { usePathname } from 'next/navigation';
import Footer from '../Footer';
import FooterController from '../FooterController';

// next/navigationのモック
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

// Footerコンポーネントのモック
jest.mock('../Footer', () => {
  return jest.fn(() => <div data-testid="footer">Footer Component</div>);
});

describe('FooterController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders Footer when path is not in hideFooterPaths', () => {
    // 通常のパスを設定
    (usePathname as jest.Mock).mockReturnValue('/home');

    const { getByTestId } = render(<FooterController />);

    // Footerコンポーネントが表示されていることを確認
    expect(getByTestId('footer')).toBeInTheDocument();
    // Footerコンポーネントが1回呼び出されていることを確認
    expect(Footer).toHaveBeenCalledTimes(1);
  });

  it('does not render Footer when path is in hideFooterPaths', () => {
    // COORDINATE_CREATE_CANVAS_URLパスを設定
    (usePathname as jest.Mock).mockReturnValue(COORDINATE_CREATE_CANVAS_URL);

    const { container } = render(<FooterController />);

    // コンテナが空であることを確認
    expect(container.firstChild).toBeNull();
    // Footerコンポーネントが呼び出されていないことを確認
    expect(Footer).not.toHaveBeenCalled();
  });

  it('renders Footer for any other path', () => {
    // 別のランダムなパスを設定
    (usePathname as jest.Mock).mockReturnValue('/random-path');

    const { getByTestId } = render(<FooterController />);

    expect(getByTestId('footer')).toBeInTheDocument();
    expect(Footer).toHaveBeenCalledTimes(1);
  });

  it('handles empty pathname', () => {
    // 空のパス名を設定
    (usePathname as jest.Mock).mockReturnValue('');

    const { getByTestId } = render(<FooterController />);

    expect(getByTestId('footer')).toBeInTheDocument();
    expect(Footer).toHaveBeenCalledTimes(1);
  });

  it('handles undefined pathname', () => {
    // undefinedのパス名を設定
    (usePathname as jest.Mock).mockReturnValue(undefined);

    const { getByTestId } = render(<FooterController />);

    expect(getByTestId('footer')).toBeInTheDocument();
    expect(Footer).toHaveBeenCalledTimes(1);
  });
});
