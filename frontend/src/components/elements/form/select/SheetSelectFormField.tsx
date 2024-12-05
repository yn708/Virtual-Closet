'use client';

import { Button } from '@/components/ui/button';
import { SheetClose } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import type { BaseOption, SheetSelectFieldProps } from '@/types';
import { useState } from 'react';
import BaseSheetSelectField from './BaseSheetSelectFormField';

const SheetSelectField = <T extends BaseOption>({
  name,
  label,
  value: initialValue,
  error,
  options,
  labelKey,
  onChange,
}: SheetSelectFieldProps<T>) => {
  const [selectedValue, setSelectedValue] = useState(initialValue);

  return (
    <BaseSheetSelectField
      name={name}
      label={label}
      value={selectedValue}
      error={error}
      trigger={(currentValue) => {
        const selected = options.find((o) => o.id.toString() === currentValue);
        return (
          <div className="flex items-center justify-center">
            {selected && <span className="text-foreground">{String(selected[labelKey])}</span>}
          </div>
        );
      }}
    >
      {({ onChange: fieldOnChange }) => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {options.map((option) => (
            <SheetClose asChild key={option.id}>
              <Button
                variant="outline"
                className={cn(
                  'justify-center',
                  selectedValue === option.id.toString() && 'border-2 border-primary bg-primary/5',
                )}
                onClick={() => {
                  const newValue = option.id.toString();
                  setSelectedValue(newValue);
                  fieldOnChange(newValue);
                  onChange?.(newValue);
                }}
              >
                {String(option[labelKey])}
              </Button>
            </SheetClose>
          ))}

          <SheetClose asChild>
            <Button
              variant="outline"
              className="justify-center bg-gray-50 dark:bg-gray-950"
              onClick={() => {
                setSelectedValue('');
                fieldOnChange('');
                onChange?.('');
              }}
            >
              未選択
            </Button>
          </SheetClose>
        </div>
      )}
    </BaseSheetSelectField>
  );
};

export default SheetSelectField;
