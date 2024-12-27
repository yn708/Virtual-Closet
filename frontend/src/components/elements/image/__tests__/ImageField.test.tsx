import { useImageField } from '@/features/fashion-items/hooks/useImageField';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import ImageField from '../ImageField';

// モックの設定
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: { src: string; alt: string }): JSX.Element => {
    return <img alt={alt} src={src.toString()} {...props} />;
  },
}));

// 子コンポーネントのモック
jest.mock('@/components/elements/image/ImageUploadArea', () => {
  return function MockImageUploadArea() {
    return <div data-testid="image-upload-area">クリックして画像をアップロード</div>;
  };
});

jest.mock('@/components/elements/image/ImagePreview', () => ({
  ImagePreview: ({ src, isShowingRemovedBg }: { src: string; isShowingRemovedBg: boolean }) => (
    <div data-testid="image-preview">
      <img src={src} alt="preview" />
      {isShowingRemovedBg && <span>背景削除表示中</span>}
    </div>
  ),
}));

jest.mock('@/features/fashion-items/hooks/useImageField', () => ({
  useImageField: jest.fn(),
}));

describe('ImageField', () => {
  const mockFileInputRef = { current: null };
  const mockHandleFileSelect = jest.fn();
  const mockHandleChangeClick = jest.fn();
  const mockHandleToggleImage = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useImageField as jest.Mock).mockReturnValue({
      fileInputRef: mockFileInputRef,
      handleFileSelect: mockHandleFileSelect,
      handleChangeClick: mockHandleChangeClick,
      handleToggleImage: mockHandleToggleImage,
      isShowingRemovedBg: false,
    });
  });

  it('プレビューがない場合、アップロードエリアが表示されること', () => {
    const { container } = render(<ImageField />);

    expect(screen.getByTestId('image-upload-area')).toBeInTheDocument();
    const input = container.querySelector('input[type="file"]');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('accept', 'image/jpeg,image/png,image/gif,image/heic');
    expect(input).toHaveClass('hidden');
  });

  it('isProcessingがtrueの場合、ローディング表示がされること', () => {
    render(<ImageField isProcessing={true} />);
    expect(screen.getByText('画像処理中...')).toBeInTheDocument();
  });

  it('プレビューがある場合、ImagePreviewが表示されること', () => {
    const previewUrl = '/images/test.jpg';
    render(<ImageField preview={previewUrl} />);

    expect(screen.getByTestId('image-preview')).toBeInTheDocument();
    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', previewUrl);
  });

  it('背景削除表示の切り替えが正しく動作すること', () => {
    (useImageField as jest.Mock).mockReturnValue({
      fileInputRef: mockFileInputRef,
      handleFileSelect: mockHandleFileSelect,
      handleChangeClick: mockHandleChangeClick,
      handleToggleImage: mockHandleToggleImage,
      isShowingRemovedBg: true,
    });

    const previewUrl = '/images/test.jpg';
    render(<ImageField preview={previewUrl} />);

    expect(screen.getByText('背景削除表示中')).toBeInTheDocument();
  });

  it('ファイル選択時にhandleFileSelectが呼ばれること', () => {
    const { container } = render(<ImageField />);
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    expect(input).toBeInTheDocument();

    const file = new File(['test'], 'test.png', { type: 'image/png' });
    fireEvent.change(input, { target: { files: [file] } });

    expect(mockHandleFileSelect).toHaveBeenCalled();
  });

  it('プレビュー表示時に各アクションが正しく動作すること', () => {
    render(<ImageField preview="/images/test.jpg" />);

    // 画像変更ボタンのテスト
    const changeButton = screen.getByRole('button', { name: '画像変更' });
    fireEvent.click(changeButton);
    expect(mockHandleChangeClick).toHaveBeenCalled();

    // 背景除去チェックボックスのテスト
    const toggleCheckbox = screen.getByRole('checkbox', { name: '背景除去' });
    fireEvent.click(toggleCheckbox);
    expect(mockHandleToggleImage).toHaveBeenCalled();
  });

  it('エラーメッセージが表示されること', () => {
    const errorMessage = ['エラーが発生しました'];
    render(<ImageField error={errorMessage} />);

    expect(screen.getByText(errorMessage[0])).toBeInTheDocument();
    expect(screen.getByText(errorMessage[0])).toHaveClass('text-destructive');
  });

  it('処理中は各アクションが無効化されること', () => {
    render(<ImageField preview="/images/test.jpg" isProcessing={true} />);

    const changeButton = screen.getByRole('button', { name: '画像変更' });
    const toggleCheckbox = screen.getByRole('checkbox', { name: '背景除去' });

    expect(changeButton).toBeDisabled();
    expect(toggleCheckbox).toBeDisabled();
    expect(toggleCheckbox.parentElement).toHaveClass('cursor-not-allowed');
  });
});
