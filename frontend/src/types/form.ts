import type { ClassNameType } from './common';
/* ----------------------------------------------------------------
Base
------------------------------------------------------------------ */
// フィールドベース
export interface BaseFieldProps {
  name: string;
  label: string;
  defaultValue?: string;
  error?: string[] | undefined;
  onChange?: (value: string) => void;
}

/* ----------------------------------------------------------------
Input field
------------------------------------------------------------------ */
export interface FloatingLabelInputProps extends BaseFieldProps, ClassNameType {
  type?: 'text' | 'password' | 'email' | 'number';
}

export interface FileInputType {
  name?: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

/* ----------------------------------------------------------------
select field
------------------------------------------------------------------ */
export interface FloatingLabelSelectProps extends BaseFieldProps, ClassNameType {
  options: SelectOption[];
}

// 基本的なオプション型の定義
export interface SelectOption {
  id: number | string;
  name: string;
}
