import IconLink from '@/components/elements/link/IconLink';
import { COORDINATE_CREATE_CANVAS_URL, COORDINATE_EDIT_URL } from '@/utils/constants';
import { fireEvent, render, screen } from '@testing-library/react';
import { BiCloset } from 'react-icons/bi';
import { MdOutlineSwipe } from 'react-icons/md';
import { CreateOutfitSection } from '../CreateOutfitSection';
import { ImageUploadSection } from '../ImageUploadSection';

// ImageUploadSectionのモック
jest.mock('../ImageUploadSection', () => ({
  ImageUploadSection: jest.fn(({ children, value, label, Icon, redirectUrl, onClose }) => (
    <div data-testid="image-upload-section">
      <div data-testid="value">{value}</div>
      <div data-testid="label">{label}</div>
      <div data-testid="icon">{Icon ? <Icon data-testid="icon-component" /> : null}</div>
      <div data-testid="redirect-url">{redirectUrl}</div>
      <button data-testid="close-button" onClick={onClose}>
        Close
      </button>
      <div data-testid="children-content">{children}</div>
    </div>
  )),
}));

// IconLinkのモック
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
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // 基本的なレンダリングテスト
  it('renders ImageUploadSection with correct props', () => {
    render(<CreateOutfitSection onClose={mockOnClose} />);

    // ImageUploadSectionのプロパティを検証
    expect(screen.getByTestId('value')).toHaveTextContent('create-outfit');
    expect(screen.getByTestId('label')).toHaveTextContent('コーディネート作成');
    expect(screen.getByTestId('icon-component')).toBeInTheDocument();
    expect(screen.getByTestId('redirect-url')).toHaveTextContent(COORDINATE_EDIT_URL);
  });

  // IconLinkの検証
  it('renders IconLink with correct props', () => {
    render(<CreateOutfitSection onClose={mockOnClose} />);

    const iconLink = screen.getByTestId('icon-link');
    expect(iconLink).toBeInTheDocument();
    expect(iconLink).toHaveAttribute('href', COORDINATE_CREATE_CANVAS_URL);
    expect(screen.getByText('登録済みアイテムから作成')).toBeInTheDocument();
    expect(screen.getByTestId('icon-link-icon')).toBeInTheDocument();
  });

  // ImageUploadSectionにpropsが正しく渡されているか検証
  it('passes correct props to ImageUploadSection', () => {
    render(<CreateOutfitSection onClose={mockOnClose} />);

    expect(ImageUploadSection).toHaveBeenCalledWith(
      {
        value: 'create-outfit',
        label: 'コーディネート作成',
        Icon: BiCloset,
        redirectUrl: COORDINATE_EDIT_URL,
        onClose: mockOnClose,
        children: expect.any(Object),
      },
      expect.any(Object),
    );
  });

  // IconLinkにpropsが正しく渡されているか検証
  it('passes correct props to IconLink', () => {
    render(<CreateOutfitSection onClose={mockOnClose} />);

    expect(IconLink).toHaveBeenCalledWith(
      {
        href: COORDINATE_CREATE_CANVAS_URL,
        Icon: MdOutlineSwipe,
        size: 'sm',
        label: '登録済みアイテムから作成',
        rounded: true,
        className: 'border font-medium',
        onClick: mockOnClose,
      },
      expect.any(Object),
    );
  });

  // onClose関数の動作検証
  it('calls onClose when ImageUploadSection close button is clicked', () => {
    render(<CreateOutfitSection onClose={mockOnClose} />);

    const closeButton = screen.getByTestId('close-button');
    fireEvent.click(closeButton);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  // IconLinkのクリック時の動作検証
  it('calls onClose when IconLink is clicked', () => {
    render(<CreateOutfitSection onClose={mockOnClose} />);

    const iconLink = screen.getByTestId('icon-link');
    fireEvent.click(iconLink);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  // 子要素のレンダリング検証
  it('renders children inside ImageUploadSection', () => {
    render(<CreateOutfitSection onClose={mockOnClose} />);

    const childrenContent = screen.getByTestId('children-content');
    expect(childrenContent).toBeInTheDocument();
    expect(childrenContent.querySelector('[data-testid="icon-link"]')).toBeInTheDocument();
  });

  // コンポーネントの構造検証
  it('maintains proper component structure', () => {
    render(<CreateOutfitSection onClose={mockOnClose} />);

    const imageUploadSection = screen.getByTestId('image-upload-section');
    expect(imageUploadSection).toContainElement(screen.getByTestId('children-content'));
    expect(imageUploadSection).toContainElement(screen.getByTestId('icon-component'));
  });
});
