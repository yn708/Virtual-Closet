import { SUBJECT_OPTIONS } from '@/utils/data/selectData';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ContactFormData } from '../../types';
import ConfirmationStep from '../ConfirmationStep';

// SubmitButtonのモック
jest.mock('@/components/elements/button/SubmitButton', () => {
  return function MockSubmitButton({ className }: { className?: string }) {
    return <button className={className}>送信</button>;
  };
});

describe('ConfirmationStep', () => {
  // テスト用のデータ
  const mockFormData: ContactFormData = {
    name: 'テスト太郎',
    email: 'test@example.com',
    subject: SUBJECT_OPTIONS[0].id,
    message: 'テストメッセージ',
    privacyAgreed: true,
  };

  const mockOnBack = jest.fn();

  // 各テスト後にモックをリセット
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('表示に関するテスト', () => {
    it('未ログイン時は名前とメールアドレスを表示する', () => {
      render(<ConfirmationStep isSession={false} formData={mockFormData} onBack={mockOnBack} />);

      // 名前とメールアドレスが表示されているか確認
      expect(screen.getByText('お名前')).toBeInTheDocument();
      expect(screen.getByText(mockFormData.name as string)).toBeInTheDocument();
      expect(screen.getByText('メールアドレス')).toBeInTheDocument();
      expect(screen.getByText(mockFormData.email as string)).toBeInTheDocument();
    });

    it('ログイン時は名前とメールアドレスを表示しない', () => {
      render(<ConfirmationStep isSession={true} formData={mockFormData} onBack={mockOnBack} />);

      // 名前とメールアドレスが表示されていないことを確認
      expect(screen.queryByText('お名前')).not.toBeInTheDocument();
      expect(screen.queryByText('メールアドレス')).not.toBeInTheDocument();
    });

    it('共通項目（件名とお問い合わせ内容）を表示する', () => {
      render(<ConfirmationStep isSession={true} formData={mockFormData} onBack={mockOnBack} />);

      // 件名の表示確認
      expect(screen.getByText('件名')).toBeInTheDocument();
      expect(screen.getByText(SUBJECT_OPTIONS[0].name)).toBeInTheDocument();

      // お問い合わせ内容の表示確認（改行を含むテキストのマッチング）
      expect(screen.getByText('お問い合わせ内容')).toBeInTheDocument();
      expect(
        screen.getByText((content) => content.includes('テストメッセージ')),
      ).toBeInTheDocument();
    });

    it('未ログイン時で名前とメールアドレスが未設定の場合も正しく表示される', () => {
      const incompleteFormData: ContactFormData = {
        subject: SUBJECT_OPTIONS[0].id,
        message: 'テストメッセージ',
        privacyAgreed: true,
      };

      render(
        <ConfirmationStep isSession={false} formData={incompleteFormData} onBack={mockOnBack} />,
      );

      // 名前とメールアドレスのラベルは表示されるが、値は空
      expect(screen.getByText('お名前')).toBeInTheDocument();
      expect(screen.getByText('メールアドレス')).toBeInTheDocument();

      // 件名とメッセージは表示される
      expect(screen.getByText(SUBJECT_OPTIONS[0].name)).toBeInTheDocument();
      expect(screen.getByText('テストメッセージ')).toBeInTheDocument();
    });
  });

  describe('操作に関するテスト', () => {
    it('「修正する」ボタンをクリックするとonBackが呼ばれる', async () => {
      render(<ConfirmationStep isSession={true} formData={mockFormData} onBack={mockOnBack} />);

      // ボタンクリックのシミュレート
      const backButton = screen.getByText('修正する');
      await userEvent.click(backButton);

      // onBack関数が呼ばれたことを確認
      expect(mockOnBack).toHaveBeenCalledTimes(1);
    });

    it('送信ボタンが正しいスタイルで表示される', () => {
      render(<ConfirmationStep isSession={true} formData={mockFormData} onBack={mockOnBack} />);

      // 送信ボタンのスタイル確認
      const submitButton = screen.getByText('送信');
      expect(submitButton).toHaveClass('w-1/3');
    });
  });
});
