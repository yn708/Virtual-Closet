import { useBirthDate } from '@/features/my-page/hooks/useBirthDate';
import { fireEvent, render, screen } from '@testing-library/react';
import BirthDateFields from '../BirthDateFields';

// モックコンポーネントの定義
jest.mock('@/components/elements/form/select/FloatingLabelSelect', () => ({
  __esModule: true,
  default: ({
    label,
    name,
    onChange,
    defaultValue,
  }: {
    label: string;
    name: string;
    onChange?: (value: string) => void;
    defaultValue?: string;
  }) => (
    <div data-testid={`select-field-${name}`}>
      <label>{label}</label>
      <select
        value={defaultValue}
        onChange={(e) => onChange?.(e.target.value)}
        data-testid={`select-${name}`}
      >
        <option value="">選択してください</option>
        <option value="test">テスト選択肢</option>
      </select>
    </div>
  ),
}));

jest.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => (
    <button data-testid="delete-button" onClick={onClick}>
      {children}
    </button>
  ),
}));

// useBirthDateフックのモック
jest.mock('../../../hooks/useBirthDate', () => ({
  useBirthDate: jest.fn(),
}));

describe('BirthDateFields', () => {
  const mockState = {
    errors: {},
    message: '',
  };

  const mockHandleFieldChange = jest.fn();
  const mockResetDate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    // useBirthDateフックの戻り値をモック
    (useBirthDate as jest.Mock).mockReturnValue({
      date: {
        year: '2000',
        month: '01',
        day: '01',
      },
      yearOptions: [
        { label: '2000年', value: '2000' },
        { label: '2001年', value: '2001' },
      ],
      monthOptions: [
        { label: '1月', value: '01' },
        { label: '2月', value: '02' },
      ],
      dayOptions: [
        { label: '1日', value: '01' },
        { label: '2日', value: '02' },
      ],
      handleFieldChange: mockHandleFieldChange,
      resetDate: mockResetDate,
    });
  });

  // 全ての生年月日の選択フィールドが正しくレンダリングされるか確認
  it('renders all birth date select fields', () => {
    render(<BirthDateFields state={mockState} />);

    expect(screen.getByTestId('select-field-birth_year')).toBeInTheDocument();
    expect(screen.getByTestId('select-field-birth_month')).toBeInTheDocument();
    expect(screen.getByTestId('select-field-birth_day')).toBeInTheDocument();
  });

  // 全ての日付フィールドが埋まっていてonDeleteが提供されている場合、削除ボタンが表示されるか確認
  it('shows delete button when all date fields are filled and onDelete is provided', () => {
    const mockOnDelete = jest.fn();
    render(
      <BirthDateFields state={mockState} onDelete={mockOnDelete} defaultBirthDate="2000-01-01" />,
    );

    expect(screen.getByTestId('delete-button')).toBeInTheDocument();
  });

  // 日付フィールドが完全でない場合、削除ボタンが表示されないか確認
  it('hides delete button when date fields are not complete', () => {
    (useBirthDate as jest.Mock).mockReturnValue({
      date: {
        year: '2000',
        month: '',
        day: '01',
      },
      yearOptions: [],
      monthOptions: [],
      dayOptions: [],
      handleFieldChange: jest.fn(),
      resetDate: jest.fn(),
    });

    const mockOnDelete = jest.fn();
    render(<BirthDateFields state={mockState} onDelete={mockOnDelete} />);

    expect(screen.queryByTestId('delete-button')).not.toBeInTheDocument();
  });

  // 日付フィールドが変更されたときにhandleFieldChangeが正しく呼び出されるか確認
  it('calls handleFieldChange when date field changes', () => {
    render(<BirthDateFields state={mockState} />);

    const yearSelect = screen.getByTestId('select-birth_year');
    fireEvent.change(yearSelect, { target: { value: '2001' } });

    expect(mockHandleFieldChange).toHaveBeenCalledWith('year');
  });

  // 削除ボタンがクリックされたときにresetDateとonDeleteが両方呼び出されるか確認
  it('calls both resetDate and onDelete when delete button is clicked', () => {
    const mockOnDelete = jest.fn();
    render(
      <BirthDateFields state={mockState} onDelete={mockOnDelete} defaultBirthDate="2000-01-01" />,
    );

    const deleteButton = screen.getByTestId('delete-button');
    fireEvent.click(deleteButton);

    expect(mockResetDate).toHaveBeenCalled();
    expect(mockOnDelete).toHaveBeenCalled();
  });

  // 正しいグリッドレイアウトクラスが適用されているか確認
  it('applies correct grid layout classes', () => {
    const { container } = render(<BirthDateFields state={mockState} />);

    const gridContainer = container.querySelector('.grid');
    expect(gridContainer).toHaveClass('grid-cols-4', 'gap-4');
  });

  // defaultBirthDateが正しく利用されているか確認
  it('correctly uses defaultBirthDate', () => {
    render(<BirthDateFields state={mockState} defaultBirthDate="2000-01-01" />);

    expect(useBirthDate).toHaveBeenCalledWith('2000-01-01');
  });
});
