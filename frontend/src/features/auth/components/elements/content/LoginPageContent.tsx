'use client';

import LinkWithText from '@/components/elements/link/LinkWithText';
import DividerWithText from '@/components/elements/utils/DividerWithText';
import { useToast } from '@/hooks/use-toast';
import { loginAction } from '@/lib/actions/auth/loginAction';
import type { FormState } from '@/types';
import { SIGN_UP_URL, TOP_URL } from '@/utils/constants';
import { initialState } from '@/utils/data/initialState';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useFormState } from 'react-dom';
import SocialAuthButtons from '../button/SocialAuthButtons';
import AuthForm from '../form/AuthForm';

export default function LoginPageContent() {
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
    <div>
      <SocialAuthButtons text="ログイン" />
      <DividerWithText className="text-sm font-medium py-4" text="または" />
      <AuthForm state={state} formAction={formAction} submitButtonLabel="ログイン" mode="login" />
      <div className="space-y-4">
        <LinkWithText
          href="/auth/password/reset"
          text="パスワードをお忘れの方は"
          label="こちら"
          className="text-center text-sm text-gray-600"
        />
        <LinkWithText text="まだアカウントをお持ちでない方は" href={SIGN_UP_URL} label="新規登録" />
      </div>
    </div>
  );
}
