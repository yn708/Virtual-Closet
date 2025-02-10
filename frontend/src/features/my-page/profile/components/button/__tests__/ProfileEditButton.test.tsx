import { useIsOpen } from '@/hooks/utils/useIsOpen';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProfileEditButton from '../ProfileEditButton';

jest.mock('@/hooks/utils/useIsOpen');
jest.mock('../../form/UserProfileForm', () => {
  return jest.fn(({ onSuccess }: { onSuccess: () => void }) => (
    <div data-testid="mock-profile-form">
      <button onClick={onSuccess} data-testid="mock-submit-button">
        Submit Form
      </button>
    </div>
  ));
});

// テスト用のユーザーデータ
const mockUserDetail = {
  userDetail: {
    name: 'Test User',
  },
};

describe('ProfileEditButton', () => {
  const user = userEvent.setup();

  // useIsOpenフックのモック値
  const mockUseIsOpen = {
    isOpen: false,
    onClose: jest.fn(),
    onToggle: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useIsOpen as jest.Mock).mockReturnValue(mockUseIsOpen);
  });

  // 基本的なレンダリングテスト
  it('renders profile edit button correctly', () => {
    render(<ProfileEditButton {...mockUserDetail} />);

    const button = screen.getByText('プロフィール編集');
    expect(button).toBeInTheDocument();
    expect(button.closest('button')).toHaveClass('w-full', 'max-w', 'mx-auto', 'text-sm');
  });

  // ダイアログの開閉テスト
  it('opens dialog when button is clicked', async () => {
    // モックの状態を設定
    const mockUseIsOpenWithDialog = {
      isOpen: false,
      onClose: jest.fn(),
      onToggle: jest.fn().mockImplementation(function () {
        mockUseIsOpenWithDialog.isOpen = true;
        render(<ProfileEditButton {...mockUserDetail} />);
      }),
    };
    (useIsOpen as jest.Mock).mockReturnValue(mockUseIsOpenWithDialog);

    render(<ProfileEditButton {...mockUserDetail} />);

    const button = screen.getByText('プロフィール編集');
    await user.click(button);

    // ダイアログが開かれたことを確認
    expect(mockUseIsOpenWithDialog.onToggle).toHaveBeenCalled();
    await waitFor(() => {
      expect(screen.getByTestId('mock-profile-form')).toBeInTheDocument();
    });
  });

  // アクセシビリティテスト
  describe('accessibility', () => {
    it('has proper button attributes', () => {
      render(<ProfileEditButton {...mockUserDetail} />);

      const button = screen.getByText('プロフィール編集');
      expect(button.closest('button')).toHaveAttribute('type', 'button');
    });

    it('maintains proper dialog structure when open', () => {
      const mockUseIsOpenWithOpen = {
        isOpen: true,
        onClose: jest.fn(),
        onToggle: jest.fn(),
      };
      (useIsOpen as jest.Mock).mockReturnValue(mockUseIsOpenWithOpen);

      render(<ProfileEditButton {...mockUserDetail} />);

      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByTestId('mock-profile-form')).toBeInTheDocument();
    });
  });

  // スタイリングテスト
  describe('styling', () => {
    it('applies correct button styles', () => {
      render(<ProfileEditButton {...mockUserDetail} />);

      const button = screen.getByText('プロフィール編集');
      expect(button.closest('button')).toHaveClass('w-full', 'max-w', 'mx-auto', 'text-sm');
    });

    it('applies correct dialog content styles', () => {
      const mockUseIsOpenWithOpen = {
        isOpen: true,
        onClose: jest.fn(),
        onToggle: jest.fn(),
      };
      (useIsOpen as jest.Mock).mockReturnValue(mockUseIsOpenWithOpen);

      render(<ProfileEditButton {...mockUserDetail} />);

      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveClass('max-w-[800px]');
    });
  });
});
