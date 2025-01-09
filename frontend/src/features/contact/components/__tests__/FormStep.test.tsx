import { fireEvent, render, screen } from '@testing-library/react';
import FormStep from '../FormStep';

// 選択肢の型定義
interface SubjectOption {
  id: string;
  name: string;
}

// 子コンポーネントのモック
jest.mock('@/components/elements/form/input/FloatingLabelInput', () => ({
  __esModule: true,
  default: jest.fn(({ label, name, error, onChange }) => (
    <div>
      <label>{label}</label>
      <input data-testid={`mock-input-${name}`} onChange={(e) => onChange(e.target.value)} />
      {error && <span data-testid={`error-${name}`}>{error}</span>}
    </div>
  )),
}));

jest.mock('@/components/elements/form/input/FloatingLabelTextarea', () => ({
  __esModule: true,
  default: jest.fn(({ label, name, error, onChange }) => (
    <div>
      <label>{label}</label>
      <textarea data-testid={`mock-textarea-${name}`} onChange={(e) => onChange(e.target.value)} />
      {error && <span data-testid={`error-${name}`}>{error}</span>}
    </div>
  )),
}));

jest.mock('@/components/elements/form/select/FloatingLabelSelect', () => ({
  __esModule: true,
  default: jest.fn(
    ({
      label,
      name,
      error,
      onChange,
      options,
    }: {
      label: string;
      name: string;
      error?: string[];
      onChange: (value: string) => void;
      options: SubjectOption[];
    }) => (
      <div>
        <label>{label}</label>
        <select data-testid={`mock-select-${name}`} onChange={(e) => onChange(e.target.value)}>
          {options.map((option: SubjectOption) => (
            <option key={option.id} value={option.id}>
              {option.name}
            </option>
          ))}
        </select>
        {error && <span data-testid={`error-${name}`}>{error}</span>}
      </div>
    ),
  ),
}));

jest.mock('@/components/elements/form/checkbox/CheckboxFormField', () => ({
  __esModule: true,
  default: jest.fn(
    ({
      name,
      error,
      onChange,
    }: {
      name: string;
      error?: string[];
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    }) => (
      <div>
        <input type="checkbox" data-testid={`mock-checkbox-${name}`} onChange={onChange} />
        {error && <span data-testid={`error-${name}`}>{error}</span>}
      </div>
    ),
  ),
}));

jest.mock('@/components/elements/button/SubmitButton', () => ({
  __esModule: true,
  default: jest.fn(
    ({ label, disabled, onClick }: { label: string; disabled: boolean; onClick: () => void }) => (
      <button data-testid="mock-submit-button" disabled={disabled} onClick={onClick}>
        {label}
      </button>
    ),
  ),
}));

jest.mock('@/features/auth/components/elements/dialog/LegalDialog', () => ({
  LegalDialog: jest.fn(({ label, className }: { label: string; className?: string }) => (
    <span className={className}>{label}</span>
  )),
}));

describe('FormStep', () => {
  // テスト用の共通props
  const defaultProps = {
    isSession: false,
    states: {
      formData: {
        name: '',
        email: '',
        subject: '',
        message: '',
        privacyAgreed: false,
      },
      errors: null as Record<string, string[]> | null,
      currentStep: 1,
    },
    onFieldChange: jest.fn().mockReturnValue(jest.fn()),
    onCheckboxChange: jest.fn(),
    onNext: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('表示制御', () => {
    it('currentStepが1の時にフォームが表示されること', () => {
      const { container } = render(<FormStep {...defaultProps} />);
      const formContainer = container.firstChild as HTMLElement;
      expect(formContainer.className).not.toContain('hidden');
    });

    it('currentStepが1以外の時にフォームが非表示になること', () => {
      const { container } = render(
        <FormStep {...defaultProps} states={{ ...defaultProps.states, currentStep: 2 }} />,
      );
      const formContainer = container.firstChild as HTMLElement;
      expect(formContainer.className).toContain('hidden');
    });

    it('非ログイン時に名前とメールアドレスフィールドが表示されること', () => {
      render(<FormStep {...defaultProps} />);
      expect(screen.getByTestId('mock-input-name')).toBeInTheDocument();
      expect(screen.getByTestId('mock-input-email')).toBeInTheDocument();
    });

    it('ログイン時に名前とメールアドレスフィールドが非表示になること', () => {
      render(<FormStep {...defaultProps} isSession={true} />);
      expect(screen.queryByTestId('mock-input-name')).not.toBeInTheDocument();
      expect(screen.queryByTestId('mock-input-email')).not.toBeInTheDocument();
    });
  });

  describe('フォーム操作', () => {
    it('フィールドの値が変更されたときにonFieldChangeが呼ばれること', () => {
      render(<FormStep {...defaultProps} />);

      fireEvent.change(screen.getByTestId('mock-input-name'), {
        target: { value: 'テスト太郎' },
      });
      expect(defaultProps.onFieldChange).toHaveBeenCalledWith('name');

      fireEvent.change(screen.getByTestId('mock-textarea-message'), {
        target: { value: 'テストメッセージ' },
      });
      expect(defaultProps.onFieldChange).toHaveBeenCalledWith('message');
    });

    it('チェックボックスの変更でonCheckboxChangeが呼ばれること', () => {
      render(<FormStep {...defaultProps} />);

      fireEvent.click(screen.getByTestId('mock-checkbox-privacyAgreed'));
      expect(defaultProps.onCheckboxChange).toHaveBeenCalled();
    });

    it('確認ボタンクリックでonNextが呼ばれること', () => {
      render(
        <FormStep
          {...defaultProps}
          states={{
            ...defaultProps.states,
            formData: { ...defaultProps.states.formData, privacyAgreed: true },
          }}
        />,
      );

      fireEvent.click(screen.getByTestId('mock-submit-button'));
      expect(defaultProps.onNext).toHaveBeenCalled();
    });
  });

  describe('エラー表示', () => {
    it('エラーがある場合に適切に表示されること', () => {
      const errors = {
        name: ['名前は必須です'],
        email: ['メールアドレスの形式が正しくありません'],
        subject: ['件名を選択してください'],
        message: ['メッセージを入力してください'],
        privacyAgreed: ['プライバシーポリシーに同意してください'],
      };

      render(<FormStep {...defaultProps} states={{ ...defaultProps.states, errors }} />);

      expect(screen.getByTestId('error-name')).toHaveTextContent('名前は必須です');
      expect(screen.getByTestId('error-email')).toHaveTextContent(
        'メールアドレスの形式が正しくありません',
      );
      expect(screen.getByTestId('error-subject')).toHaveTextContent('件名を選択してください');
      expect(screen.getByTestId('error-message')).toHaveTextContent('メッセージを入力してください');
      expect(screen.getByTestId('error-privacyAgreed')).toHaveTextContent(
        'プライバシーポリシーに同意してください',
      );
    });
  });

  describe('ボタンの状態', () => {
    it('プライバシーポリシーに同意していない場合、確認ボタンが無効になること', () => {
      render(<FormStep {...defaultProps} />);
      expect(screen.getByTestId('mock-submit-button')).toBeDisabled();
    });

    it('プライバシーポリシーに同意している場合、確認ボタンが有効になること', () => {
      render(
        <FormStep
          {...defaultProps}
          states={{
            ...defaultProps.states,
            formData: { ...defaultProps.states.formData, privacyAgreed: true },
          }}
        />,
      );
      expect(screen.getByTestId('mock-submit-button')).not.toBeDisabled();
    });
  });
});
