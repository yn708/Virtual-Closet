import { render, screen } from '@testing-library/react';
import LegalTextContent from '../LegalTextContent';

// モックコンポーネントの作成
jest.mock('../../dialog/LegalDialog', () => ({
  LegalDialog: ({ label }: { label: string }) => (
    <span data-testid={`legal-dialog-${label}`}>{label}</span>
  ),
}));

describe('LegalTextContent', () => {
  // 各テストの前にコンポーネントを描画
  beforeEach(() => {
    render(<LegalTextContent />);
  });

  // テキストの存在確認
  it('基本テキストが表示されること', () => {
    expect(screen.getByText(/登録で/)).toBeInTheDocument();
    expect(screen.getByText(/に同意したことになります。/)).toBeInTheDocument();
  });

  // プライバシーポリシーのダイアログが正しく表示されること
  it('プライバシーポリシーのダイアログが存在すること', () => {
    const privacyDialog = screen.getByTestId('legal-dialog-プライバシーポリシー');
    expect(privacyDialog).toBeInTheDocument();
    expect(privacyDialog).toHaveTextContent('プライバシーポリシー');
  });

  // 利用規約のダイアログが正しく表示されること
  it('利用規約のダイアログが存在すること', () => {
    const termsDialog = screen.getByTestId('legal-dialog-利用規約');
    expect(termsDialog).toBeInTheDocument();
    expect(termsDialog).toHaveTextContent('利用規約');
  });

  // スタイリングのテスト
  it('適切なスタイリングが適用されていること', () => {
    const container = screen.getByText(/登録で/).closest('div');
    expect(container).toHaveClass('text-sm', 'text-muted-foreground', 'pt-2');
  });
});
