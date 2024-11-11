import { fireEvent, render, screen } from '@testing-library/react';
import type { UseFormReturn } from 'react-hook-form';
import { useBirthDateFields } from '../../../hooks/useBirthDateFields';
import type { ProfileEditFormData } from '../../../types';
import { BirthDateFields } from '../BirthDateFields';

jest.mock('@/components/elements/form/FloatingLabelSelectFormField', () => ({
  __esModule: true,
  default: ({ label, name }: { label: string; name: string }) => (
    <div data-testid={`select-field-${name}`}>
      <label>{label}</label>
    </div>
  ),
}));

jest.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => (
    <button onClick={onClick}>{children}</button>
  ),
}));

jest.mock('../../../hooks/useBirthDateFields', () => ({
  useBirthDateFields: jest.fn(),
}));

describe('BirthDateFields', () => {
  // モックのフォームデータ
  const mockForm = {
    control: {},
    register: jest.fn(),
    formState: { errors: {} },
  } as unknown as UseFormReturn<ProfileEditFormData>;

  beforeEach(() => {
    // 各テストケースの前にモックをリセット
    jest.clearAllMocks();
    (useBirthDateFields as jest.Mock).mockReturnValue({
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
    });
  });

  // 生年月日の選択フィールドがすべてレンダリングされることを確認
  it('renders all birth date select fields', () => {
    render(<BirthDateFields form={mockForm} />);

    expect(screen.getByTestId('select-field-birth_year')).toBeInTheDocument();
    expect(screen.getByTestId('select-field-birth_month')).toBeInTheDocument();
    expect(screen.getByTestId('select-field-birth_day')).toBeInTheDocument();
  });

  // onDelete プロパティが提供されたときに削除ボタンが表示されることを確認
  it('renders delete button when onDelete prop is provided', () => {
    const mockOnDelete = jest.fn();
    render(<BirthDateFields form={mockForm} onDelete={mockOnDelete} />);

    const deleteButton = screen.getByText('生年月日を削除');
    expect(deleteButton).toBeInTheDocument();

    fireEvent.click(deleteButton);
    expect(mockOnDelete).toHaveBeenCalledTimes(1);
  });

  // onDelete プロパティがないときに削除ボタンが表示されないことを確認
  it('does not render delete button when onDelete prop is not provided', () => {
    render(<BirthDateFields form={mockForm} />);

    expect(screen.queryByText('生年月日を削除')).not.toBeInTheDocument();
  });

  // useBirthDateFields フックが form プロパティと共に呼び出されることを確認
  it('calls useBirthDateFields with form prop', () => {
    render(<BirthDateFields form={mockForm} />);

    expect(useBirthDateFields).toHaveBeenCalledWith(mockForm);
  });

  // グリッドレイアウトのクラスが正しく適用されていることを確認
  it('applies correct grid layout classes', () => {
    const { container } = render(<BirthDateFields form={mockForm} />);

    const gridContainer = container.querySelector('.grid');
    expect(gridContainer).toHaveClass('grid-cols-4', 'gap-4');
  });
});
