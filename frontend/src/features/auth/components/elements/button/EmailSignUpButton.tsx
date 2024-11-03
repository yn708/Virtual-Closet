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
import { useSignUp } from '@/features/auth/hooks/useSignUp';
import type { SignUpFormData } from '@/features/auth/types';
import { useToast } from '@/hooks/use-toast';
import { useIsOpen } from '@/hooks/utils/useIsOpen';
import { FaEnvelope } from 'react-icons/fa';
import AuthForm from '../form/AuthForm';

const EmailSignUpButton = () => {
  const { toast } = useToast();
  const { isOpen, onClose, onToggle } = useIsOpen();
  const handleSuccess = () => {
    toast({
      title: '確認メールを送信しました',
      description: 'メールを確認してください。',
    });
    onClose();
  };
  const { form, onSubmit } = useSignUp(handleSuccess);

  return (
    <Dialog open={isOpen} onOpenChange={onToggle}>
      <DialogTrigger asChild>
        <IconButton
          Icon={FaEnvelope}
          size="sm"
          label="Emailで登録"
          className="w-full rounded-3xl p-5"
        />
      </DialogTrigger>
      <DialogContent className="py-20">
        <DialogHeader className="flex justify-center items-center flex-col">
          <DialogTitle className="text-2xl">メールアドレスで登録</DialogTitle>
          <DialogDescription>必要な情報を入力してください</DialogDescription>
        </DialogHeader>
        <AuthForm<SignUpFormData>
          form={form}
          onSubmit={onSubmit}
          submitButtonLabel="アカウント作成"
          mode="signup"
        />
      </DialogContent>
    </Dialog>
  );
};

export default EmailSignUpButton;
