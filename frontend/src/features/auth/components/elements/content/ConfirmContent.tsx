'use client';

import TitleLayout from '@/components/layout/TitleLayout';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { resendCodeAction } from '@/lib/actions/auth/resendCodeAction';
import { initialState } from '@/utils/data/initialState';
import { useState } from 'react';
import { useFormState } from 'react-dom';
import AuthCodeInputForm from '../form/AuthCodeInputForm';
import AuthForm from '../form/AuthForm';

const ConfirmContent = ({ email }: { email: string }) => {
  const [view, setView] = useState<'input' | 'resend'>('input');
  const { toast } = useToast();

  // Server Actionに現在のemailを渡す
  const wrappedResendCodeAction = async (prevState: typeof initialState, formData: FormData) => {
    const result = await resendCodeAction(email, prevState, formData);
    if (result.success) {
      setView('input');
      toast({
        title: '認証コードを再送信しました。',
        description: 'メールアドレスをご確認ください。',
      });
    }
    return result;
  };

  const [state, formAction] = useFormState(wrappedResendCodeAction, initialState);

  const viewContents = {
    input: {
      title: '認証コード入力',
      description: 'メールアドレス宛に認証コードを送信しました。',
      subDescription: '記載された認証コードを入力してください。',
      content: <AuthCodeInputForm email={email} />,
      buttonLabel: '認証コードを再送信',
    },
    resend: {
      title: '認証コード再送信',
      description: '',
      subDescription: '',
      content: (
        <AuthForm
          state={state}
          submitButtonLabel="認証コードを再送信"
          mode="login"
          formAction={formAction}
        />
      ),
      buttonLabel: '戻る',
    },
  };

  const currentView = viewContents[view];

  const toggleView = () => {
    setView(view === 'input' ? 'resend' : 'input');
  };

  return (
    <TitleLayout
      title={currentView.title}
      description={currentView.description}
      subDescription={currentView.subDescription}
      className="text-center"
    >
      {currentView.content}
      <div className="w-3/4 mx-auto">
        <div className="w-full text-center mt-4">
          <Button
            type="button"
            variant="link"
            className="text-sm text-muted-foreground"
            onClick={toggleView}
          >
            {currentView.buttonLabel}
          </Button>
        </div>
      </div>
    </TitleLayout>
  );
};

export default ConfirmContent;
