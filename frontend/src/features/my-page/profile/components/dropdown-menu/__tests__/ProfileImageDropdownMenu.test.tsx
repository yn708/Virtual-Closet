import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProfileImageDropdownMenu from '../ProfileImageDropdownMenu';

// アイコンのモック
jest.mock('react-icons/md', () => ({
  MdEdit: () => <div data-testid="mock-edit-icon" />,
}));

jest.mock('react-icons/ai', () => ({
  AiOutlinePicture: () => <div data-testid="mock-picture-icon" />,
  AiFillDelete: () => <div data-testid="mock-delete-icon" />,
}));

// shadcn/uiコンポーネントのモック
jest.mock('@/components/ui/dropdown-menu', () => ({
  DropdownMenu: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dropdown-menu">{children}</div>
  ),
  DropdownMenuTrigger: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dropdown-trigger">{children}</div>
  ),
  DropdownMenuContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dropdown-content">{children}</div>
  ),
  DropdownMenuItem: ({
    children,
    onClick,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
  }) => (
    <div data-testid="dropdown-item" onClick={onClick}>
      {children}
    </div>
  ),
}));

// テスト用の共通props
const mockProps = {
  onDeleteImage: jest.fn(),
  hasImage: false,
  hasPreview: false,
};

describe('ProfileImageDropdownMenu', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // 基本的なレンダリングテスト
  describe('Basic Rendering', () => {
    it('should render with correct structure', () => {
      render(<ProfileImageDropdownMenu {...mockProps} />);

      expect(screen.getByTestId('dropdown-menu')).toBeInTheDocument();
      expect(screen.getByTestId('dropdown-trigger')).toBeInTheDocument();
      expect(screen.getByTestId('dropdown-content')).toBeInTheDocument();
      expect(screen.getByTestId('mock-edit-icon')).toBeInTheDocument();
    });

    it('should render upload button with correct attributes', () => {
      render(<ProfileImageDropdownMenu {...mockProps} />);

      const button = screen.getByRole('button', { name: 'アップロード' });
      expect(button).toBeInTheDocument();
      expect(button).toHaveClass(
        'absolute bottom-0 -right-2 bg-slate-50 dark:bg-slate-950 hover:bg-slate-200 dark:hover:bg-slate-700',
      );
    });

    it('should render camera roll selection option', () => {
      render(<ProfileImageDropdownMenu {...mockProps} />);

      const menuItem = screen.getByText('カメラロールから選択');
      expect(menuItem).toBeInTheDocument();
      expect(screen.getByTestId('mock-picture-icon')).toBeInTheDocument();
      expect(menuItem.closest('label')).toHaveAttribute('for', 'image-upload');
    });
  });

  // 削除オプションの表示制御テスト
  describe('Delete Option Display Control', () => {
    it('should not show delete option when hasImage and hasPreview are false', () => {
      render(<ProfileImageDropdownMenu {...mockProps} />);

      expect(screen.queryByText('削除')).not.toBeInTheDocument();
      expect(screen.queryByText('選択取り消し')).not.toBeInTheDocument();
    });

    it('should show "選択取り消し" option when hasPreview is true', () => {
      render(<ProfileImageDropdownMenu {...mockProps} hasPreview={true} />);

      const deleteOption = screen.getByText('選択取り消し');
      expect(deleteOption).toBeInTheDocument();
      expect(deleteOption).toHaveClass('text-red-500');
      expect(screen.getByTestId('mock-delete-icon')).toBeInTheDocument();
    });

    it('should show "削除" option when hasImage is true', () => {
      render(<ProfileImageDropdownMenu {...mockProps} hasImage={true} />);

      const deleteOption = screen.getByText('削除');
      expect(deleteOption).toBeInTheDocument();
      expect(deleteOption).toHaveClass('text-red-500');
      expect(screen.getByTestId('mock-delete-icon')).toBeInTheDocument();
    });

    it('should call onDeleteImage when delete option is clicked', async () => {
      render(<ProfileImageDropdownMenu {...mockProps} hasImage={true} />);

      const deleteButton = screen.getByText('削除');
      await userEvent.click(deleteButton);

      expect(mockProps.onDeleteImage).toHaveBeenCalledTimes(1);
    });

    it('should call onDeleteImage when cancel selection option is clicked', async () => {
      render(<ProfileImageDropdownMenu {...mockProps} hasPreview={true} />);

      const cancelButton = screen.getByText('選択取り消し');
      await userEvent.click(cancelButton);

      expect(mockProps.onDeleteImage).toHaveBeenCalledTimes(1);
    });
  });
});
