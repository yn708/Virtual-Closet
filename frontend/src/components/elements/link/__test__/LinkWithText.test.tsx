import { render, screen } from '@testing-library/react';
import Link from 'next/link';
import LinkWithText from '../LinkWithText';

// NormalLinkコンポーネントのモック
jest.mock('../NormalLink', () => {
  return function MockNormalLink({ href, label }: { href: string; label: string }) {
    return (
      <Link href={href} data-testid="normal-link">
        {label}
      </Link>
    );
  };
});

describe('LinkWithText', () => {
  const defaultProps = {
    text: '既にアカウントをお持ちの方は',
    label: 'ログイン',
    href: '/login',
  };

  it('テキストとリンクが正しくレンダリングされること', () => {
    render(<LinkWithText {...defaultProps} />);

    // テキストの存在確認
    expect(screen.getByText(defaultProps.text)).toBeInTheDocument();

    // リンクの存在確認
    const link = screen.getByTestId('normal-link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveTextContent(defaultProps.label);
    expect(link).toHaveAttribute('href', defaultProps.href);
  });

  // デフォルトのスタイルテスト
  it('デフォルトのスタイルクラスが適用されること', () => {
    render(<LinkWithText {...defaultProps} />);

    const container = screen.getByText(defaultProps.text).closest('p');
    expect(container).toHaveClass('pt-10', 'text-center', 'text-sm', 'text-gray-600');
  });
});
