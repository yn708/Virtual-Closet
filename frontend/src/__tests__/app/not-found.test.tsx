import NotFound from '@/app/not-found';
import { render } from '@testing-library/react';

describe('NotFound', () => {
  // NotFoundコンポーネントがエラーメッセージを正しく表示するかを確認するテスト
  it('displays the error message', () => {
    const { getByText } = render(<NotFound />);
    expect(getByText('ページが見つかりませんでした')).toBeInTheDocument();
  });

  // NotFoundコンポーネントがリンクを正しく表示するかを確認するテスト
  it('displays the correct links', () => {
    const { getByText } = render(<NotFound />);
    expect(getByText('ホームページに戻る')).toBeInTheDocument();
    expect(getByText('お問い合わせ')).toBeInTheDocument();
  });
});
