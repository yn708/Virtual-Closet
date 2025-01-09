'use client';

import { useFloatingLabel } from '@/hooks/form/useFloatingLabel';
import { cn } from '@/lib/utils';
import { floatingLabelStyles as styles } from '@/styles/form/floatingLabel';
import type { ExtensionBaseFieldProps } from '@/types';
import ErrorMessageList from '../../error/ErrorMessageList';

interface FloatingLabelTextareaProps extends ExtensionBaseFieldProps {
  rows?: number;
}

const FloatingLabelTextarea = ({
  name,
  label,
  defaultValue,
  error,
  className,
  onChange,
  rows = 5,
}: FloatingLabelTextareaProps) => {
  const { currentValue, handleValueChange, setIsFocused, labelClassName, textareaClassName } =
    useFloatingLabel({
      defaultValue,
      value: onChange ? defaultValue : undefined,
      error,
      onChange,
    });

  return (
    <div className={cn(styles.wrapper, className)}>
      <div className={styles.container}>
        <label htmlFor={name} className={labelClassName}>
          {label}
        </label>
        <textarea
          id={name}
          name={name}
          rows={rows}
          value={currentValue}
          onChange={handleValueChange}
          className={textareaClassName}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </div>
      {error && <ErrorMessageList errors={error} />}
    </div>
  );
};

export default FloatingLabelTextarea;
