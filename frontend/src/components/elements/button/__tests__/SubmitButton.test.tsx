import { render } from '@testing-library/react';
import SubmitLoading from '../../loading/SubmitLoading';

describe('SubmitLoading', () => {
  it('正しくレンダリングされること', () => {
    const { container } = render(<SubmitLoading />);

    // コンテナ要素のチェック
    const containerElement = container.firstChild as HTMLElement;
    expect(containerElement).toHaveClass(
      'absolute',
      'inset-0',
      'flex',
      'items-center',
      'justify-center',
    );
  });

  it('スピナーが正しくレンダリングされること', () => {
    const { container } = render(<SubmitLoading />);

    // スピナー要素のチェック
    const spinnerElement = container.querySelector('.animate-spin');
    expect(spinnerElement).toBeInTheDocument();
    expect(spinnerElement).toHaveClass(
      'animate-spin',
      'size-6',
      'border-2',
      'border-white',
      'rounded-full',
      'border-t-transparent',
    );
  });

  it('正しいDOM構造であること', () => {
    const { container } = render(<SubmitLoading />);

    // DOM構造の検証
    const containerElement = container.firstChild as HTMLElement;
    expect(containerElement.children.length).toBe(1);
    expect(containerElement.firstChild).toHaveClass('animate-spin');
  });
});
