'use client';

import SubmitButton from '@/components/elements/button/SubmitButton';
import FloatingLabelInput from '@/components/elements/form/input/FloatingLabelInput';
import type { AuthFormProps } from '@/features/auth/types';
import type { FloatingLabelInputProps } from '@/types';

type FormFieldConfig = Pick<FloatingLabelInputProps, 'name' | 'label' | 'type'>;

const FORM_FIELDS: Record<string, FormFieldConfig[]> = {
  'email-only': [{ name: 'email', label: 'メールアドレス', type: 'email' }],
  login: [
    { name: 'email', label: 'メールアドレス', type: 'email' },
    { name: 'password', label: 'パスワード', type: 'password' },
  ],
  signup: [
    { name: 'email', label: 'メールアドレス', type: 'email' },
    { name: 'password', label: 'パスワード', type: 'password' },
    { name: 'passwordConfirmation', label: 'パスワード（確認）', type: 'password' },
  ],
  password: [
    { name: 'password', label: 'パスワード', type: 'password' },
    { name: 'passwordConfirmation', label: 'パスワード（確認）', type: 'password' },
  ],
};

export default function AuthForm({
  formAction,
  state,
  submitButtonLabel,
  mode = 'login',
  pending,
  passwordLabel = '',
}: AuthFormProps) {
  const fields = FORM_FIELDS[mode];

  if (!fields) {
    return null;
  }

  return (
    <form action={formAction} className="space-y-5 p-5">
      {fields.map((field) => (
        <FloatingLabelInput
          key={field.name}
          name={field.name}
          label={field.name.includes('password') ? `${passwordLabel}${field.label}` : field.label}
          type={field.type}
          error={state?.errors?.[field.name]}
        />
      ))}
      <div className="pt-8">
        <SubmitButton loading={pending} label={submitButtonLabel} />
      </div>
    </form>
  );
}
