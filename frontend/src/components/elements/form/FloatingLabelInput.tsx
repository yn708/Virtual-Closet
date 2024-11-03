'use client';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import type { BaseFormFieldProps, BaseInputFieldProps } from '@/types';
import { useState } from 'react';
import type { FieldValues, Path } from 'react-hook-form';
import { IoEyeOffOutline, IoEyeOutline } from 'react-icons/io5';

function FloatingLabelInputFormField<T extends FieldValues>({
  form,
  name,
  label,
  type = 'text',
  placeholder,
}: BaseFormFieldProps<T> & BaseInputFieldProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <FormField
      control={form.control}
      name={name as Path<T>}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <div className="relative">
              <FormLabel
                className={cn(
                  'absolute left-4 transition-all duration-200 pointer-events-none',
                  isFocused || field.value
                    ? 'text-xs top-2 opacity-65'
                    : 'text-sm top-1/2 -translate-y-1/2 opacity-65',
                  isFocused ? 'text-blue-500' : 'text-gray-500',
                )}
              >
                {label}
              </FormLabel>
              <Input
                role={type === 'password' ? 'password-input' : 'text-input'} // テスト用
                {...field}
                type={type === 'password' && showPassword ? 'text' : type}
                className={cn(
                  'h-14 px-4 transition-all duration-200',
                  isFocused || field.value ? 'pt-6 pb-2' : 'py-3',
                  isFocused ? 'border-blue-500' : field.value ? 'border-gray-300' : '',
                  'placeholder:text-transparent focus:placeholder:text-gray-400',
                  type === 'password' ? 'pr-10' : '', // パスワードフィールドの場合、右側にスペースを作る
                )}
                placeholder={placeholder}
                onFocus={() => setIsFocused(true)}
                onBlur={() => {
                  setIsFocused(false);
                  field.onBlur();
                }}
                autoComplete={type === 'password' ? 'new-password' : ''} // autocomplete 属性
              />
              {type === 'password' && (
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  aria-label={showPassword ? 'パスワードを隠す' : 'パスワードを表示'}
                >
                  {showPassword ? <IoEyeOffOutline size={20} /> : <IoEyeOutline size={20} />}
                </button>
              )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export default FloatingLabelInputFormField;

// // 使用例
// {
//   /* <FloatingLabelInputFormField
//   control={form.control}
//   name="password"
//   label="パスワード"
//   type="password"
// /> */
// }
