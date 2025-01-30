import { STEPS } from '@/utils/data/navItems';
import { render, screen } from '@testing-library/react';
import StepIndicator from '../StepIndicator';

describe('StepIndicator', () => {
  describe('ステップの表示テスト', () => {
    it('すべてのステップとラベルが正しく表示される', () => {
      render(<StepIndicator currentStep={1} />);

      STEPS.forEach(({ step, label }) => {
        expect(screen.getByText(label)).toBeInTheDocument();
        if (step === 1) {
          expect(screen.getByText('1')).toBeInTheDocument();
        }
      });
    });

    it('現在のステップに適切なスタイルが適用される', () => {
      render(<StepIndicator currentStep={2} />);

      // data-testidを使用して要素を取得
      const currentStepCircle = screen.getByTestId('step-2');

      expect(currentStepCircle).toHaveClass('bg-blue-600', 'text-white');
      expect(currentStepCircle).toHaveTextContent('2');
    });

    it('完了したステップにはチェックマークが表示される', () => {
      render(<StepIndicator currentStep={2} />);

      const completedStep = screen.getByTestId('step-1');
      const checkIcon = completedStep.querySelector('.lucide-check');

      expect(checkIcon).toBeInTheDocument();
      expect(checkIcon).toHaveClass('size-5');
    });

    it('これからのステップには適切なスタイルが適用される', () => {
      render(<StepIndicator currentStep={1} />);

      // ステップ2と3のスタイルを確認
      const futureSteps = [2, 3].map((step) => screen.getByTestId(`step-${step}`));

      futureSteps.forEach((step) => {
        expect(step).toHaveClass('bg-gray-200', 'text-gray-700');
      });
    });
  });

  describe('ステップ間のラインのテスト', () => {
    it('現在のステップより前のラインは青色で表示される', () => {
      render(<StepIndicator currentStep={3} />);

      const firstLine = screen.getByTestId('line-1');
      const secondLine = screen.getByTestId('line-2');

      expect(firstLine).toHaveClass('bg-blue-600');
      expect(secondLine).toHaveClass('bg-blue-600');
    });

    it('現在のステップより後のラインはグレーで表示される', () => {
      render(<StepIndicator currentStep={1} />);

      STEPS.slice(0, -1).forEach((_, index) => {
        const line = screen.getByTestId(`line-${index + 1}`);
        expect(line).toHaveClass('bg-gray-200');
      });
    });

    it('最後のステップにはラインが表示されない', () => {
      render(<StepIndicator currentStep={1} />);

      const lastStepIndex = STEPS.length;
      const lastLine = screen.queryByTestId(`line-${lastStepIndex}`);

      expect(lastLine).not.toBeInTheDocument();
    });
  });

  describe('レイアウトのテスト', () => {
    it('全体のコンテナに適切なクラスが適用される', () => {
      const { container } = render(<StepIndicator currentStep={1} />);
      const mainContainer = container.firstChild as HTMLElement;

      expect(mainContainer).toHaveClass('flex', 'justify-center', 'mb-8');
    });

    it('各ステップのラベルが適切なスタイルで表示される', () => {
      render(<StepIndicator currentStep={1} />);

      STEPS.forEach(({ label }) => {
        const labelElement = screen.getByText(label);
        expect(labelElement).toHaveClass('text-xs', 'text-gray-500');
      });
    });

    it('ステップの円が正しいサイズと形で表示される', () => {
      render(<StepIndicator currentStep={1} />);

      STEPS.forEach(({ step }) => {
        const circleContainer = screen.getByTestId(`step-${step}`);
        expect(circleContainer).toHaveClass(
          'size-10',
          'rounded-full',
          'flex',
          'items-center',
          'justify-center',
        );
      });
    });
  });
});
