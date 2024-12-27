import IconLink from '@/components/elements/link/IconLink';
import { COORDINATE_CREATE_CANVAS_URL, COORDINATE_CREATE_URL } from '@/utils/constants';
import { fireEvent, render, screen } from '@testing-library/react';
import { BiCloset } from 'react-icons/bi';
import { MdOutlineSwipe } from 'react-icons/md';
import CreateOutfitSection from '../CreateOutfitSection';
import ImageUploadSection from '../ImageUploadSection';

// モックの設定
jest.mock('../ImageUploadSection', () => ({
  __esModule: true,
  default: jest.fn(({ children, value, label, Icon, redirectUrl, onClose }) => (
    <div data-testid="image-upload-section">
      <div data-testid="value">{value}</div>
      <div data-testid="label">{label}</div>
      {Icon && (
        <div data-testid="icon">
          <Icon data-testid="icon-component" />
        </div>
      )}
      <div data-testid="redirect-url">{redirectUrl}</div>
      <button data-testid="close-button" onClick={onClose}>
        Close
      </button>
      <div data-testid="children-content">{children}</div>
    </div>
  )),
}));

jest.mock('@/components/elements/link/IconLink', () => ({
  __esModule: true,
  default: jest.fn(({ href, Icon, label, onClick }) => (
    <a
      href={href}
      data-testid="icon-link"
      onClick={(e) => {
        e.preventDefault();
        onClick?.();
      }}
    >
      {Icon && <Icon data-testid="icon-link-icon" />}
      <span>{label}</span>
    </a>
  )),
}));

describe('CreateOutfitSection', () => {
  // モック関数：閉じる操作をシミュレート
  const mockOnClose = jest.fn();

  beforeEach(() => {
    // 各テストの前にモックをリセット
    jest.clearAllMocks();
  });

  it('renders with correct props and structure', () => {
    // コンポーネントをレンダリング
    render(<CreateOutfitSection onClose={mockOnClose} />);

    // ImageUploadSectionのプロパティ確認
    expect(screen.getByTestId('value')).toHaveTextContent('create-outfit'); // セクションの値
    expect(screen.getByTestId('label')).toHaveTextContent('コーディネート作成'); // セクションのラベル
    expect(screen.getByTestId('icon-component')).toBeInTheDocument(); // アイコンが存在するか
    expect(screen.getByTestId('redirect-url')).toHaveTextContent(COORDINATE_CREATE_URL); // リダイレクト先URL

    // IconLinkの確認
    const iconLink = screen.getByTestId('icon-link');
    expect(iconLink).toBeInTheDocument(); // アイコンリンクが存在するか
    expect(iconLink).toHaveAttribute('href', COORDINATE_CREATE_CANVAS_URL); // href属性が正しいか
    expect(screen.getByText('登録済みアイテムから作成')).toBeInTheDocument(); // リンクラベルが正しいか
    expect(screen.getByTestId('icon-link-icon')).toBeInTheDocument(); // リンクアイコンが存在するか
  });

  it('calls onClose callback appropriately', () => {
    // コンポーネントをレンダリング
    render(<CreateOutfitSection onClose={mockOnClose} />);

    // ImageUploadSection内の閉じるボタンのクリックをシミュレート
    fireEvent.click(screen.getByTestId('close-button'));
    expect(mockOnClose).toHaveBeenCalledTimes(1); // 閉じるコールバックが1回呼び出されているか

    // IconLink内のクリックをシミュレート
    fireEvent.click(screen.getByTestId('icon-link'));
    expect(mockOnClose).toHaveBeenCalledTimes(2); // 合計2回呼び出されているか
  });

  it('passes correct props to child components', () => {
    // コンポーネントをレンダリング
    render(<CreateOutfitSection onClose={mockOnClose} />);

    // ImageUploadSectionへのプロパティ確認
    expect(ImageUploadSection).toHaveBeenCalledWith(
      {
        value: 'create-outfit', // セクションの値
        label: 'コーディネート作成', // セクションのラベル
        Icon: BiCloset, // セクションのアイコン
        redirectUrl: COORDINATE_CREATE_URL, // リダイレクトURL
        onClose: mockOnClose, // 閉じるコールバック
        children: expect.any(Object), // 子コンポーネント
      },
      expect.any(Object),
    );

    // IconLinkへのプロパティ確認
    expect(IconLink).toHaveBeenCalledWith(
      {
        href: COORDINATE_CREATE_CANVAS_URL, // リンクのURL
        Icon: MdOutlineSwipe, // リンクのアイコン
        size: 'sm', // サイズ設定
        label: '登録済みアイテムから作成', // リンクのラベル
        rounded: true, // スタイル設定
        className: 'border font-medium', // クラス名
        onClick: mockOnClose, // 閉じるコールバック
      },
      expect.any(Object),
    );
  });

  it('maintains correct component hierarchy', () => {
    // コンポーネントをレンダリング
    render(<CreateOutfitSection onClose={mockOnClose} />);

    // 各要素が正しい階層関係にあることを確認
    const imageUploadSection = screen.getByTestId('image-upload-section');
    const childrenContent = screen.getByTestId('children-content');
    const iconLink = screen.getByTestId('icon-link');

    expect(imageUploadSection).toContainElement(childrenContent); // ImageUploadSectionが子要素を含む
    expect(childrenContent).toContainElement(iconLink); // 子要素がIconLinkを含む
  });
});
