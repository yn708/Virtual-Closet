'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter } from '@/components/ui/dialog';
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
        className="max-w-3xl p-6 md:p-8"
        showClose={false}
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-blue-600">
              {TUTORIAL_STEPS[currentStep].title}
            </h2>
            <p className="text-gray-600">{TUTORIAL_STEPS[currentStep].description}</p>
          </div>
          {TUTORIAL_STEPS[currentStep].content}
          <DialogFooter className="flex flex-col gap-4">
            <div className="flex justify-between items-center w-full">
              <Button
                variant="ghost"
                onClick={handleBack}
                disabled={currentStep === 0}
                className="text-gray-600"
              >
                戻る
              </Button>
              <div className="flex gap-2">
                {TUTORIAL_STEPS.map((_, index) => (
                  <div
                    key={index}
                    data-testid={`step-indicator-${index}`}
                    className={`h-1.5 rounded-full transition-all duration-200 ${
                      currentStep === index ? 'bg-blue-600 w-4' : 'bg-gray-200 w-1.5'
                    }`}
                  />
                ))}
              </div>
              <Button onClick={handleNext} className="bg-blue-600 text-white hover:bg-blue-700">
                {currentStep === TUTORIAL_STEPS.length - 1 ? '始める' : '次へ'}
              </Button>
            </div>
            <Button
              onClick={handleComplete}
              variant="link"
              className="text-gray-400 hover:text-gray-600"
            >
              スキップ
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WelcomeAlert;
