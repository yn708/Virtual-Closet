import type { ItemEditorFormProps } from '@/features/fashion-items/types';
import { fetchFashionMetaDataAPI } from '@/lib/api/fashionItemsApi';
import type { FashionItem } from '@/types';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EditItemDialog from '../EditItemDialog';

// ResizeObserverのモック
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}
global.ResizeObserver = ResizeObserverMock;

// APIのモック
jest.mock('@/lib/api/fashionItemsApi', () => ({
  fetchFashionMetaDataAPI: jest.fn(),
}));

// カスタムフックのモック
const mockUseIsOpen = jest.fn();
jest.mock('@/hooks/utils/useIsOpen', () => ({
  useIsOpen: () => mockUseIsOpen(),
}));

// ItemEditorFormのモック
jest.mock('@/features/fashion-items/components/form/ItemEditorForm', () => {
  return function MockItemEditorForm({ initialData, onSuccess }: ItemEditorFormProps) {
    return (
      <div data-testid="item-editor-form">
        <button
          onClick={() => {
            if (initialData && onSuccess) {
              onSuccess(initialData);
            }
          }}
        >
          Save
        </button>
      </div>
    );
  };
});

describe('EditItemDialog', () => {
  const mockItem: FashionItem = {
    id: '1',
    image: 'test-image.jpg',
    sub_category: { id: 'sub1', subcategory_name: 'Tシャツ' },
    brand: {
      id: 'brand1',
      brand_name: 'Test Brand',
      brand_name_kana: 'テストブランド',
    },
    seasons: [{ id: 'season1', season_name: '春' }] as [{ id: string; season_name: string }],
    price_range: { id: 'price1', price_range: '¥1,000-¥5,000' },
    design: { id: 'design1', design_pattern: 'ストライプ' },
    main_color: {
      id: 'color1',
      color_name: 'ホワイト',
      color_code: '#FFFFFF',
    },
    is_owned: true,
    is_old_clothes: false,
    created_at: new Date('2024-01-01'),
    updated_at: new Date('2024-01-01'),
  };

  const mockMetaData = {
    subCategories: [
      { id: 'sub1', subcategory_name: 'Tシャツ' },
      { id: 'sub2', subcategory_name: 'シャツ' },
    ],
    brands: [{ id: 'brand1', brand_name: 'Test Brand', brand_name_kana: 'テストブランド' }],
    seasons: [{ id: 'season1', season_name: '春' }],
    priceRanges: [{ id: 'price1', price_range: '¥1,000-¥5,000' }],
    designs: [{ id: 'design1', design_pattern: 'ストライプ' }],
    colors: [{ id: 'color1', color_name: 'ホワイト', color_code: '#FFFFFF' }],
  };

  const mockOnUpdate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (fetchFashionMetaDataAPI as jest.Mock).mockResolvedValue(mockMetaData);
    mockUseIsOpen.mockReturnValue({
      isOpen: false,
      onClose: jest.fn(),
      onToggle: jest.fn(),
    });
  });

  it('renders trigger children when closed', () => {
    render(
      <EditItemDialog item={mockItem} onUpdate={mockOnUpdate}>
        <button>Edit</button>
      </EditItemDialog>,
    );

    expect(screen.getByText('Edit')).toBeInTheDocument();
  });

  it('shows loading state while fetching metadata', async () => {
    mockUseIsOpen.mockReturnValue({
      isOpen: true,
      onClose: jest.fn(),
      onToggle: jest.fn(),
    });

    render(
      <EditItemDialog item={mockItem} onUpdate={mockOnUpdate}>
        <button>Edit</button>
      </EditItemDialog>,
    );

    expect(screen.getByText('データを取得中...')).toBeInTheDocument();
  });

  it('renders form after metadata is loaded', async () => {
    mockUseIsOpen.mockReturnValue({
      isOpen: true,
      onClose: jest.fn(),
      onToggle: jest.fn(),
    });

    render(
      <EditItemDialog item={mockItem} onUpdate={mockOnUpdate}>
        <button>Edit</button>
      </EditItemDialog>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('item-editor-form')).toBeInTheDocument();
    });
  });

  it('handles successful update', async () => {
    const mockOnClose = jest.fn();
    mockUseIsOpen.mockReturnValue({
      isOpen: true,
      onClose: mockOnClose,
      onToggle: jest.fn(),
    });

    render(
      <EditItemDialog item={mockItem} onUpdate={mockOnUpdate}>
        <button>Edit</button>
      </EditItemDialog>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('item-editor-form')).toBeInTheDocument();
    });

    await act(async () => {
      await userEvent.click(screen.getByText('Save'));
    });

    expect(mockOnUpdate).toHaveBeenCalledWith(mockItem);
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('handles metadata fetch error', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    (fetchFashionMetaDataAPI as jest.Mock).mockRejectedValue(new Error('Fetch error'));

    mockUseIsOpen.mockReturnValue({
      isOpen: true,
      onClose: jest.fn(),
      onToggle: jest.fn(),
    });

    render(
      <EditItemDialog item={mockItem} onUpdate={mockOnUpdate}>
        <button>Edit</button>
      </EditItemDialog>,
    );

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to fetch metadata:', expect.any(Error));
    });

    consoleErrorSpy.mockRestore();
  });

  it('does not fetch metadata when dialog is closed', () => {
    mockUseIsOpen.mockReturnValue({
      isOpen: false,
      onClose: jest.fn(),
      onToggle: jest.fn(),
    });

    render(
      <EditItemDialog item={mockItem} onUpdate={mockOnUpdate}>
        <button>Edit</button>
      </EditItemDialog>,
    );

    expect(fetchFashionMetaDataAPI).not.toHaveBeenCalled();
  });

  it('does not fetch metadata when it is already loaded', async () => {
    mockUseIsOpen.mockReturnValue({
      isOpen: true,
      onClose: jest.fn(),
      onToggle: jest.fn(),
    });

    const { rerender } = render(
      <EditItemDialog item={mockItem} onUpdate={mockOnUpdate}>
        <button>Edit</button>
      </EditItemDialog>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('item-editor-form')).toBeInTheDocument();
    });

    expect(fetchFashionMetaDataAPI).toHaveBeenCalledTimes(1);

    rerender(
      <EditItemDialog item={mockItem} onUpdate={mockOnUpdate}>
        <button>Edit</button>
      </EditItemDialog>,
    );

    expect(fetchFashionMetaDataAPI).toHaveBeenCalledTimes(1);
  });
});
