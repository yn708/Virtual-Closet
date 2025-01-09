import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useContactForm } from '../../hooks/useContactForm';
import type { ContactFormData } from '../../types';
import StepContactForm from '../StepContactForm';

// 必要なモジュールのモック化
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(() => ({
    data: null,
    status: 'unauthenticated',
  })),
}));

// カスタムフックのモック
jest.mock('../../hooks/useContactForm', () => ({
  useContactForm: jest.fn(),
}));

// 子コンポーネントのモック
jest.mock('../StepIndicator', () => {
  return function MockStepIndicator({ currentStep }: { currentStep: number }) {
    return <div data-testid="step-indicator">Step: {currentStep}</div>;
  };
});

jest.mock('../FormStep', () => {
  return function MockFormStep({ onNext }: { onNext: () => void }) {
    return (
      <div data-testid="form-step">
        <button onClick={onNext}>Next Step</button>
      </div>
    );
  };
});

jest.mock('../ConfirmationStep', () => {
  return function MockConfirmationStep({ onBack }: { onBack: () => void }) {
    return (
      <div data-testid="confirmation-step">
        <button onClick={onBack}>Back Step</button>
      </div>
    );
  };
});

jest.mock('../CompletionStep', () => {
  return function MockCompletionStep() {
    return <div data-testid="completion-step">Completion</div>;
  };
});

// テスト用の型定義
type UseContactFormReturn = {
  states: {
    currentStep: number;
    formData: ContactFormData;
  };
  handler: {
    handleFieldChange: jest.Mock;
    handleCheckboxChange: jest.Mock;
    handleNext: jest.Mock;
    handleBack: jest.Mock;
    formAction: jest.Mock;
  };
};

describe('StepContactForm', () => {
  // モック用の初期データ
  const mockInitialFormData: ContactFormData = {
    subject: '',
    message: '',
    privacyAgreed: false,
  };

  // モック用のハンドラ
  const createMockHandlers = () => ({
    handleFieldChange: jest.fn(),
    handleCheckboxChange: jest.fn(),
    handleNext: jest.fn(),
    handleBack: jest.fn(),
    formAction: jest.fn(),
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const setupTest = (step: number) => {
    const handlers = createMockHandlers();
    const mockUseContactForm: UseContactFormReturn = {
      states: {
        currentStep: step,
        formData: mockInitialFormData,
      },
      handler: handlers,
    };
    (useContactForm as jest.Mock).mockReturnValue(mockUseContactForm);

    return { handlers, mockUseContactForm };
  };

  describe('ステップ表示のテスト', () => {
    it('初期状態（Step 1）で正しくレンダリングされる', () => {
      setupTest(1);
      render(<StepContactForm isSession={false} />);

      expect(screen.getByTestId('step-indicator')).toHaveTextContent('Step: 1');
      expect(screen.getByTestId('form-step')).toBeInTheDocument();
      expect(screen.queryByTestId('confirmation-step')).not.toBeInTheDocument();
      expect(screen.queryByTestId('completion-step')).not.toBeInTheDocument();
    });

    it('確認ステップ（Step 2）で正しくレンダリングされる', () => {
      setupTest(2);
      render(<StepContactForm isSession={false} />);

      expect(screen.getByTestId('step-indicator')).toHaveTextContent('Step: 2');
      expect(screen.getByTestId('confirmation-step')).toBeInTheDocument();
      expect(screen.queryByTestId('completion-step')).not.toBeInTheDocument();
    });

    it('完了ステップ（Step 3）で正しくレンダリングされる', () => {
      setupTest(3);
      render(<StepContactForm isSession={false} />);

      expect(screen.getByTestId('step-indicator')).toHaveTextContent('Step: 3');
      expect(screen.getByTestId('completion-step')).toBeInTheDocument();
      expect(screen.queryByTestId('confirmation-step')).not.toBeInTheDocument();
    });
  });

  describe('イベントハンドラのテスト', () => {
    it('FormStepのNextボタンクリックでhandleNextが呼ばれる', async () => {
      const { handlers } = setupTest(1);
      render(<StepContactForm isSession={false} />);

      await userEvent.click(screen.getByText('Next Step'));
      expect(handlers.handleNext).toHaveBeenCalledTimes(1);
    });

    it('ConfirmationStepのBackボタンクリックでhandleBackが呼ばれる', async () => {
      const { handlers } = setupTest(2);
      render(<StepContactForm isSession={false} />);

      await userEvent.click(screen.getByText('Back Step'));
      expect(handlers.handleBack).toHaveBeenCalledTimes(1);
    });
  });

  describe('ログイン状態による表示の違いのテスト', () => {
    it('ログイン状態に応じて正しくuseContactFormが呼ばれる', () => {
      setupTest(1);
      render(<StepContactForm isSession={true} />);
      expect(useContactForm).toHaveBeenCalledWith(true);

      jest.clearAllMocks();

      setupTest(1);
      render(<StepContactForm isSession={false} />);
      expect(useContactForm).toHaveBeenCalledWith(false);
    });
  });
});
