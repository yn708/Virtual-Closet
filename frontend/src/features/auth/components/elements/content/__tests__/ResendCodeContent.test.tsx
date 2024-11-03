import { fireEvent, render, screen } from '@testing-library/react';

import type { UseFormReturn } from 'react-hook-form';

import ResendCodeContent from '../ResendCodeContent';
// モックの作成
const mockResendCodeForm = {
  form: {
    register: jest.fn(),
    handleSubmit: jest.fn(),
    formState: { errors: {} },
    control: {},
  },
  onSubmit: jest.fn(),
};

interface TestAuthFormProps {
  form: UseFormReturn;
  onSubmit: () => void;
  submitButtonLabel: string;
}

// AuthFormコンポーネントをモックする
jest.mock('../../form/AuthForm', () => {
  return function MockAuthForm({ form, onSubmit, submitButtonLabel }: TestAuthFormProps) {
    return (
      <form onSubmit={onSubmit}>
        <input placeholder="メールアドレス" {...form.register('email')} role="text-input" />
        <input
          placeholder="パスワード"
          {...form.register('password')}
          type="password"
          role="password-input"
        />
        <button type="submit">{submitButtonLabel}</button>
      </form>
    );
  };
});
jest.mock('@/features/auth/hooks/useResendCodeForm', () => ({
  useResendCodeForm: () => mockResendCodeForm,
}));

describe('ResendCodeContent', () => {
  beforeEach(() => {
    render(<ResendCodeContent email="test@example.com" />);
  });
  describe('初期表示テスト', () => {
    it('トリガーボタンが表示されること', () => {
      expect(screen.getByText('認証コードを再送信')).toBeInTheDocument();
    });

    it('初期状態ではダイアログが非表示であること', () => {
      expect(
        screen.queryByText('お手数ですがメールアドレスとパスワードの入力をお願いします。'),
      ).not.toBeInTheDocument();
    });
  });

  describe('ダイアログの操作テスト', () => {
    it('トリガーボタンクリックでダイアログが表示されること', async () => {
      const triggerButton = screen.getByRole('button', { name: '認証コードを再送信' });
      // ボタンクリック
      fireEvent.click(triggerButton);

      // ダイアログが表示されているか確認
      expect(
        await screen.findByText('お手数ですがメールアドレスとパスワードの入力をお願いします。'),
      ).toBeInTheDocument();
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
    it('ダイアログ内に必要なフォーム要素が表示されること', async () => {
      const triggerButton = screen.getByRole('button', { name: '認証コードを再送信' });
      fireEvent.click(triggerButton);

      // フォーム要素の確認
      expect(screen.getAllByRole('text-input')).toHaveLength(1);
      expect(screen.getAllByRole('password-input')).toHaveLength(1);
      expect(screen.getByRole('button', { name: '認証コードを再送信' })).toBeInTheDocument();
    });
  });
});
