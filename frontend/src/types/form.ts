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

// インプットフォームフィールド
export interface BaseInputFieldProps extends LabelType {
  type?: HTMLInputTypeAttribute;
  placeholder?: string;
}

// セレクトフォームフィールド
export interface BaseSelectFieldProps extends LabelType {
  placeholder?: string;
  options: Option[];
}

/* ----------------------------------------------------------------
Field
------------------------------------------------------------------ */
export interface FileInputType {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

/* ----------------------------------------------------------------
関数
------------------------------------------------------------------ */
// 何か行う場合がある時の型
export interface OnClickType {
  onClick?: () => void;
}

/* ----------------------------------------------------------------
セレクト時のオプション
------------------------------------------------------------------ */
// 基本的なオプション型の定義
export interface Option {
  id: string;
  name: string;
}
