'use client';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import type { BaseFormFieldProps, BaseSelectFieldProps, ClassNameType } from '@/types';
import { useState } from 'react';
import type { FieldValues, Path } from 'react-hook-form';

function FloatingLabelSelectFormField<T extends FieldValues>({
  form,
  name,
  label,
  placeholder,
  options,
  className,
}: BaseFormFieldProps<T> & BaseSelectFieldProps & ClassNameType) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <FormField
      control={form.control}
      name={name as Path<T>}
      render={({ field }) => (
        <FormItem className={className}>
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
              <Select
                onValueChange={field.onChange}
                value={field.value || undefined}
                onOpenChange={(open) => setIsFocused(open)}
              >
                <SelectTrigger
                  className={cn(
                    'h-14 px-4 transition-all duration-200',
                    isFocused || field.value ? 'pt-6 pb-2' : 'py-3',
                    isFocused ? 'border-blue-500' : field.value ? 'border-gray-300' : '',
                    'placeholder:text-transparent focus:placeholder:text-gray-400',
                  )}
                >
                  <SelectValue placeholder={placeholder} />
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
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export default FloatingLabelSelectFormField;
