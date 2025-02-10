/**
 * @jest-environment jsdom
 */
import { TUTORIAL_STEPS } from '@/utils/data/info';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import WelcomeAlert from '../WelcomeAlert';

// 必要なモジュールのモック
jest.mock('next-auth/react');
jest.mock('next/navigation');
jest.mock('@/components/ui/dialog', () => ({
  Dialog: ({ children, open }: { children: React.ReactNode; open: boolean }) =>
    open ? <div data-testid="dialog">{children}</div> : null,
  DialogContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dialog-content">{children}</div>
  ),
  DialogFooter: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dialog-footer">{children}</div>
  ),
}));

jest.mock('@/components/ui/button', () => ({
  Button: ({
    children,
    onClick,
    disabled,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
  }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      data-testid={`button-${children?.toString().toLowerCase()}`}
    >
      {children}
    </button>
  ),
}));

describe('WelcomeAlert', () => {
  // モック関数とデフォルト値の設定
  const mockUpdateSession = jest.fn();
  const mockRouterRefresh = jest.fn();
  const mockSession = {
    user: {
      isNewUser: true,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // useSession のモック実装
    (useSession as jest.Mock).mockReturnValue({
      data: mockSession,
      update: mockUpdateSession,
    });

    // useRouter のモック実装
    (useRouter as jest.Mock).mockReturnValue({
      refresh: mockRouterRefresh,
    });
  });

  it('新規ユーザーの場合、ダイアログが表示されること', () => {
    render(<WelcomeAlert />);
    expect(screen.getByTestId('dialog')).toBeInTheDocument();
    expect(screen.getByText(TUTORIAL_STEPS[0].title)).toBeInTheDocument();
  });

  it('既存ユーザーの場合、ダイアログが表示されないこと', () => {
    (useSession as jest.Mock).mockReturnValue({
      data: { user: { isNewUser: false } },
      update: mockUpdateSession,
    });

    render(<WelcomeAlert />);
    expect(screen.queryByTestId('dialog')).not.toBeInTheDocument();
  });

  describe('ナビゲーション機能のテスト', () => {
    it('次へボタンクリックで次のステップに進むこと', () => {
      render(<WelcomeAlert />);

      fireEvent.click(screen.getByTestId('button-次へ'));
      expect(screen.getByText(TUTORIAL_STEPS[1].title)).toBeInTheDocument();
    });

    it('戻るボタンが最初のステップでは無効化されていること', () => {
      render(<WelcomeAlert />);

      const backButton = screen.getByTestId('button-戻る');
      expect(backButton).toBeDisabled();
    });

    it('戻るボタンクリックで前のステップに戻ること', () => {
      render(<WelcomeAlert />);

      // 次のステップに進む
      fireEvent.click(screen.getByTestId('button-次へ'));
      expect(screen.getByText(TUTORIAL_STEPS[1].title)).toBeInTheDocument();

      // 前のステップに戻る
      fireEvent.click(screen.getByTestId('button-戻る'));
      expect(screen.getByText(TUTORIAL_STEPS[0].title)).toBeInTheDocument();
    });
  });

  describe('チュートリアル完了処理のテスト', () => {
    it('最後のステップで始めるボタンをクリックするとセッションが更新されること', async () => {
      render(<WelcomeAlert />);

      // 最後のステップまで進む
      for (let i = 0; i < TUTORIAL_STEPS.length - 1; i++) {
        fireEvent.click(screen.getByTestId('button-次へ'));
      }

      fireEvent.click(screen.getByTestId('button-始める'));

      await waitFor(() => {
        expect(mockUpdateSession).toHaveBeenCalledWith({
          user: { ...mockSession.user, isNewUser: false },
        });
        expect(mockRouterRefresh).toHaveBeenCalled();
      });
    });

    it('スキップボタンクリックでチュートリアルが完了すること', async () => {
      render(<WelcomeAlert />);

      fireEvent.click(screen.getByTestId('button-スキップ'));

      await waitFor(() => {
        expect(mockUpdateSession).toHaveBeenCalledWith({
          user: { ...mockSession.user, isNewUser: false },
        });
        expect(mockRouterRefresh).toHaveBeenCalled();
      });
    });

    it('エラー発生時にconsole.errorが呼ばれること', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      const error = new Error('Update failed');
      mockUpdateSession.mockRejectedValueOnce(error);

      render(<WelcomeAlert />);
      fireEvent.click(screen.getByTestId('button-スキップ'));

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith('Error updating session:', error);
      });

      consoleErrorSpy.mockRestore();
    });
  });

  describe('進捗インジケータのテスト', () => {
    it('現在のステップに対応するインジケータがアクティブになること', () => {
      render(<WelcomeAlert />);

      // data-testidを使用して要素を取得
      TUTORIAL_STEPS.forEach((_, index) => {
        const indicator = screen.getByTestId(`step-indicator-${index}`);
        if (index === 0) {
          expect(indicator.className).toContain('bg-blue-600');
          expect(indicator.className).toContain(
            'h-1.5 rounded-full transition-all duration-300 bg-blue-600 w-6',
          );
        } else {
          expect(indicator.className).toContain('bg-gray-200');
          expect(indicator.className).toContain('w-1.5');
        }
      });

      // 次のステップに進む
      fireEvent.click(screen.getByTestId('button-次へ'));

      // インジケータの状態が更新されていることを確認
      expect(screen.getByTestId('step-indicator-0').className).toContain('bg-gray-200');
      expect(screen.getByTestId('step-indicator-1').className).toContain('bg-blue-600');
    });

    it('全てのステップを通じてインジケータが正しく更新されること', () => {
      render(<WelcomeAlert />);

      // 全ステップを順番に進む
      for (let i = 0; i < TUTORIAL_STEPS.length - 1; i++) {
        const currentIndicator = screen.getByTestId(`step-indicator-${i}`);
        expect(currentIndicator.className).toContain('bg-blue-600');

        fireEvent.click(screen.getByTestId('button-次へ'));

        // 進んだ後の状態を確認
        expect(currentIndicator.className).toContain('bg-gray-200');
        expect(screen.getByTestId(`step-indicator-${i + 1}`).className).toContain('bg-blue-600');
      }
    });
  });
});
