import PasswordResetPage, { metadata } from '@/app/auth/password/reset/page';
import PasswordResetPageContent from '@/features/auth/components/elements/content/PasswordResetPageContent';

import { render, screen } from '@testing-library/react';

// PasswordResetPageContentコンポーネントをモック
jest.mock('@/features/auth/components/elements/content/PasswordResetPageContent', () => {
  return jest.fn(() => (
    <div data-testid="mocked-password-reset-content">パスワードリセットコンテンツ</div>
  ));
});

describe('PasswordResetPage', () => {
  beforeEach(() => {
    // 各テストの前にモックをクリア
    jest.clearAllMocks();
  });

  it('正しくレンダリングされること', () => {
    render(<PasswordResetPage />);

    // PasswordResetPageContentが表示されていることを確認
    expect(screen.getByTestId('mocked-password-reset-content')).toBeInTheDocument();
  });

  it('PasswordResetPageContentが1回だけレンダリングされること', () => {
    render(<PasswordResetPage />);

    // PasswordResetPageContentコンポーネントが1回だけ呼び出されたことを確認
    expect(PasswordResetPageContent).toHaveBeenCalledTimes(1);
  });

  it('ページのメタデータが正しく設定されていること', () => {
    expect(metadata.title).toBe('パスワードリセット');
  });
});
