'use client';

import IconButton from '@/components/elements/button/IconButton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useIsOpen } from '@/hooks/utils/useIsOpen';
import { signUpAction } from '@/lib/actions/auth/signUpAction';
import { initialState } from '@/utils/data/initialState';
import { Mail } from 'lucide-react';
import { useFormState } from 'react-dom';
import ConfirmContent from '../content/ConfirmContent';
import AuthForm from '../form/AuthForm';

const EmailSignUpButton = (): JSX.Element => {
  // カスタムフックを使用してダイアログの開閉状態を管理
  const { isOpen, onToggle } = useIsOpen();

  // Server Actionとフォームの状態管理
  const [state, formAction] = useFormState(signUpAction, initialState);

  const isConfirmationMode = state.success && state.email;

  return (
    <Dialog open={isOpen} onOpenChange={onToggle}>
      <DialogTrigger asChild>
        <IconButton
          Icon={Mail}
          size="sm_2"
          label="Emailで登録"
          className="w-full rounded-3xl p-5"
          data-testid="email-signup-button"
        />
      </DialogTrigger>
      <DialogContent
        onInteractOutside={isConfirmationMode ? (e) => e.preventDefault() : undefined}
        className="py-20"
      >
        <DialogHeader className="flex justify-center items-center flex-col">
          <DialogTitle className="text-2xl">
            {isConfirmationMode ? '' : 'メールアドレスで登録'}
          </DialogTitle>
          <DialogDescription>
            {isConfirmationMode ? '' : '必要な情報を入力してください'}
          </DialogDescription>
        </DialogHeader>
        {isConfirmationMode ? (
          <ConfirmContent email={state.email} />
        ) : (
          <AuthForm
            state={state}
            submitButtonLabel="アカウント作成"
            mode="signup"
            formAction={formAction}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EmailSignUpButton;
