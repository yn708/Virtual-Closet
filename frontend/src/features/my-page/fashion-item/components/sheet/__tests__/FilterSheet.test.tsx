import type { MultipleToggleGroupProps } from '@/components/elements/utils/MultipleToggleGroup';
import type { SingleToggleGroupProps } from '@/components/elements/utils/SingleToggleGroup';
import type { ChildrenType } from '@/types';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { CategorySelectButtonProps, FilterState, UseFilterSheetProps } from '../../../types';
import FilterSheet from '../FilterSheet';

// カスタムフックのモック
const mockUseFilterSheet = jest.fn();
jest.mock('../../../hooks/useFilterSheet', () => ({
  useFilterSheet: (props: UseFilterSheetProps) => mockUseFilterSheet(props),
}));

// トリガーボタンのモック
jest.mock('@/components/ui/button', () => ({
  Button: ({ children, ...props }: ChildrenType) => (
    <button {...props} data-testid="filter-trigger-button">
      {children}
    </button>
  ),
}));

// 子コンポーネントのモック
jest.mock('@/components/elements/utils/MultipleToggleGroup', () => {
  return function MockMultipleToggleGroup({ options, onValueChange }: MultipleToggleGroupProps) {
    return (
      <div data-testid="multiple-toggle-group">
        {options.map((option) => (
          <button
            key={option.label}
            data-testid={`status-filter-${option.id}`}
            onClick={() => onValueChange([option.id])}
          >
            {option.label}
          </button>
        ))}
      </div>
    );
  };
});

jest.mock('@/components/elements/utils/SingleToggleGroup', () => {
  return function MockSingleToggleGroup({ options, onValueChange }: SingleToggleGroupProps) {
    return (
      <div data-testid="single-toggle-group">
        {options.map((option) => (
          <button
            key={option.label}
            data-testid={`season-filter-${option.label}`}
            onClick={() => onValueChange(option.label)}
          >
            {option.label}
          </button>
        ))}
      </div>
    );
  };
});

jest.mock('../../button/CategorySelectButton', () => {
  return function MockCategorySelectButton({ onClick }: CategorySelectButtonProps) {
    return (
      <button data-testid="category-select-button" onClick={() => onClick('tops')}>
        カテゴリー選択
      </button>
    );
  };
});

describe('FilterSheet', () => {
  const mockFilters: FilterState = {
    category: '',
    status: [],
    season: [],
  };

  const mockOnFilterChange = jest.fn();
  const mockOnCategoryChange = jest.fn();
  const mockHandleSheetOpenChange = jest.fn();
  const mockHandleSeasonChange = jest.fn();
  const mockHandleStatusChange = jest.fn();
  const mockHandleCategoryChange = jest.fn();
  const mockHandleApplyFilters = jest.fn();
  const mockHandleReset = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseFilterSheet.mockReturnValue({
      isOpen: false,
      tempFilters: mockFilters,
      handleSheetOpenChange: mockHandleSheetOpenChange,
      handleSeasonChange: mockHandleSeasonChange,
      handleStatusChange: mockHandleStatusChange,
      handleCategoryChange: mockHandleCategoryChange,
      handleApplyFilters: mockHandleApplyFilters,
      handleReset: mockHandleReset,
    });
  });

  it('フィルターボタンが正しくレンダリングされること', () => {
    render(
      <FilterSheet
        filters={mockFilters}
        onFilterChange={mockOnFilterChange}
        onCategoryChange={mockOnCategoryChange}
      />,
    );

    expect(screen.getByTestId('filter-trigger-button')).toBeInTheDocument();
    expect(screen.getByText('絞り込み')).toBeInTheDocument();
  });

  it('ステータスフィルターが変更されたときにhandleStatusChangeが呼ばれること', async () => {
    mockUseFilterSheet.mockReturnValue({
      isOpen: true,
      tempFilters: mockFilters,
      handleSheetOpenChange: mockHandleSheetOpenChange,
      handleSeasonChange: mockHandleSeasonChange,
      handleStatusChange: mockHandleStatusChange,
      handleCategoryChange: mockHandleCategoryChange,
      handleApplyFilters: mockHandleApplyFilters,
      handleReset: mockHandleReset,
    });

    render(
      <FilterSheet
        filters={mockFilters}
        onFilterChange={mockOnFilterChange}
        onCategoryChange={mockOnCategoryChange}
      />,
    );

    const ownerFilter = screen.getByRole('button', { name: '所有アイテムのみ' });
    await userEvent.click(ownerFilter);
    expect(mockHandleStatusChange).toHaveBeenCalledWith(['owned']);
  });

  it('シーズンフィルターが変更されたときにhandleSeasonChangeが呼ばれること', async () => {
    mockUseFilterSheet.mockReturnValue({
      isOpen: true,
      tempFilters: mockFilters,
      handleSheetOpenChange: mockHandleSheetOpenChange,
      handleSeasonChange: mockHandleSeasonChange,
      handleStatusChange: mockHandleStatusChange,
      handleCategoryChange: mockHandleCategoryChange,
      handleApplyFilters: mockHandleApplyFilters,
      handleReset: mockHandleReset,
    });

    render(
      <FilterSheet
        filters={mockFilters}
        onFilterChange={mockOnFilterChange}
        onCategoryChange={mockOnCategoryChange}
      />,
    );

    const springFilter = screen.getByRole('button', { name: '春' });
    await userEvent.click(springFilter);
    expect(mockHandleSeasonChange).toHaveBeenCalled();
  });

  it('リセットボタンをクリックしたときにhandleResetが呼ばれること', async () => {
    mockUseFilterSheet.mockReturnValue({
      isOpen: true,
      tempFilters: mockFilters,
      handleSheetOpenChange: mockHandleSheetOpenChange,
      handleSeasonChange: mockHandleSeasonChange,
      handleStatusChange: mockHandleStatusChange,
      handleCategoryChange: mockHandleCategoryChange,
      handleApplyFilters: mockHandleApplyFilters,
      handleReset: mockHandleReset,
    });

    render(
      <FilterSheet
        filters={mockFilters}
        onFilterChange={mockOnFilterChange}
        onCategoryChange={mockOnCategoryChange}
      />,
    );

    await userEvent.click(screen.getByRole('button', { name: 'リセット' }));
    expect(mockHandleReset).toHaveBeenCalled();
  });

  it('適用ボタンをクリックしたときにhandleApplyFiltersが呼ばれること', async () => {
    mockUseFilterSheet.mockReturnValue({
      isOpen: true,
      tempFilters: mockFilters,
      handleSheetOpenChange: mockHandleSheetOpenChange,
      handleSeasonChange: mockHandleSeasonChange,
      handleStatusChange: mockHandleStatusChange,
      handleCategoryChange: mockHandleCategoryChange,
      handleApplyFilters: mockHandleApplyFilters,
      handleReset: mockHandleReset,
    });

    render(
      <FilterSheet
        filters={mockFilters}
        onFilterChange={mockOnFilterChange}
        onCategoryChange={mockOnCategoryChange}
      />,
    );

    await userEvent.click(screen.getByRole('button', { name: '適用' }));
    expect(mockHandleApplyFilters).toHaveBeenCalled();
  });
});
