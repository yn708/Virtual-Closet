import { ITEM_EDIT_URL } from '@/utils/constants';
import { render, screen } from '@testing-library/react';
import { IoMdAdd } from 'react-icons/io';
import { AddItemSection } from '../AddItemSection';
import { ImageUploadSection } from '../ImageUploadSection';

// ImageUploadSectionコンポーネントのモック
jest.mock('../ImageUploadSection', () => ({
  ImageUploadSection: jest.fn(({ value, label, Icon, redirectUrl, onClose }) => (
    <div data-testid="image-upload-section">
      <div data-testid="value">{value}</div>
      <div data-testid="label">{label}</div>
      <div data-testid="icon">{Icon ? <Icon data-testid="icon-component" /> : null}</div>
      <div data-testid="redirect-url">{redirectUrl}</div>
      <button data-testid="close-button" onClick={onClose}>
        Close
      </button>
    </div>
  )),
}));

describe('AddItemSection', () => {
  // テスト用のモック関数
  const mockOnClose = jest.fn();

  beforeEach(() => {
    // 各テスト前にモックをリセット
    jest.clearAllMocks();
  });

  // 基本的なレンダリングテスト
  it('renders ImageUploadSection with correct props', () => {
    render(<AddItemSection onClose={mockOnClose} />);

    // ImageUploadSectionが存在することを確認
    expect(screen.getByTestId('image-upload-section')).toBeInTheDocument();

    // 各プロパティが正しく渡されているか確認
    expect(screen.getByTestId('value')).toHaveTextContent('add-clothing');
    expect(screen.getByTestId('label')).toHaveTextContent('アイテム追加');
    expect(screen.getByTestId('icon-component')).toBeInTheDocument();
    expect(screen.getByTestId('redirect-url')).toHaveTextContent(ITEM_EDIT_URL);
  });

  // onClose関数のテスト
  it('passes onClose function to ImageUploadSection', () => {
    render(<AddItemSection onClose={mockOnClose} />);

    // Close ボタンをクリック
    const closeButton = screen.getByTestId('close-button');
    closeButton.click();

    // onClose関数が呼び出されたことを確認
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  // ImageUploadSectionに渡されるpropsの型チェック
  it('passes correct prop types to ImageUploadSection', () => {
    render(<AddItemSection onClose={mockOnClose} />);

    // ImageUploadSectionコンポーネントに渡されたpropsを確認
    expect(ImageUploadSection).toHaveBeenCalledWith(
      {
        value: 'add-clothing',
        label: 'アイテム追加',
        Icon: IoMdAdd,
        redirectUrl: ITEM_EDIT_URL,
        onClose: mockOnClose,
      },
      expect.any(Object), // Reactの内部props用
    );
  });

  // リダイレクトURLの検証
  it('passes correct redirect URL', () => {
    render(<AddItemSection onClose={mockOnClose} />);

    const redirectUrlElement = screen.getByTestId('redirect-url');
    expect(redirectUrlElement.textContent).toBe(ITEM_EDIT_URL);
  });

  // アイコンコンポーネントの検証
  it('uses IoMdAdd icon component', () => {
    render(<AddItemSection onClose={mockOnClose} />);

    // アイコンコンポーネントが存在することを確認
    const iconComponent = screen.getByTestId('icon-component');
    expect(iconComponent).toBeInTheDocument();
  });
});
