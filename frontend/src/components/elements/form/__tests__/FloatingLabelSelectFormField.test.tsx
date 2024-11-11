import { Form } from '@/components/ui/form';
import { render, screen } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import FloatingLabelSelectFormField from '../FloatingLabelSelectFormField';

// テスト用のラッパーコンポーネント
const TestWrapper = ({
  label = 'テストラベル',
  name = 'testField',
  placeholder = 'プレースホルダー',
  defaultValue = '',
}) => {
  const form = useForm({
    defaultValues: {
      [name]: defaultValue,
    },
  });

  return (
    <Form {...form}>
      <form>
        <FloatingLabelSelectFormField
          form={form}
          name={name}
          label={label}
          placeholder={placeholder}
          options={[
            { id: '1', name: '選択肢1' },
            { id: '2', name: '選択肢2' },
            { id: '3', name: '選択肢3' },
          ]}
        />
      </form>
    </Form>
  );
};

describe('FloatingLabelSelectFormField', () => {
  it('コンポーネントが正しくレンダリングされること', () => {
    render(<TestWrapper />);

    // 基本要素の存在確認
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByText('テストラベル')).toBeInTheDocument();
    expect(screen.getByText('プレースホルダー')).toBeInTheDocument();
  });

  it('ラベルのスタイリングが正しいこと', () => {
    render(<TestWrapper />);

    const label = screen.getByText('テストラベル');

    // 初期状態のスタイリング
    expect(label).toHaveClass('text-gray-500');
    expect(label).toHaveClass('opacity-65');
  });

  it('初期値がある場合、適切なスタイリングが適用されること', () => {
    render(<TestWrapper defaultValue="1" />);

    const triggerButton = screen.getByRole('combobox');
    const label = screen.getByText('テストラベル');

    expect(triggerButton).toHaveClass('pt-6', 'pb-2');
    expect(label).toHaveClass('text-xs', 'top-2');
  });

  it('プレースホルダーが適切に表示されること', () => {
    const placeholder = '選択してください';
    render(<TestWrapper placeholder={placeholder} />);

    expect(screen.getByText(placeholder)).toBeInTheDocument();
    expect(screen.getByText(placeholder).parentElement).toHaveClass('placeholder:text-transparent');
  });

  it('必須の属性とアクセシビリティ属性が正しく設定されていること', () => {
    render(<TestWrapper />);

    const select = screen.getByRole('combobox');

    // アクセシビリティ属性の確認
    expect(select).toHaveAttribute('aria-expanded', 'false');
    expect(select).toHaveAttribute('type', 'button');
    expect(select).toHaveAttribute('dir', 'ltr');
  });

  it('コンポーネントのスタイリングが正しく適用されていること', () => {
    render(<TestWrapper />);

    const select = screen.getByRole('combobox');

    // 基本的なスタイリングの確認
    expect(select).toHaveClass(
      'flex',
      'w-full',
      'items-center',
      'justify-between',
      'rounded-md',
      'border',
    );
  });
});
