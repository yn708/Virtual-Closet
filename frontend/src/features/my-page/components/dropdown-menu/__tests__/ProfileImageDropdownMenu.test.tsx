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

// テスト用の共通props
const mockProps = {
  onSelectImage: jest.fn(),
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
    // 編集ボタンが表示されることを確認
    it('should render edit button correctly', () => {
      render(<ProfileImageDropdownMenu {...mockProps} />);

      const editButton = screen.getByRole('button', { name: 'アップロード' });
      expect(editButton).toBeInTheDocument();
      expect(screen.getByTestId('mock-edit-icon')).toBeInTheDocument();
    });

    // 初期状態でドロップダウンが閉じていることを確認
    it('should start with dropdown menu closed', () => {
      render(<ProfileImageDropdownMenu {...mockProps} />);

      expect(screen.queryByText('カメラロールから選択')).not.toBeInTheDocument();
    });
  });

  // ドロップダウンの操作テスト
  describe('Dropdown Operations', () => {
    // 編集ボタンクリックでメニューが開くことを確認
    it('should open dropdown menu when edit button is clicked', async () => {
      render(<ProfileImageDropdownMenu {...mockProps} />);

      const editButton = screen.getByRole('button', { name: 'アップロード' });
      await userEvent.click(editButton);

      expect(screen.getByText('カメラロールから選択')).toBeInTheDocument();
    });

    // 画像選択メニューをクリックしたときのコールバック確認
    it('should call onSelectImage when select image option is clicked', async () => {
      render(<ProfileImageDropdownMenu {...mockProps} />);

      const editButton = screen.getByRole('button', { name: 'アップロード' });
      await userEvent.click(editButton);

      const selectButton = screen.getByText('カメラロールから選択');
      await userEvent.click(selectButton);

      expect(mockProps.onSelectImage).toHaveBeenCalledTimes(1);
    });
  });

  // 削除オプションの表示制御テスト
  describe('Delete Option Display Control', () => {
    // hasImage=false, hasPreview=falseの場合の表示確認
    it('should not show delete option when hasImage and hasPreview are false', async () => {
      render(<ProfileImageDropdownMenu {...mockProps} />);

      const editButton = screen.getByRole('button', { name: 'アップロード' });
      await userEvent.click(editButton);

      expect(screen.queryByText('削除')).not.toBeInTheDocument();
      expect(screen.queryByText('選択取り消し')).not.toBeInTheDocument();
    });

    // プレビュー時の選択取り消しオプション表示確認
    it('should show cancel selection option when hasPreview is true', async () => {
      render(<ProfileImageDropdownMenu {...mockProps} hasPreview={true} />);

      const editButton = screen.getByRole('button', { name: 'アップロード' });
      await userEvent.click(editButton);

      expect(screen.getByText('選択取り消し')).toBeInTheDocument();
    });

    // 画像がある場合の削除オプション表示確認
    it('should show delete option when hasImage is true', async () => {
      render(<ProfileImageDropdownMenu {...mockProps} hasImage={true} />);

      const editButton = screen.getByRole('button', { name: 'アップロード' });
      await userEvent.click(editButton);

      expect(screen.getByText('削除')).toBeInTheDocument();
    });

    // 削除オプションクリック時のコールバック確認
    it('should call onDeleteImage when delete option is clicked', async () => {
      render(<ProfileImageDropdownMenu {...mockProps} hasImage={true} />);

      const editButton = screen.getByRole('button', { name: 'アップロード' });
      await userEvent.click(editButton);

      const deleteButton = screen.getByText('削除');
      await userEvent.click(deleteButton);

      expect(mockProps.onDeleteImage).toHaveBeenCalledTimes(1);
    });
  });
});
