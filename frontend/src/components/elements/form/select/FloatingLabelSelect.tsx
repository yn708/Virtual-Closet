'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useFloatingLabel } from '@/hooks/form/useFloatingLabel';
import { cn } from '@/lib/utils';
import { floatingLabelStyles as styles } from '@/styles/form/floating-label';
import type { FloatingLabelSelectProps } from '@/types';
import ErrorMessageList from '../../error/ErrorMessageList';

const FloatingLabelSelect = ({
  name,
  label,
  defaultValue,
  error,
  options,
  className,
  onChange,
}: FloatingLabelSelectProps) => {
  const { currentValue, handleValueChange, setIsFocused, labelClassName, inputClassName } =
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
        <input type="hidden" name={name} value={currentValue || ''} />
        <Select value={currentValue} onValueChange={handleValueChange} onOpenChange={setIsFocused}>
          <SelectTrigger id={name} className={inputClassName}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.id} value={option.id.toString()}>
                {option.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {error && <ErrorMessageList errors={error} />}
    </div>
  );
};

export default FloatingLabelSelect;
