import type { InputHTMLAttributes } from 'react';
import type { FormState } from './actions';
import type { ClassNameType } from './common';
/* ----------------------------------------------------------------
Base
------------------------------------------------------------------ */
export interface BaseFieldProps {
  name: string;
  label: string;
  error?: string[] | undefined;
}

export interface ExtensionBaseFieldProps extends BaseFieldProps, ClassNameType {
  defaultValue?: string;
  onChange?: (value: string) => void;
}

export interface FieldValueProps {
  value?: string;
  onChange?: (value: string) => void;
}

export interface BaseOption {
  id: string;
  name: string;
  [key: string]: string | number;
}

export interface BaseFieldsStateProps {
  isProcessing?: boolean;
  state: FormState;
}

/* ----------------------------------------------------------------
Input field
------------------------------------------------------------------ */

export interface FloatingLabelInputProps extends ExtensionBaseFieldProps {
  type?: 'text' | 'password' | 'email' | 'number';
}

export interface FileInputType {
  name?: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: string; // 検索入力値
  onChange: (value: string) => void; // 入力値変更時のコールバック
  containerClassName?: string; // 入力フィールドのコンテナに適用するクラス
  onClear?: () => void; // onClearがある場合、クリアボタンを表示
}

/* ----------------------------------------------------------------
select field
------------------------------------------------------------------ */
export interface FloatingLabelSelectProps extends ExtensionBaseFieldProps {
  options: BaseOption[];
}

export interface BaseSheetSelectFieldProps extends BaseFieldProps {
  value?: string;
  trigger: (value: string | undefined) => React.ReactNode;
  children: (props: { value?: string; onChange: (value: string) => void }) => React.ReactNode;
}

export interface SheetSelectFieldProps<T extends BaseOption>
  extends BaseFieldProps,
    FieldValueProps {
  options: T[];
  labelKey: keyof T;
}

/* ----------------------------------------------------------------
Checkbox field
------------------------------------------------------------------ */
export interface CheckboxProps extends BaseFieldProps {
  defaultChecked?: boolean;
}

/* ----------------------------------------------------------------
ToggleGroup field
------------------------------------------------------------------ */
export interface ToggleGroupFieldProps<T extends BaseOption> extends BaseFieldProps {
  options: T[];
  labelKey: keyof T;
  defaultValue?: string[];
}

// AccordionToggleGroupField
export interface SelectionGroup {
  name: string;
  label: string;
  options: BaseOption[];
  labelKey: string;
  maxSelections?: number;
  error?: string[];
  defaultValue?: string[];
}

export interface AccordionToggleGroupFieldProps {
  groups: SelectionGroup[];
}

export interface AccordionToggleGroupLabel {
  selections: string[] | null;
  message: string | null;
  count: string | null;
}

/* ----------------------------------------------------------------
Image field
------------------------------------------------------------------ */
export interface ImageFieldProps {
  preview?: string | null;
  isProcessing?: boolean;
  error?: string[] | undefined;
}
