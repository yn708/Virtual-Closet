import { useProfileImage } from '@/features/my-page/hooks/useProfileImage';
import type { ProfileImageFieldProps } from '@/features/my-page/types';
import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import ProfileImageField from '../ProfileImageField';

// useProfileImageのデフォルト戻り値を定義
const defaultMockUseProfileImage = {
  dialogState: {
    isOpen: false,
    onClose: jest.fn(),
  },
  isProcessing: false,
  imageToEdit: null,
  currentPreviewImage: '/test-image.jpg',
  preview: null,
};

// useProfileImageのモック化
jest.mock('../../../hooks/useProfileImage', () => ({
  useProfileImage: jest.fn(),
}));

// ResizeObserverのモック
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}
global.ResizeObserver = ResizeObserverMock;

// 依存コンポーネントのモック
jest.mock('@/components/elements/form/input/HiddenFileInput', () => ({
  __esModule: true,
  default: ({
    onChange,
    name,
  }: {
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    name: string;
  }) => <input type="file" data-testid="file-input" name={name} onChange={onChange} />,
}));

jest.mock('@/components/elements/loading/LoadingElements', () => ({
  __esModule: true,
  default: ({ message }: { message: string }) => <div data-testid="loading">{message}</div>,
}));

jest.mock('@/components/elements/utils/ProfileAvatar', () => ({
  __esModule: true,
  default: ({ src, alt, size }: { src: string; alt: string; size: string }) => (
    <img data-testid="profile-avatar" src={src} alt={alt} className={size} />
  ),
}));

jest.mock('../../dialog/ImageCropDialog', () => ({
  __esModule: true,
  default: ({
    open,
    onCropComplete,
  }: {
    open: boolean;
    onClose: () => void;
    image: string;
    onCropComplete: (croppedImage: File) => void;
  }) => (
    <div data-testid="crop-dialog" className={open ? 'visible' : 'hidden'}>
      <button
        onClick={() => onCropComplete(new File([], 'cropped.jpg'))}
        data-testid="crop-complete"
      >
        Crop Complete
      </button>
    </div>
  ),
}));

jest.mock('../../dropdown-menu/ProfileImageDropdownMenu', () => ({
  __esModule: true,
  default: ({
    onDeleteImage,
  }: {
    onDeleteImage: () => void;
    hasImage: boolean;
    hasPreview: boolean;
  }) => (
    <button onClick={onDeleteImage} data-testid="delete-button">
      Delete Image
    </button>
  ),
}));

describe('ProfileImageField', () => {
  const mockProfileImage = '/test-image.jpg';
  const mockOnDelete = jest.fn();
  const mockState = {
    errors: {},
    message: '',
  };

  const defaultProps: ProfileImageFieldProps = {
    state: mockState,
    profileImage: mockProfileImage,
    onDelete: mockOnDelete,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useProfileImage as jest.Mock).mockReturnValue(defaultMockUseProfileImage);
  });

  // ProfileImageFieldが正しくレンダリングされるかを確認するテスト
  it('renders profile image field correctly', () => {
    render(<ProfileImageField {...defaultProps} />);

    expect(screen.getByTestId('file-input')).toBeInTheDocument();
    expect(screen.getByTestId('profile-avatar')).toBeInTheDocument();
  });

  // 処理中の状態が正しく表示されるかを確認するテスト
  it('shows loading state when processing', () => {
    (useProfileImage as jest.Mock).mockReturnValue({
      ...defaultMockUseProfileImage,
      isProcessing: true,
    });

    render(<ProfileImageField {...defaultProps} />);

    expect(screen.getByTestId('loading')).toBeInTheDocument();
    expect(screen.getByText('画像を処理中...')).toBeInTheDocument();
  });

  // ファイル選択時に正しくハンドリングされるかを確認するテスト
  it('handles file selection', async () => {
    const handleFileSelect = jest.fn();
    (useProfileImage as jest.Mock).mockReturnValue({
      ...defaultMockUseProfileImage,
      handleFileSelect,
    });

    render(<ProfileImageField {...defaultProps} />);

    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const fileInput = screen.getByTestId('file-input');

    await waitFor(() => {
      fireEvent.change(fileInput, { target: { files: [file] } });
    });

    expect(handleFileSelect).toHaveBeenCalled();
  });

  // 編集中の画像がある場合にクロップダイアログが正しく表示されるかを確認するテスト
  it('shows crop dialog when image is being edited', () => {
    (useProfileImage as jest.Mock).mockReturnValue({
      ...defaultMockUseProfileImage,
      imageToEdit: 'test-image-data',
      dialogState: {
        isOpen: true,
        onClose: jest.fn(),
      },
    });

    render(<ProfileImageField {...defaultProps} />);

    expect(screen.getByTestId('crop-dialog')).toHaveClass('visible');
  });

  // エラーメッセージが正しく表示されるかを確認するテスト
  it('displays error message when there are errors', () => {
    const errorMessage = 'Invalid image format';
    const propsWithError = {
      ...defaultProps,
      state: {
        errors: {
          profile_image: [errorMessage],
        },
        message: '',
      },
    };
    render(<ProfileImageField {...propsWithError} />);

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  // 画像削除のハンドリングが正しく動作するかを確認するテスト
  it('handles image deletion', async () => {
    const handleDelete = jest.fn();
    (useProfileImage as jest.Mock).mockReturnValue({
      ...defaultMockUseProfileImage,
      handleDelete,
    });

    render(<ProfileImageField {...defaultProps} />);

    const deleteButton = screen.getByTestId('delete-button');
    fireEvent.click(deleteButton);

    expect(handleDelete).toHaveBeenCalled();
  });

  // プレビューのクリア処理が正しく動作するかを確認するテスト
  it('handles preview clearing', async () => {
    const handleClear = jest.fn();
    (useProfileImage as jest.Mock).mockReturnValue({
      ...defaultMockUseProfileImage,
      preview: 'preview-image',
      handleClear,
    });

    render(<ProfileImageField {...defaultProps} />);

    const deleteButton = screen.getByTestId('delete-button');
    fireEvent.click(deleteButton);

    expect(handleClear).toHaveBeenCalled();
  });
});
