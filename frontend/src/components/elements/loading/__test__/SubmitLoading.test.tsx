import { render, screen } from '@testing-library/react';
import SubmitLoading from '../SubmitLoading';

describe('SubmitLoading', () => {
  it('コンポーネントが正しくレンダリングされること', () => {
    render(<SubmitLoading />);

    // ローディングコンテナの存在確認
    const loadingContainer = screen.getByTestId('loading-container');
    expect(loadingContainer).toBeInTheDocument();

    // コンテナに必要なスタイルクラスが適用されているか確認
    expect(loadingContainer).toHaveClass(
      'absolute',
      'inset-0',
      'flex',
      'items-center',
      'justify-center',
    );

    // スピナー要素の存在確認
    const spinner = screen.getByTestId('loading-spinner');
    expect(spinner).toBeInTheDocument();

    // スピナーに必要なスタイルクラスが適用されているか確認
    expect(spinner).toHaveClass(
      'animate-spin',
      'size-6',
      'border-2',
      'border-white',
      'rounded-full',
      'border-t-transparent',
    );
  });
});
