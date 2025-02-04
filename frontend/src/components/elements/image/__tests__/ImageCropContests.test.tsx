/**
 * @jest-environment jsdom
 */
import { useImageCropDisplay } from '@/hooks/image/useImageCropDisplay';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ImageCropContents from '../ImageCropContests';

jest.mock('next-auth/react', () => ({
  useSession: () => ({
    data: { user: { name: 'Test User' } },
    status: 'authenticated',
  }),
}));

jest.mock('@/lib/api/baseApi', () => ({
  baseFetch: jest.fn(),
}));
// useImageCropDisplay をモックする
jest.mock('@/hooks/image/useImageCropDisplay');

// HiddenFileInput のモック
jest.mock('../../form/input/HiddenFileInput', () => ({
  __esModule: true,
  default: jest.fn(({ onChange, ref, name }) => (
    <input type="file" data-testid="hidden-file-input" name={name} onChange={onChange} ref={ref} />
  )),
}));

// LoadingElements のモック
jest.mock('../../loading/LoadingElements', () => ({
  __esModule: true,
  default: jest.fn(({ message }) => <div data-testid="loading-elements">{message}</div>),
}));

// ImageCropDialog のモック
jest.mock('../../dialog/ImageCropDialog', () => ({
  __esModule: true,
  default: jest.fn((props) => (
    <div
      data-testid="image-crop-dialog"
      // onCropComplete をクリック時に呼ぶ形にして、テストでハンドラ呼び出しを確認できるようにする
      onClick={() => props.onCropComplete && props.onCropComplete(new File(['dummy'], 'dummy.png'))}
    >
      ImageCropDialog - open: {props.open ? 'true' : 'false'} image: {props.image}
    </div>
  )),
}));

describe('ImageCropContents', () => {
  // モック関数の定義
  const mockHandleFileSelect = jest.fn();
  const mockHandleCropComplete = jest.fn();
  const mockHandleCropClose = jest.fn();
  const mockOnToggle = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('常に HiddenFileInput がレンダリングされる', () => {
    (useImageCropDisplay as jest.Mock).mockReturnValue({
      isOpen: false,
      imageToEdit: null,
      processLoading: false,
      onToggle: mockOnToggle,
      handleFileSelect: mockHandleFileSelect,
      handleCropComplete: mockHandleCropComplete,
      handleCropClose: mockHandleCropClose,
    });
    render(<ImageCropContents name="test-input" />);
    expect(screen.getByTestId('hidden-file-input')).toBeInTheDocument();
  });

  test('processLoading が false の場合、children がレンダリングされる', () => {
    (useImageCropDisplay as jest.Mock).mockReturnValue({
      isOpen: false,
      imageToEdit: null,
      processLoading: false,
      onToggle: mockOnToggle,
      handleFileSelect: mockHandleFileSelect,
      handleCropComplete: mockHandleCropComplete,
      handleCropClose: mockHandleCropClose,
    });
    render(
      <ImageCropContents>
        <div data-testid="child-content">Child Content</div>
      </ImageCropContents>,
    );
    expect(screen.getByTestId('child-content')).toBeInTheDocument();
  });

  test('processLoading が true の場合、LoadingElements がレンダリングされ、メッセージに「画像処理中...」が含まれる', () => {
    (useImageCropDisplay as jest.Mock).mockReturnValue({
      isOpen: false,
      imageToEdit: null,
      processLoading: true,
      onToggle: mockOnToggle,
      handleFileSelect: mockHandleFileSelect,
      handleCropComplete: mockHandleCropComplete,
      handleCropClose: mockHandleCropClose,
    });
    render(<ImageCropContents />);
    const loadingEl = screen.getByTestId('loading-elements');
    expect(loadingEl).toHaveTextContent(/画像処理中/);
  });

  test('imageToEdit が存在する場合、ImageCropDialog がレンダリングされる', () => {
    (useImageCropDisplay as jest.Mock).mockReturnValue({
      isOpen: true,
      imageToEdit: 'test-image.jpg',
      processLoading: false,
      onToggle: mockOnToggle,
      handleFileSelect: mockHandleFileSelect,
      handleCropComplete: mockHandleCropComplete,
      handleCropClose: mockHandleCropClose,
    });
    render(<ImageCropContents />);
    const dialog = screen.getByTestId('image-crop-dialog');
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveTextContent('open: true');
    expect(dialog).toHaveTextContent('image: test-image.jpg');
  });

  test('HiddenFileInput の change イベントで handleFileSelect が呼ばれる', async () => {
    (useImageCropDisplay as jest.Mock).mockReturnValue({
      isOpen: false,
      imageToEdit: null,
      processLoading: false,
      onToggle: mockOnToggle,
      handleFileSelect: mockHandleFileSelect,
      handleCropComplete: mockHandleCropComplete,
      handleCropClose: mockHandleCropClose,
    });
    render(<ImageCropContents />);
    const fileInput = screen.getByTestId('hidden-file-input');
    const file = new File(['dummy content'], 'dummy.png', { type: 'image/png' });
    await userEvent.upload(fileInput, file);
    expect(mockHandleFileSelect).toHaveBeenCalled();
  });

  test('ImageCropDialog の onCropComplete 経由で handleCropComplete が呼ばれる', async () => {
    (useImageCropDisplay as jest.Mock).mockReturnValue({
      isOpen: true,
      imageToEdit: 'test-image.jpg',
      processLoading: false,
      onToggle: mockOnToggle,
      handleFileSelect: mockHandleFileSelect,
      handleCropComplete: mockHandleCropComplete,
      handleCropClose: mockHandleCropClose,
    });
    render(<ImageCropContents />);
    // ImageCropDialog の div をクリックすると、onCropComplete が呼ばれるモック実装となっている
    await userEvent.click(screen.getByTestId('image-crop-dialog'));
    expect(mockHandleCropComplete).toHaveBeenCalled();
  });
});
