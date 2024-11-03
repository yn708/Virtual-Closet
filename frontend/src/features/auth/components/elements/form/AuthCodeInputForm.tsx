import SubmitButton from '@/components/elements/button/SubmitButton';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import useAuthCodeForm from '@/features/auth/hooks/useAuthCodeForm';
import type { EmailType } from '@/features/auth/types';
import ResendCodeContent from '../content/ResendCodeContent';

export default function AuthCodeInputForm({ email }: EmailType) {
  const { form, onSubmit } = useAuthCodeForm(email);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 ">
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <InputOTP maxLength={6} {...field}>
                  <InputOTPGroup>
                    {[...Array(6)].map((_, i) => (
                      <InputOTPSlot key={i} index={i} />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormMessage />

              <p className="text-xs text-red-600 pt-3">
                ※ 全角数字は入力できません / 有効期限は20分です
              </p>
            </FormItem>
          )}
        />
        <div className="flex justify-between pt-6">
          <ResendCodeContent email={email} />
          <SubmitButton
            className="sm:w-auto px-20"
            loading={form.formState.isSubmitting}
            label="送信"
          />
        </div>
      </form>
    </Form>
  );
}
