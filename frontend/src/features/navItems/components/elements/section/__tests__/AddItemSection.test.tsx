import { fireEvent, render, screen } from '@testing-library/react';
import { IoMdAdd } from 'react-icons/io';
import AddItemSection from '../AddItemSection';
import ImageUploadSection from '../ImageUploadSection';
import { ITEM_CREATE_URL } from '@/utils/constants';

// ImageUploadSectionのモック
jest.mock('../ImageUploadSection', () => ({
  __esModule: true,
  default: jest.fn(({ value, label, Icon, redirectUrl, onClose }) => (
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
    </div>
  )),
}));

describe('AddItemSection', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with correct props and structure', () => {
    render(<AddItemSection onClose={mockOnClose} />);

    // 基本構造と値の検証
    expect(screen.getByTestId('value')).toHaveTextContent('add-clothing');
    expect(screen.getByTestId('label')).toHaveTextContent('アイテム追加');
    expect(screen.getByTestId('icon-component')).toBeInTheDocument();
    expect(screen.getByTestId('redirect-url')).toHaveTextContent(ITEM_CREATE_URL);

    // ImageUploadSectionに渡されるpropsの検証
    expect(ImageUploadSection).toHaveBeenCalledWith(
      {
        value: 'add-clothing',
        label: 'アイテム追加',
        Icon: IoMdAdd,
        redirectUrl: ITEM_CREATE_URL,
        onClose: mockOnClose,
      },
      expect.any(Object),
    );
  });

  it('handles close action correctly', () => {
    render(<AddItemSection onClose={mockOnClose} />);

    fireEvent.click(screen.getByTestId('close-button'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
