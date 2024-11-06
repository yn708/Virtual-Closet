import { ICON_SIZE } from '@/utils/constants';
import { fireEvent, render, screen } from '@testing-library/react';
import { Home } from 'lucide-react';
import type { IconLinkProps } from '../IconLink';
import IconLink from '../IconLink';

// Next.jsのLinkコンポーネントをモック
jest.mock('next/link', () => {
  const MockLink = ({ children, ...props }: { children: React.ReactNode; href: string }) => {
    return (
      <a {...props} href={props.href}>
        {children}
      </a>
    );
  };
  MockLink.displayName = 'MockLink';
  return MockLink;
});

describe('IconLink', () => {
  // テスト用のデフォルトpropsを型安全に定義
  const defaultProps: IconLinkProps = {
    href: '/test',
    Icon: Home as IconLinkProps['Icon'], // 明示的な型キャスト
    label: 'Home',
    showText: true,
    rounded: false,
    size: 'md',
    onClick: () => {},
  };

  // 基本的なレンダリングテスト
  it('should render correctly with default props', () => {
    render(<IconLink {...defaultProps} />);

    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/test');

    // アイコンの存在確認
    expect(link.querySelector('svg')).toBeInTheDocument();

    // ラベルテキストの確認
    expect(screen.getByText('Home')).toBeInTheDocument();
  });

  // showText=falseの場合のテスト
  it('should hide text visually when showText is false', () => {
    render(<IconLink {...defaultProps} showText={false} />);

    const labelText = screen.getByText('Home');
    expect(labelText).toHaveClass('sr-only');
  });

  // rounded=trueの場合のテスト
  it('should apply rounded style when rounded is true', () => {
    render(<IconLink {...defaultProps} rounded />);

    const link = screen.getByRole('link');
    expect(link).toHaveClass('rounded-full');
  });

  // カスタムclassNameのテスト
  it('should apply custom className', () => {
    const customClass = 'test-custom-class';
    render(<IconLink {...defaultProps} className={customClass} />);

    const link = screen.getByRole('link');
    expect(link).toHaveClass(customClass);
  });

  // アイコンサイズのテスト
  it.each([
    ['sm', ICON_SIZE.sm],
    ['md', ICON_SIZE.md],
    ['lg', ICON_SIZE.lg],
  ])('should render icon with correct size for %s', (size, expectedClass) => {
    render(<IconLink {...defaultProps} size={size as 'sm' | 'md' | 'lg'} />);

    const icon = screen.getByRole('link').querySelector('svg');
    expect(icon).toHaveClass(expectedClass);
  });

  // onClickハンドラーのテスト
  it('should call onClick handler when clicked', () => {
    const mockOnClick = jest.fn();
    render(<IconLink {...defaultProps} onClick={mockOnClick} />);

    const link = screen.getByRole('link');
    fireEvent.click(link);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  // hover状態のスタイルテスト
  it('should have hover styles', () => {
    render(<IconLink {...defaultProps} />);

    const link = screen.getByRole('link');
    expect(link).toHaveClass('hover:bg-muted');
  });

  // アイコンの色スタイルテスト
  it('should have correct icon color style', () => {
    render(<IconLink {...defaultProps} />);

    const icon = screen.getByRole('link').querySelector('svg');
    expect(icon).toHaveClass('text-muted-foreground');
  });
});
