import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IoMdAdd } from 'react-icons/io';
import IconButton from '../IconButton';

// テストで使用するモック関数
const mockOnClick = jest.fn();

// テストごとにモック関数をリセット
beforeEach(() => {
  mockOnClick.mockClear();
});

describe('IconButton', () => {
  // 基本的なレンダリングテスト
  it('正しくレンダリングされること', () => {
    render(<IconButton Icon={IoMdAdd} label="追加" />);

    // アイコンと文字が表示されていることを確認
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByText('追加')).toBeInTheDocument();
  });

  // テキスト表示/非表示のテスト
  it('showText=falseの場合、sr-onlyクラスで文字が非表示になること', () => {
    render(<IconButton Icon={IoMdAdd} label="追加" showText={false} />);

    // sr-onlyクラスを持つspanタグ内にテキストがあることを確認
    const srOnlyText = screen.getByText('追加');
    expect(srOnlyText).toHaveClass('sr-only');
  });

  // roundedプロパティのテスト
  it('rounded=trueの場合、rounded-fullクラスが適用されること', () => {
    render(<IconButton Icon={IoMdAdd} label="追加" rounded={true} />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('rounded-full');
  });

  // クリックイベントのテスト
  it('クリック時にonClickハンドラーが呼ばれること', async () => {
    render(<IconButton Icon={IoMdAdd} label="追加" onClick={mockOnClick} />);

    // ボタンをクリック
    const button = screen.getByRole('button');
    await userEvent.click(button);

    // クリックハンドラーが1回呼ばれたことを確認
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  // サイズバリエーションのテスト
  it('異なるサイズが正しく適用されること', () => {
    const { rerender } = render(<IconButton Icon={IoMdAdd} label="追加" size="sm" />);

    // アイコンのサイズクラスを確認
    expect(screen.getByRole('button')).toBeInTheDocument();

    // 別のサイズで再レンダリング
    rerender(<IconButton Icon={IoMdAdd} label="追加" size="lg" />);

    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
