import { useImageField } from '@/features/fashion-items/hooks/useImageField';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import ImageField from '../ImageField';

interface ImageProps {
  src: string;
  alt: string;
}

// next/imageのモック
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: ImageProps): JSX.Element => {
    return <img alt={alt} src={src.toString()} {...props} />;
  },
}));

// useImageFieldのモック
jest.mock('@/features/fashion-items/hooks/useImageField', () => ({
  useImageField: jest.fn(),
}));

describe('ImageField', () => {
  const mockFileInputRef = { current: null };
  const mockHandleFileSelect = jest.fn();
  const mockHandleChangeClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useImageField as jest.Mock).mockReturnValue({
      fileInputRef: mockFileInputRef,
      handleFileSelect: mockHandleFileSelect,
      handleChangeClick: mockHandleChangeClick,
    });
  });

  it('プレビューがない場合、アップロードエリアが表示されること', () => {
    render(<ImageField />);
    expect(screen.getByText('クリックして画像をアップロード')).toBeInTheDocument();
    const input = document.querySelector('input[type="file"]');
    expect(input).toBeInTheDocument();
  });

  it('isProcessingがtrueの場合、ローディング表示がされること', () => {
    render(<ImageField isProcessing={true} />);
    expect(screen.getByText('画像処理中...')).toBeInTheDocument();
  });

  it('プレビューがある場合、ImagePreviewが表示されること', () => {
    const previewUrl = '/images/test.jpg';
    render(<ImageField preview={previewUrl} />);
    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', previewUrl);
  });

  it('ファイル選択時にhandleFileSelectが呼ばれること', () => {
    render(<ImageField />);
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    expect(input).toBeInTheDocument();

    const file = new File(['test'], 'test.png', { type: 'image/png' });
    fireEvent.change(input, { target: { files: [file] } });
    expect(mockHandleFileSelect).toHaveBeenCalled();
  });

  it('プレビュー表示時に変更ボタンをクリックするとhandleChangeClickが呼ばれること', () => {
    render(<ImageField preview="/images/test.jpg" />);
    const changeButton = screen.getByRole('button', { name: '変更' });

    fireEvent.click(changeButton);
    expect(mockHandleChangeClick).toHaveBeenCalled();
  });
});
