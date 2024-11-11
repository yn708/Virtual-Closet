import { useImage } from '@/context/ImageContext';
import { useImageSelection } from '@/hooks/image/useImageSelection';
import { useToast } from '@/hooks/use-toast';
import { BACKEND_URL } from '@/utils/constants';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ChangeEvent, ForwardedRef, forwardRef } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { useImageProcessing } from '../../../hooks/useImageProcessing';
import type { ProfileEditFormData } from '../../../types';
import ProfileImageFormField from '../ProfileImageFormField';

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}
global.ResizeObserver = ResizeObserverMock;

jest.mock('@/components/elements/form/HiddenFileInput', () => ({
  __esModule: true,
  default: forwardRef(
    (
      { onChange }: { onChange: (event: ChangeEvent<HTMLInputElement>) => void },
      ref: ForwardedRef<HTMLInputElement>,
    ) => <input type="file" data-testid="file-input" onChange={onChange} ref={ref} />,
  ),
}));

jest.mock('@/components/ui/form', () => ({
  FormField: ({ render }: any) => render({ field: { value: '', onChange: jest.fn() } }),
  FormItem: ({ children }: any) => <div>{children}</div>,
  FormControl: ({ children }: any) => <div>{children}</div>,
  FormMessage: () => null,
}));

jest.mock('@/context/ImageContext');
jest.mock('@/hooks/image/useImageSelection');
jest.mock('@/hooks/use-toast');
jest.mock('../../../hooks/useImageProcessing');
jest.mock('../../dialog/ImageCropDialog', () => ({
  __esModule: true,
  default: () => null,
}));

jest.mock('@/components/elements/utils/ProfileAvatar', () => ({
  __esModule: true,
  default: ({ src }: { src: string }) => (
    <img data-testid="profile-avatar" src={src} alt="avatar" />
  ),
}));

describe('ProfileImageFormField', () => {
  const mockForm = {
    control: {},
    setValue: jest.fn(),
  } as unknown as UseFormReturn<ProfileEditFormData>;

  const mockSetImage = jest.fn();
  const mockClearImage = jest.fn();
  const mockToast = jest.fn();
  const mockHandleFileInput = jest.fn();
  const mockHandleFileChange = jest.fn();
  const mockProcessImageFile = jest.fn();
  const mockCreateImagePreview = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useImage as jest.Mock).mockReturnValue({
      setImage: mockSetImage,
      preview: null,
      clearImage: mockClearImage,
    });

    (useImageSelection as jest.Mock).mockReturnValue({
      fileInputRef: { current: document.createElement('input') },
      handleFileInput: mockHandleFileInput,
      handleFileChange: mockHandleFileChange,
    });

    (useToast as jest.Mock).mockReturnValue({
      toast: mockToast,
    });

    (useImageProcessing as jest.Mock).mockReturnValue({
      processImageFile: mockProcessImageFile,
      createImagePreview: mockCreateImagePreview,
    });
  });

  // プロフィール画像フィールドがデフォルト状態で正しくレンダリングされることを確認
  it('renders profile image field with default state', () => {
    render(<ProfileImageFormField form={mockForm} />);
    expect(screen.getByTestId('profile-avatar')).toBeInTheDocument();
  });

  // プロフィール画像が提供された場合、バックエンドのURLと組み合わせて正しく表示されることを確認
  it('displays backend image URL when profile image is provided', () => {
    const profileImage = '/path/to/image.jpg';
    render(<ProfileImageFormField form={mockForm} profileImage={profileImage} />);

    const avatar = screen.getByTestId('profile-avatar');
    expect(avatar).toHaveAttribute('src', `${BACKEND_URL}${profileImage}`);
  });

  // ファイル選択時に適切な処理が行われ、画像のプレビューが生成されることを確認
  it('handles file selection and processing', async () => {
    const file = new File(['test'], 'test.png', { type: 'image/png' });
    mockHandleFileChange.mockResolvedValueOnce({ file });
    mockProcessImageFile.mockResolvedValueOnce(file);
    mockCreateImagePreview.mockResolvedValueOnce('data:image/png;base64,test');

    render(<ProfileImageFormField form={mockForm} />);

    const fileInput = screen.getByTestId('file-input');

    await waitFor(() => {
      fireEvent.change(fileInput, { target: { files: [file] } });
    });

    await waitFor(() => {
      expect(mockHandleFileChange).toHaveBeenCalled();
      expect(mockProcessImageFile).toHaveBeenCalledWith(file);
      expect(mockCreateImagePreview).toHaveBeenCalledWith(file);
    });
  });

  // ドロップダウンメニューからの画像削除が正しく機能することを確認
  it('handles deletion through dropdown menu', () => {
    const onDelete = jest.fn();
    render(<ProfileImageFormField form={mockForm} profileImage="/test.jpg" onDelete={onDelete} />);

    const handleDelete = () => {
      mockClearImage();
      mockForm.setValue('profile_image', null);
      onDelete();
    };

    handleDelete();

    expect(mockClearImage).toHaveBeenCalled();
    expect(mockForm.setValue).toHaveBeenCalledWith('profile_image', null);
    expect(onDelete).toHaveBeenCalled();
  });

  // 画像処理が失敗した場合にエラートーストが表示されることを確認
  it('displays error toast when image processing fails', async () => {
    mockHandleFileChange.mockRejectedValueOnce(new Error('Processing failed'));

    render(<ProfileImageFormField form={mockForm} />);

    const fileInput = screen.getByTestId('file-input');

    await waitFor(() => {
      fireEvent.change(fileInput, { target: { files: [new File([''], 'test.png')] } });
    });

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: 'エラー',
        description: '画像の処理中にエラーが発生しました',
        variant: 'destructive',
      });
    });
  });

  // 画像処理中のローディング状態が適切に表示されることを確認
  it('shows loading state during processing', () => {
    render(<ProfileImageFormField form={mockForm} />);

    const { rerender } = render(<ProfileImageFormField form={mockForm} profileImage="/test.jpg" />);

    rerender(<ProfileImageFormField form={mockForm} profileImage="/test.jpg" />);

    expect(screen.queryByText('画像を処理中...')).not.toBeInTheDocument();
  });
});
