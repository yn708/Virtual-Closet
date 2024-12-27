import Header from '@/features/navItems/components/layout/Header';
import { COORDINATE_CREATE_CANVAS_URL } from '@/utils/constants';
import { render } from '@testing-library/react';
import { usePathname } from 'next/navigation';
import HeaderController from '../HeaderController';

// next/navigationのモック
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

// Headerコンポーネントのモック
jest.mock('@/features/navItems/components/layout/Header', () => {
  return jest.fn(() => <div data-testid="header">Header Component</div>);
});

describe('HeaderController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders Header when path is not in hideHeaderPaths', () => {
    // 通常のパスを設定
    (usePathname as jest.Mock).mockReturnValue('/home');

    const { getByTestId } = render(<HeaderController />);

    // Headerコンポーネントが表示されていることを確認
    expect(getByTestId('header')).toBeInTheDocument();
    // Headerコンポーネントが1回呼び出されていることを確認
    expect(Header).toHaveBeenCalledTimes(1);
  });

  it('does not render Header when path is in hideHeaderPaths', () => {
    // COORDINATE_CREATE_CANVAS_URLパスを設定
    (usePathname as jest.Mock).mockReturnValue(COORDINATE_CREATE_CANVAS_URL);

    const { container } = render(<HeaderController />);

    // コンテナが空であることを確認
    expect(container.firstChild).toBeNull();
    // Headerコンポーネントが呼び出されていないことを確認
    expect(Header).not.toHaveBeenCalled();
  });

  it('renders Header for any other path', () => {
    // 別のランダムなパスを設定
    (usePathname as jest.Mock).mockReturnValue('/random-path');

    const { getByTestId } = render(<HeaderController />);

    expect(getByTestId('header')).toBeInTheDocument();
    expect(Header).toHaveBeenCalledTimes(1);
  });

  it('handles empty pathname', () => {
    // 空のパス名を設定
    (usePathname as jest.Mock).mockReturnValue('');

    const { getByTestId } = render(<HeaderController />);

    expect(getByTestId('header')).toBeInTheDocument();
    expect(Header).toHaveBeenCalledTimes(1);
  });

  it('handles undefined pathname', () => {
    // undefinedのパス名を設定
    (usePathname as jest.Mock).mockReturnValue(undefined);

    const { getByTestId } = render(<HeaderController />);

    expect(getByTestId('header')).toBeInTheDocument();
    expect(Header).toHaveBeenCalledTimes(1);
  });
});
