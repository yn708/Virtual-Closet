'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { TUTORIAL_STEPS } from '@/utils/data/info';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const WelcomeAlert = () => {
  const { data: session, update: updateSession } = useSession();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (session?.user?.isNewUser) {
      setIsOpen(true);
    }
  }, [session?.user?.isNewUser]);

  const handleNext = async () => {
    if (currentStep < TUTORIAL_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      await handleComplete();
    }
  };

  const handleBack = () => {
    setCurrentStep(Math.max(0, currentStep - 1));
  };

  const handleComplete = async () => {
    try {
      await updateSession({
        user: { ...session?.user, isNewUser: false },
      });
      setIsOpen(false);
      router.refresh();
    } catch (error) {
      console.error('Error updating session:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleComplete}>
      <DialogContent
        className="w-[95vw] max-w-2xl h-[80vh] max-h-[600px] p-0 overflow-hidden"
        showClose={false}
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="text-center p-6 space-y-3 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
            <h2 className="text-xl md:text-2xl font-bold text-blue-600 tracking-tight">
              {TUTORIAL_STEPS[currentStep].title}
            </h2>
            {TUTORIAL_STEPS[currentStep].description && (
              <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base">
                {TUTORIAL_STEPS[currentStep].description}
              </p>
            )}
          </div>

          {/* Content - Scrollable Area */}
          <div className="flex-1 overflow-y-auto px-4 md:px-6">
            {TUTORIAL_STEPS[currentStep].content}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-100 dark:border-gray-800 p-4 md:p-6 bg-white dark:bg-gray-900">
            <div className="space-y-4">
              <div className="flex justify-between items-center w-full">
                <Button
                  variant="ghost"
                  onClick={handleBack}
                  disabled={currentStep === 0}
                  className="text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  戻る
                </Button>
                <div className="flex gap-1.5">
                  {TUTORIAL_STEPS.map((_, index) => (
                    <div
                      key={index}
                      data-testid={`step-indicator-${index}`}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        currentStep === index
                          ? 'bg-blue-600 w-6'
                          : 'bg-gray-200 dark:bg-gray-700 w-1.5'
                      }`}
                    />
                  ))}
                </div>
                <Button
                  onClick={handleNext}
                  className="bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                >
                  {currentStep === TUTORIAL_STEPS.length - 1 ? '始める' : '次へ'}
                </Button>
              </div>
              <Button
                onClick={handleComplete}
                variant="link"
                className="w-full text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                スキップ
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WelcomeAlert;
