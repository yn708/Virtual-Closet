'use client';

import { useContactForm } from '../hooks/useContactForm';
import CompletionStep from './CompletionStep';
import ConfirmationStep from './ConfirmationStep';
import FormStep from './FormStep';
import StepIndicator from './StepIndicator';

const StepContactForm = ({ isSession }: { isSession: boolean }) => {
  const { states, handler } = useContactForm(isSession);
  const { handleFieldChange, handleCheckboxChange, handleNext, handleBack, formAction } = handler;

  return (
    <div className="w-full max-w-2xl mx-auto">
      <StepIndicator currentStep={states.currentStep} />
      <form action={formAction}>
        <FormStep
          isSession={isSession}
          states={states}
          onFieldChange={handleFieldChange}
          onCheckboxChange={handleCheckboxChange}
          onNext={handleNext}
        />

        {states.currentStep === 2 && (
          <ConfirmationStep isSession={isSession} formData={states.formData} onBack={handleBack} />
        )}
      </form>
      {states.currentStep === 3 && <CompletionStep isSession={isSession} />}
    </div>
  );
};

export default StepContactForm;
