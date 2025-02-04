import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { useProfileImage } from '../../../hooks/useProfileImage';
import ProfileImageField from '../ProfileImageField';

// mock modules
jest.mock('@/components/elements/image/ImageCropContests', () => {
  const ImageCropContents = ({ children, ...props }: { children: React.ReactNode }) => (
    <div data-testid="image-crop-contents" {...props}>
      {children}
    </div>
  );
  ImageCropContents.displayName = 'ImageCropContents';
  return ImageCropContents;
});

jest.mock('@/components/elements/utils/ProfileAvatar', () => {
  const ProfileAvatar = ({ src, alt, size }: { src: string; alt: string; size: string }) => (
    <div data-testid="profile-avatar" data-src={src} data-alt={alt} data-size={size} />
  );
  ProfileAvatar.displayName = 'ProfileAvatar';
  return ProfileAvatar;
});

jest.mock('../../dropdown-menu/ProfileImageDropdownMenu', () => {
  const ProfileImageDropdownMenu = ({
    onDeleteImage,
  }: {
    onDeleteImage: () => void;
    hasImage: boolean;
    hasPreview: boolean;
  }) => (
    <div data-testid="profile-image-dropdown-menu">
      {onDeleteImage && <button onClick={onDeleteImage}>Delete</button>}
    </div>
  );
  ProfileImageDropdownMenu.displayName = 'ProfileImageDropdownMenu';
  return ProfileImageDropdownMenu;
});

// モックの設定
const mockUpdateFileInput = jest.fn();
const mockHandleDelete = jest.fn();
const mockHandleClear = jest.fn();

jest.mock('../../../hooks/useProfileImage', () => ({
  useProfileImage: jest.fn(() => ({
    currentPreviewImage: 'test-image.jpg',
    preview: null,
    updateFileInput: mockUpdateFileInput,
    handleDelete: mockHandleDelete,
    handleClear: mockHandleClear,
  })),
}));

describe('ProfileImageField', () => {
  // FormState型に合わせて修正したデフォルトprops
  const defaultProps = {
    state: {
      errors: {} as Record<string, string[]>,
      message: '',
    },
    profileImage: 'profile.jpg',
    onDelete: jest.fn(),
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders ProfileAvatar with correct src, alt and size', () => {
    render(<ProfileImageField {...defaultProps} />);
    const avatar = screen.getByTestId('profile-avatar');
    expect(avatar).toHaveAttribute('data-src', 'test-image.jpg');
    expect(avatar).toHaveAttribute('data-alt', 'プロフィール画像');
    expect(avatar).toHaveAttribute('data-size', 'sm');
  });

  it('passes handleDelete when preview is falsy', () => {
    render(<ProfileImageField {...defaultProps} />);
    const button = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(button);
    expect(mockHandleDelete).toHaveBeenCalled();
    expect(mockHandleClear).not.toHaveBeenCalled();
  });

  it('passes handleClear when preview is truthy', () => {
    // useProfileImageのモック返却値を上書き
    (useProfileImage as jest.Mock).mockReturnValueOnce({
      currentPreviewImage: 'test-image.jpg',
      preview: 'preview-image.jpg',
      updateFileInput: mockUpdateFileInput,
      handleDelete: mockHandleDelete,
      handleClear: mockHandleClear,
    });

    render(<ProfileImageField {...defaultProps} />);
    const button = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(button);
    expect(mockHandleClear).toHaveBeenCalled();
    expect(mockHandleDelete).not.toHaveBeenCalled();
  });

  it('renders error message if state.errors.profile_image exists', () => {
    const errorState = {
      errors: {
        profile_image: ['エラーが発生しました'],
      } as Record<string, string[]>,
      message: '',
    };
    render(<ProfileImageField {...defaultProps} state={errorState} />);
    expect(screen.getByText('エラーが発生しました')).toBeInTheDocument();
  });

  it('renders children within ImageCropContents', () => {
    render(<ProfileImageField {...defaultProps} />);
    expect(screen.getByTestId('image-crop-contents')).toBeInTheDocument();
  });
});
