/**
 * @jest-environment jsdom
 */
import { useImageField } from '@/features/fashion-items/hooks/useImageField';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ImageField from '../ImageField';

// NextAuth関連のモック
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(() => ({
    data: { user: { name: 'Test User' } },
    status: 'authenticated',
  })),
}));

// baseApiのモック
jest.mock('@/lib/api/baseApi', () => ({
  baseFetch: jest.fn(),
}));

// useImageFieldのモック
jest.mock('@/features/fashion-items/hooks/useImageField', () => ({
  useImageField: jest.fn(),
}));

// 子コンポーネントのモック
jest.mock('@/components/elements/form/input/HiddenFileInput', () => ({
  __esModule: true,
  default: jest.fn(({ onChange, ref }) => (
    <input type="file" onChange={onChange} ref={ref} data-testid="hidden-file-input" />
  )),
}));

jest.mock('@/components/elements/image/ImageUploadArea', () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="image-upload-area">Upload Area</div>),
}));

jest.mock('@/components/elements/image/ImagePreview', () => ({
  ImagePreview: jest.fn(({ src, isShowingRemovedBg }) => (
    <div data-testid="image-preview" data-src={src} data-showing-removed-bg={isShowingRemovedBg}>
      Preview
    </div>
  )),
}));

jest.mock('../ImageActions', () => ({
  __esModule: true,
  default: jest.fn(({ isProcessing, isShowingRemovedBg, onChangeClick, onToggleImage }) => (
    <div data-testid="image-actions">
      <button onClick={onChangeClick} disabled={isProcessing} data-testid="change-button">
        Change
      </button>
      <button
        onClick={onToggleImage}
        disabled={isProcessing}
        data-testid="toggle-button"
        data-showing-removed-bg={isShowingRemovedBg}
      >
        Toggle
      </button>
    </div>
  )),
}));

// ImageContextのモック
jest.mock('@/context/ImageContext', () => ({
  useImage: jest.fn(() => ({
    preview: null,
    setPreview: jest.fn(),
    removeBgProcess: jest.fn(),
  })),
  ImageProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('ImageField', () => {
  const mockFileInputRef = { current: null };
  const mockHandleFileSelect = jest.fn();
  const mockHandleChangeClick = jest.fn();
  const mockHandleToggleImage = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    // useImageFieldのモック実装を設定
    (useImageField as jest.Mock).mockReturnValue({
      fileInputRef: mockFileInputRef,
      handleFileSelect: mockHandleFileSelect,
      handleChangeClick: mockHandleChangeClick,
      handleToggleImage: mockHandleToggleImage,
      isShowingRemovedBg: false,
    });
  });

  it('プレビューがない場合、ImageUploadAreaを表示する', () => {
    render(<ImageField />);

    expect(screen.getByTestId('image-upload-area')).toBeInTheDocument();
    expect(screen.queryByTestId('image-preview')).not.toBeInTheDocument();
  });

  it('プレビューがある場合、ImagePreviewとImageActionsを表示する', () => {
    render(<ImageField preview="test-preview.jpg" />);

    expect(screen.queryByTestId('image-upload-area')).not.toBeInTheDocument();
    expect(screen.getByTestId('image-preview')).toBeInTheDocument();
    expect(screen.getByTestId('image-actions')).toBeInTheDocument();
  });

  it('処理中の場合、ローディング表示を行う', () => {
    render(<ImageField preview="test-preview.jpg" isProcessing={true} />);

    expect(screen.getByText('画像処理中...')).toBeInTheDocument();
  });

  it('エラーがある場合、エラーメッセージを表示する', () => {
    const errorMessage = ['テストエラー'];
    render(<ImageField error={errorMessage} />);

    expect(screen.getByText(errorMessage[0])).toBeInTheDocument();
  });

  it('ファイル選択時にhandleFileSelectが呼ばれる', async () => {
    const user = userEvent.setup();
    render(<ImageField />);

    const fileInput = screen.getByTestId('hidden-file-input');
    const file = new File(['test'], 'test.png', { type: 'image/png' });

    await user.upload(fileInput, file);

    expect(mockHandleFileSelect).toHaveBeenCalled();
  });

  it('画像変更ボタンクリック時にhandleChangeClickが呼ばれる', async () => {
    const user = userEvent.setup();
    render(<ImageField preview="test-preview.jpg" />);

    const changeButton = screen.getByTestId('change-button');
    await user.click(changeButton);

    expect(mockHandleChangeClick).toHaveBeenCalled();
  });

  it('処理中は画像アクションが無効化される', () => {
    render(<ImageField preview="test-preview.jpg" isProcessing={true} />);

    const changeButton = screen.getByTestId('change-button');
    const toggleButton = screen.getByTestId('toggle-button');

    expect(changeButton).toBeDisabled();
    expect(toggleButton).toBeDisabled();
  });

  it('背景除去の切り替えを反映する', () => {
    // useImageFieldのモック値を更新
    (useImageField as jest.Mock).mockReturnValue({
      fileInputRef: mockFileInputRef,
      handleFileSelect: mockHandleFileSelect,
      handleChangeClick: mockHandleChangeClick,
      handleToggleImage: mockHandleToggleImage,
      isShowingRemovedBg: true,
    });

    render(<ImageField preview="test-preview.jpg" />);

    const preview = screen.getByTestId('image-preview');
    expect(preview.getAttribute('data-showing-removed-bg')).toBe('true');
  });
});
