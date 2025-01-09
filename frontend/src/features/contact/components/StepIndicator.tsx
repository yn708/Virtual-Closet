import { STEPS } from '@/utils/data/navItems';
import { Check } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
}

const StepIndicator = ({ currentStep }: StepIndicatorProps) => (
  <div className="flex justify-center mb-8">
    {STEPS.map(({ step, label }) => (
      <div key={step} className="flex flex-col items-center">
        <div className="flex items-start justify-center">
          {/* ステップの円とラベル */}
          <div className="flex flex-col items-center gap-1">
            <div
              className={`size-10 rounded-full flex items-center justify-center ${
                currentStep === step
                  ? 'bg-blue-600 text-white' // 現在のステップ
                  : currentStep > step
                    ? 'bg-blue-600 text-white' // 完了したステップ
                    : 'bg-gray-200 text-gray-700' // これからのステップ
              }`}
              data-testid={`step-${step}`}
              role="generic"
              aria-label={`Step ${step}`}
            >
              {currentStep > step ? <Check className="size-5" /> : step}
            </div>
            <span className="text-xs text-gray-500">{label}</span>
          </div>
          {/* ステップ間をつなぐライン */}
          {step < STEPS.length && (
            <div
              className={`w-12 h-1 mx-2 mt-4 ${currentStep > step ? 'bg-blue-600' : 'bg-gray-200'}`}
              data-testid={`line-${step}`}
            />
          )}
        </div>
      </div>
    ))}
  </div>
);

export default StepIndicator;
