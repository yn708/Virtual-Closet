import SubmitButton from '@/components/elements/button/SubmitButton';
import FloatingLabelInputFormField from '@/components/elements/form/FloatingLabelInput';
import { Form } from '@/components/ui/form';
import type { BaseFormProps } from '@/types';
import type { FieldValues } from 'react-hook-form';

export interface AuthFormProps<T extends FieldValues> extends BaseFormProps<T> {
  submitButtonLabel: string;
  mode: 'login' | 'signup' | 'email-only' | 'password';
  passwordLabel?: string;
}

export default function AuthForm<T extends FieldValues>({
  form,
  onSubmit,
  submitButtonLabel,
  mode = 'login',
  passwordLabel = '',
}: AuthFormProps<T>) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 p-5 ">
        {mode === 'email-only' && (
          <FloatingLabelInputFormField
            form={form}
            name="email"
            label="メールアドレス"
            type="email"
          />
        )}
        {mode === 'login' && (
          <>
            <FloatingLabelInputFormField
              form={form}
              name="email"
              label="メールアドレス"
              type="email"
            />
            <FloatingLabelInputFormField
              form={form}
              name="password"
              label="パスワード"
              type="password"
            />
          </>
        )}
        {mode === 'signup' && (
          <>
            <FloatingLabelInputFormField
              form={form}
              name="email"
              label="メールアドレス"
              type="email"
            />
            <FloatingLabelInputFormField
              form={form}
              name="password"
              label="パスワード"
              type="password"
            />
            <FloatingLabelInputFormField
              form={form}
              name="passwordConfirmation"
              label="パスワード（確認）"
              type="password"
            />
          </>
        )}
        {mode === 'password' && (
          <>
            <FloatingLabelInputFormField
              form={form}
              name="password"
              label={`${passwordLabel}パスワード`}
              type="password"
            />
            <FloatingLabelInputFormField
              form={form}
              name="passwordConfirmation"
              label={`${passwordLabel}パスワード（確認）`}
              type="password"
            />
          </>
        )}
        <div className="pt-8">
          <SubmitButton loading={form.formState.isSubmitting} label={submitButtonLabel} />
        </div>
      </form>
    </Form>
  );
}
