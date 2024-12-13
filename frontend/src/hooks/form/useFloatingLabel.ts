import { cn } from '@/lib/utils';
import { floatingLabelStyles as styles } from '@/styles/form/floatingLabel';
import { useState } from 'react';

interface UseFloatingLabelProps {
  defaultValue?: string;
  value?: string;
  error?: string | string[];
  onChange?: (value: string) => void;
}

export function useFloatingLabel({
  defaultValue = '',
  value,
  error,
  onChange,
}: UseFloatingLabelProps) {
  // 内部状態で値を管理
  // valueがnullの場合は空文字に変換
  const safeValue = value ?? '';
  const safeDefaultValue = defaultValue ?? '';
  const [internalValue, setInternalValue] = useState(safeDefaultValue);
  const [isFocused, setIsFocused] = useState(false);

  // 実際の値として使用する値
  const currentValue = onChange ? safeValue : internalValue;

  const hasValue = !!currentValue;

  const handleValueChange = (newValue: string | React.ChangeEvent<HTMLInputElement>) => {
    const updatedValue = typeof newValue === 'string' ? newValue : newValue.target.value;

    // onChangeがある場合は親コンポーネントに通知
    if (onChange) {
      onChange(updatedValue);
    } else {
      // onChangeがない場合は内部状態を更新
      setInternalValue(updatedValue);
    }
  };

  const labelClassName = cn(
    styles.label,
    isFocused || hasValue ? styles.labelState.active : styles.labelState.inactive,
    isFocused ? styles.labelColor.focused : styles.labelColor.default,
    error && styles.labelColor.error,
  );

  const inputClassName = cn(
    styles.input.base,
    isFocused || hasValue ? styles.input.state.active : styles.input.state.inactive,
    isFocused ? styles.input.border.focused : hasValue && styles.input.border.default,
    error && styles.input.border.error,
  );

  return {
    currentValue,
    handleValueChange,
    setIsFocused,
    labelClassName,
    inputClassName,
  };
}
