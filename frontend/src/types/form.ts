import type { HTMLInputTypeAttribute } from 'react';
import type { FieldValues, Path, SubmitHandler, UseFormReturn } from 'react-hook-form';
import type { LabelType } from './common';

/* ----------------------------------------------------------------
Base
------------------------------------------------------------------ */
export interface BaseFormProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  onSubmit: SubmitHandler<T>;
}

export interface BaseFormFieldProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  name: string | Path<T>;
}

export interface BaseInputFieldProps extends LabelType {
  type?: HTMLInputTypeAttribute;
  placeholder?: string;
}

/* ----------------------------------------------------------------
Field
------------------------------------------------------------------ */
export interface FileInputType {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

// 何か行う場合がある時の型
export interface OnClickType {
  onClick?: () => void;
}
