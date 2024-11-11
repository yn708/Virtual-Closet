import type { BaseLinkProps, LabelType } from '@/types';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NormalLink from '../NormalLink';

// NormalLinkの型定義を拡張
interface ExtendedNormalLinkProps extends BaseLinkProps, LabelType {
  onClick?: () => void;
}

// Next.jsのLinkコンポーネントのモックを改善
jest.mock('next/link', () => {
  const MockLink = jest
    .fn()
    .mockImplementation(
      ({
        children,
        href,
        className,
      }: {
        children: React.ReactNode;
        href: string;
        className?: string;
      }) => {
        return (
          <a
            href={href}
            className={className}
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            {children}
          </a>
        );
      },
    );
  return MockLink;
});

describe('NormalLink', () => {
  const defaultProps: Omit<ExtendedNormalLinkProps, 'onClick'> = {
    label: 'テストリンク',
    href: '/test',
  };

  it('正しくレンダリングされること', () => {
    render(<NormalLink {...defaultProps} />);

    const link = screen.getByRole('link', { name: defaultProps.label });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', defaultProps.href);
    expect(link).toHaveTextContent(defaultProps.label);
  });

  it('デフォルトのスタイルクラスが適用されること', () => {
    render(<NormalLink {...defaultProps} />);

    const link = screen.getByRole('link');
    expect(link).toHaveClass(
      'font-medium',
      'text-blue-500',
      'hover:text-blue-700',
      'hover:underline',
    );
  });

  it('ホバー時のスタイルクラスが適用されること', () => {
    render(<NormalLink {...defaultProps} />);

    const link = screen.getByRole('link');
    expect(link).toHaveClass('hover:text-blue-700', 'hover:underline');
  });

  // クリックイベントのテスト修正
  it('クリック時にイベントが発生すること', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();

    render(
      <div onClick={handleClick}>
        <NormalLink {...defaultProps} />
      </div>,
    );

    const link = screen.getByRole('link');
    await user.click(link);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
