import { fireEvent, render, screen } from '@testing-library/react';
import { useFilterSheet } from '../../../hooks/useFilterSheet';
import type { FilterSheetConfig } from '../../../types';
import FilterSheet from '../FilterSheet';

// フックのモック
jest.mock('../../../hooks/useFilterSheet');

// UIコンポーネントのモック
jest.mock('@/components/ui/sheet', () => ({
  Sheet: ({ children }: { children: React.ReactNode }) => <div data-testid="sheet">{children}</div>,
  SheetContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="sheet-content">{children}</div>
  ),
  SheetTrigger: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="sheet-trigger">{children}</div>
  ),
  SheetHeader: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="sheet-header">{children}</div>
  ),
  SheetTitle: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="sheet-title">{children}</div>
  ),
  SheetDescription: () => <div data-testid="sheet-description" />,
  SheetFooter: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="sheet-footer">{children}</div>
  ),
}));

jest.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => (
    <button data-testid="button" onClick={onClick}>
      {children}
    </button>
  ),
}));

jest.mock('@/components/ui/scroll-area', () => ({
  ScrollArea: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="scroll-area">{children}</div>
  ),
}));

jest.mock('../../button/CategorySelectButton', () => {
  return jest.fn(() => <div data-testid="category-select-button">CategorySelectButton</div>);
});

jest.mock('../../contents/FilterGroup', () => {
  return jest.fn(() => <div data-testid="filter-group">FilterGroup</div>);
});

describe('FilterSheet', () => {
  // モック用の設定とハンドラー
  const mockConfig: FilterSheetConfig = {
    title: 'Test Filters',
    categories: [
      { id: '1', label: 'Category 1' },
      { id: '2', label: 'Category 2' },
    ],
    filterGroups: [
      {
        key: 'group1',
        label: 'Group 1',
        options: [
          { id: '1', label: 'Option 1' },
          { id: '2', label: 'Option 2' },
        ],
      },
    ],
    layout: {
      categoryGrid: {
        small: 'grid-cols-2',
        large: 'grid-cols-3',
      },
    },
    filterHandlers: {
      defaultFilters: {},
    },
  };

  const mockState = {
    isOpen: false,
    tempFilters: {
      category: '1',
      group1: ['1'],
    },
  };

  const mockHandlers = {
    handleSheetOpenChange: jest.fn(),
    handleCategoryChange: jest.fn(),
    handleFilterChange: jest.fn(),
    handleReset: jest.fn(),
    handleApplyFilters: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useFilterSheet as jest.Mock).mockReturnValue({
      state: mockState,
      handlers: mockHandlers,
    });
  });

  it('正しくレンダリングされること', () => {
    render(
      <FilterSheet
        filters={{}}
        onFilterChange={jest.fn()}
        onCategoryChange={jest.fn()}
        config={mockConfig}
      />,
    );

    // 基本的なコンポーネントの存在確認
    expect(screen.getByTestId('sheet')).toBeInTheDocument();
    expect(screen.getByTestId('sheet-trigger')).toBeInTheDocument();
    expect(screen.getByTestId('sheet-content')).toBeInTheDocument();
    expect(screen.getByTestId('sheet-header')).toBeInTheDocument();
    expect(screen.getByText('Test Filters')).toBeInTheDocument();
  });

  it('フィルターグループが正しくレンダリングされること', () => {
    render(
      <FilterSheet
        filters={{}}
        onFilterChange={jest.fn()}
        onCategoryChange={jest.fn()}
        config={mockConfig}
      />,
    );

    // フィルターグループの数を確認
    const filterGroups = screen.getAllByTestId('filter-group');
    expect(filterGroups).toHaveLength(mockConfig.filterGroups.length);
  });

  it('リセットボタンがクリックされた時に handleReset が呼ばれること', () => {
    render(
      <FilterSheet
        filters={{}}
        onFilterChange={jest.fn()}
        onCategoryChange={jest.fn()}
        config={mockConfig}
      />,
    );

    const resetButton = screen.getByText('リセット');
    fireEvent.click(resetButton);
    expect(mockHandlers.handleReset).toHaveBeenCalled();
  });

  it('適用ボタンがクリックされた時に handleApplyFilters が呼ばれること', () => {
    render(
      <FilterSheet
        filters={{}}
        onFilterChange={jest.fn()}
        onCategoryChange={jest.fn()}
        config={mockConfig}
      />,
    );

    const applyButton = screen.getByText('適用');
    fireEvent.click(applyButton);
    expect(mockHandlers.handleApplyFilters).toHaveBeenCalled();
  });

  it('useFilterSheetフックが正しいパラメータで呼ばれること', () => {
    const mockFilters = { category: '1' };
    const mockOnFilterChange = jest.fn();
    const mockOnCategoryChange = jest.fn();

    render(
      <FilterSheet
        filters={mockFilters}
        onFilterChange={mockOnFilterChange}
        onCategoryChange={mockOnCategoryChange}
        config={mockConfig}
      />,
    );

    expect(useFilterSheet).toHaveBeenCalledWith({
      initialFilters: mockFilters,
      onFilterApply: mockOnFilterChange,
      onCategoryChange: mockOnCategoryChange,
      config: mockConfig,
    });
  });

  it('モバイル表示で絞り込みテキストが非表示になること', () => {
    render(
      <FilterSheet
        filters={{}}
        onFilterChange={jest.fn()}
        onCategoryChange={jest.fn()}
        config={mockConfig}
      />,
    );

    const filterText = screen.getByText('絞り込み');
    expect(filterText).toHaveClass('hidden sm:inline');
  });
});
