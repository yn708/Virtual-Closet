'use client';

import SubmitButton from '@/components/elements/button/SubmitButton';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { sendCodeAction } from '@/lib/actions/auth/sendCodeAction';
import type { FormState } from '@/types';
import { TOP_URL } from '@/utils/constants';
import { initialState } from '@/utils/data/initialState';
import { signIn } from 'next-auth/react';
import { useFormState } from 'react-dom';

export default function AuthCodeInputForm({ email }: { email: string }) {
  /**
   * Server Actionをラップしてemailを追加
   * 成功時はそのままログイン処理
   */
  const wrappedSendCodeAction = async (prevState: FormState, formData: FormData) => {
    formData.append('email', email);

    const result = await sendCodeAction(prevState, formData);
    // 成功時のログイン処理
    if (result.success && result.token) {
      await signIn('credentials', {
        email,
        token: result.token,
        callbackUrl: TOP_URL,
        redirect: true,
      });
    }
    return result;
  };

  const [state, formAction] = useFormState(wrappedSendCodeAction, initialState);

  return (
    <form action={formAction} className="w-full mx-auto space-y-5">
      <InputOTP maxLength={6} name="code">
        <div className="flex justify-center gap-2 mx-auto">
          <InputOTPGroup>
            {Array.from({ length: 6 }, (_, i) => (
              <InputOTPSlot
                key={i}
                index={i}
                className={`p-3 md:p-6 text-center
                  ${state?.errors?.code ? 'border-destructive' : ''}
                `}
              />
            ))}
          </InputOTPGroup>
        </div>
      </InputOTP>

      {state?.errors?.code && (
        <p className="text-sm text-destructive text-center">{state.errors.code}</p>
      )}

      <div className="text-center">
        <SubmitButton label="送信" />
      </div>
    </form>
  );
}
