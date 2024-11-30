'use client';

import { Input } from '@/components/ui/input';
import { useFloatingLabel } from '@/hooks/form/useFloatingLabel';
import { cn } from '@/lib/utils';
import { floatingLabelStyles as styles } from '@/styles/form/floating-label';
import type { FloatingLabelInputProps } from '@/types';
import { useState } from 'react';
import { IoEyeOffOutline, IoEyeOutline } from 'react-icons/io5';
import ErrorMessageList from '../../error/ErrorMessageList';

const FloatingLabelInput = ({
  name,
  label,
  defaultValue,
  error,
  type = 'text',
  className,
  onChange,
}: FloatingLabelInputProps) => {
  const { currentValue, handleValueChange, setIsFocused, labelClassName, inputClassName } =
    useFloatingLabel({
      defaultValue,
      value: onChange ? defaultValue : undefined,
      error,
      onChange,
    });

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={cn(styles.wrapper, className)}>
      <div className={styles.container}>
        <label htmlFor={name} className={labelClassName}>
          {label}
        </label>
        <Input
          role={type === 'password' ? 'password-input' : 'text-input'}
          id={name}
          name={name}
          type={type === 'password' && showPassword ? 'text' : type}
          value={currentValue}
          onChange={handleValueChange}
          className={cn(inputClassName, type === 'password' && styles.input.password)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          autoComplete={type === 'password' ? 'new-password' : ''}
        />
        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className={styles.passwordToggle}
            aria-label={showPassword ? 'パスワードを隠す' : 'パスワードを表示'}
          >
            {showPassword ? <IoEyeOffOutline size={20} /> : <IoEyeOutline size={20} />}
          </button>
        )}
      </div>
      {error && <ErrorMessageList errors={error} />}
    </div>
  );
};
export default FloatingLabelInput;
