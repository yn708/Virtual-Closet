import { Form } from '@/components/ui/form';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useForm } from 'react-hook-form';
import FloatingLabelInputFormField from '../FloatingLabelInputFormField';

// テスト用のラッパーコンポーネント
const TestWrapper = ({ type = 'text', label = 'テストラベル', name = 'testField' }) => {
  const form = useForm({
    defaultValues: {
      [name]: '',
    },
  });

  return (
    <Form {...form}>
      <form>
        <FloatingLabelInputFormField form={form} name={name} label={label} type={type} />
      </form>
    </Form>
  );
};

describe('FloatingLabelInputFormField', () => {
  it('コンポーネントが正しくレンダリングされること', () => {
    render(<TestWrapper />);

    expect(screen.getByRole('text-input')).toBeInTheDocument();
    expect(screen.getByText('テストラベル')).toBeInTheDocument();
  });

  it('フォーカス時にラベルが適切に移動すること', async () => {
    render(<TestWrapper />);

    const input = screen.getByRole('text-input');
    const label = screen.getByText('テストラベル');

    // 初期状態
    expect(label).not.toHaveClass('text-xs');

    // フォーカス時
    fireEvent.focus(input);
    expect(label).toHaveClass('text-xs', 'text-blue-500');

    // ブラー時（値が空の場合）
    fireEvent.blur(input);
    await waitFor(() => {
      expect(label).not.toHaveClass('text-xs', 'text-blue-500');
    });
  });

  it('値が入力されている場合、ラベルが上部に固定されること', async () => {
    render(<TestWrapper />);

    const input = screen.getByRole('text-input');
    const label = screen.getByText('テストラベル');

    // 値を入力
    await userEvent.type(input, 'テスト入力');

    // ブラー時も上部に固定されていることを確認
    fireEvent.blur(input);
    await waitFor(() => {
      expect(label).toHaveClass('text-xs');
    });
  });

  // パスワードフィールドのテスト
  it('パスワードフィールドの表示/非表示が切り替えられること', async () => {
    render(<TestWrapper type="password" name="password" label="パスワード" />);

    const input = screen.getByRole('password-input');

    const toggleButton = screen.getByRole('button', {
      name: /パスワードを表示/i,
    });

    // 初期状態は非表示
    expect(input).toHaveAttribute('type', 'password');

    // パスワードを表示
    await userEvent.click(toggleButton);
    expect(input).toHaveAttribute('type', 'text');

    // パスワードを非表示
    await userEvent.click(toggleButton);
    expect(input).toHaveAttribute('type', 'password');
  });
});
