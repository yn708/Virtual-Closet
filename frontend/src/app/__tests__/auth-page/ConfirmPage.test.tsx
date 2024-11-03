import ConfirmPage, { metadata } from '@/app/auth/confirm/page';
import { render, screen } from '@testing-library/react';

// モックの定義
jest.mock('@/features/auth/components/elements/content/ConfirmContent', () => ({
  __esModule: true,
  default: () => <div data-testid="confirm-content">Mocked Confirm Content</div>,
}));

describe('ConfirmPage', () => {
  describe('レンダリングテスト', () => {
    it('ConfirmContentコンポーネントが正しくレンダリングされること', () => {
      render(<ConfirmPage />);
      expect(screen.getByTestId('confirm-content')).toBeInTheDocument();
    });
  });

  describe('メタデータテスト', () => {
    it('ページのメタデータが正しく設定されていること', () => {
      expect(metadata.title).toBe('認証コード確認');
    });
  });
});
