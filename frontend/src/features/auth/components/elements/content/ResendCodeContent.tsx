'use client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useResendCodeForm } from '@/features/auth/hooks/useResendCodeForm';
import type { EmailType } from '@/features/auth/types';
import { useIsOpen } from '@/hooks/utils/useIsOpen';
import AuthForm from '../form/AuthForm';

export default function ResendCodeContent({ email }: EmailType) {
  const { isOpen, onClose, onToggle } = useIsOpen();

  const { form, onSubmit } = useResendCodeForm(email, () => onClose());

  return (
    <Dialog open={isOpen} onOpenChange={onToggle}>
      <DialogTrigger asChild>
        <Button variant="link" className="text-sm text-muted-foreground">
          認証コードを再送信
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="hidden text-center">認証コード再送信</DialogTitle>
          <DialogDescription className="text-center">
            お手数ですがメールアドレスとパスワードの入力をお願いします。
          </DialogDescription>
        </DialogHeader>
        <AuthForm
          form={form}
          onSubmit={onSubmit}
          submitButtonLabel="認証コードを再送信"
          mode="login"
        />
      </DialogContent>
    </Dialog>
  );
}
