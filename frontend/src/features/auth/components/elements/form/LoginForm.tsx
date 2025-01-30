'use client';

import { useToast } from '@/hooks/use-toast';
import { loginAction } from '@/lib/actions/auth/loginAction';
import type { FormState } from '@/types';
import { TOP_URL } from '@/utils/constants';
import { initialState } from '@/utils/data/initialState';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useFormState } from 'react-dom';
import AuthForm from '../form/AuthForm';

const LoginForm = () => {
  const { toast } = useToast();
  const router = useRouter();

  const wrappedAction = async (prevState: FormState, formData: FormData) => {
    const result = await loginAction(prevState, formData);

    if (result.success && result.email && result.password) {
      const loginResult = await signIn('credentials', {
        email: result.email,
        password: result.password,
        redirect: false,
      });

      if (loginResult?.error) {
        toast({
          title: 'ログイン失敗',
          description: 'メールアドレスまたはパスワードが正しくありません。',
          variant: 'destructive',
        });
        return result;
      }
      router.push(TOP_URL);
      return result;
    }

    return result;
  };

  const [state, formAction] = useFormState(wrappedAction, initialState);

  return (
    <div className="p-4">
      <AuthForm state={state} formAction={formAction} submitButtonLabel="ログイン" mode="login" />
    </div>
  );
};

export default LoginForm;
