import type { BaseOption, ToggleGroupFieldProps } from '@/types';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { PropsWithChildren } from 'react';
import ToggleGroupFormField from '../ToggleGroupFormField';

// テスト用の型定義
interface TestOption extends BaseOption {
  id: string;
  name: string;
  description: string;
}

// モックデータ
const mockOptions: TestOption[] = [
  { id: '1', name: 'Option 1', description: 'Description 1' },
  { id: '2', name: 'Option 2', description: 'Description 2' },
  { id: '3', name: 'Option 3', description: 'Description 3' },
];

// UIコンポーネントのモック
interface ToggleGroupProps extends PropsWithChildren {
  type: 'multiple' | 'single';
  className?: string;
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
}

interface ToggleGroupItemProps extends PropsWithChildren {
  value: string;
  className?: string;
  'aria-label'?: string;
  onClick?: () => void;
}

// モックの状態管理用
let mockSelectedValues: string[] = [];
const setMockSelectedValues = (values: string[]) => {
  mockSelectedValues = values;
};

jest.mock('@/components/ui/toggle-group', () => ({
  ToggleGroup: ({ children, type, defaultValue, onValueChange }: ToggleGroupProps) => {
    // 初期値を設定
    if (defaultValue) {
      mockSelectedValues = defaultValue;
    }
    return (
      <div
        data-testid="toggle-group"
        data-type={type}
        data-default-value={defaultValue?.join(',')}
        onClick={(e) => {
          const button = (e.target as HTMLElement).closest('button');
          if (button) {
            const value = button.value;
            const newValues = mockSelectedValues.includes(value)
              ? mockSelectedValues.filter((v) => v !== value)
              : [...mockSelectedValues, value];
            setMockSelectedValues(newValues);
            onValueChange?.(newValues);
          }
        }}
      >
        {children}
      </div>
    );
  },
  ToggleGroupItem: ({
    children,
    value,
    className,
    'aria-label': ariaLabel,
  }: ToggleGroupItemProps) => (
    <button
      data-testid={`toggle-item-${value}`}
      value={value}
      className={className}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  ),
}));

jest.mock('lucide-react', () => ({
  Check: () => <span data-testid="check-icon">✓</span>,
}));

describe('ToggleGroupFormField', () => {
  const defaultProps: ToggleGroupFieldProps<TestOption> = {
    name: 'test-toggle',
    label: 'Test Toggle Group',
    options: mockOptions,
    labelKey: 'name',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockSelectedValues = [];
  });

  it('正しく初期レンダリングされる', () => {
    render(<ToggleGroupFormField {...defaultProps} />);
    expect(screen.getByText('Test Toggle Group')).toBeInTheDocument();

    mockOptions.forEach((option) => {
      expect(screen.getByText(option.name)).toBeInTheDocument();
      expect(screen.getByTestId(`toggle-item-${option.id}`)).toBeInTheDocument();
    });
  });

  it('デフォルト値が正しく設定される', () => {
    const defaultValue = ['1', '2'];
    render(<ToggleGroupFormField {...defaultProps} defaultValue={defaultValue} />);

    defaultValue.forEach((value) => {
      const input = screen.getByDisplayValue(value) as HTMLInputElement;
      expect(input).toBeInTheDocument();
      expect(input.type).toBe('hidden');
      expect(input.name).toBe('test-toggle');
    });
  });

  it('エラー状態が正しく表示される', () => {
    const errorMessage = ['Required field'];
    render(<ToggleGroupFormField {...defaultProps} error={errorMessage} />);
    expect(screen.getByText(errorMessage[0])).toBeInTheDocument();
  });

  it('オプションの選択が正しく動作する', async () => {
    const user = userEvent.setup();
    render(<ToggleGroupFormField {...defaultProps} />);

    // Option 1 を選択
    const option1 = screen.getByTestId('toggle-item-1');
    await user.click(option1);

    // hidden input が追加されていることを確認
    const input = screen.getByDisplayValue('1');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'hidden');
    expect(input).toHaveAttribute('name', 'test-toggle');
  });

  it('カスタムラベルキーでオプションを表示できる', () => {
    render(<ToggleGroupFormField {...defaultProps} options={mockOptions} labelKey="description" />);

    mockOptions.forEach((option) => {
      expect(screen.getByText(option.description)).toBeInTheDocument();
    });
  });

  it('アクセシビリティラベルが正しく設定される', () => {
    render(<ToggleGroupFormField {...defaultProps} />);

    mockOptions.forEach((option) => {
      const toggleItem = screen.getByTestId(`toggle-item-${option.id}`);
      expect(toggleItem).toHaveAttribute('aria-label', `${option.name} を選択`);
    });
  });

  it('チェックアイコンが各オプションに表示される', () => {
    render(<ToggleGroupFormField {...defaultProps} />);
    const checkIcons = screen.getAllByTestId('check-icon');
    expect(checkIcons).toHaveLength(mockOptions.length);
  });
});
