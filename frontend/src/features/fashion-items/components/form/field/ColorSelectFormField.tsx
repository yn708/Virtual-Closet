import BaseSheetSelectFormField from '@/components/elements/form/select/BaseSheetSelectFormField';
import { Button } from '@/components/ui/button';
import { SheetClose } from '@/components/ui/sheet';
import type { ColorSelectFieldProps } from '@/features/fashion-items/types';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const ColorSelectFormField = ({
  name,
  label,
  value: initialValue,
  error,
  options,
  onChange,
}: ColorSelectFieldProps) => {
  const [selectedValue, setSelectedValue] = useState(initialValue);

  return (
    <BaseSheetSelectFormField
      name={name}
      label={label}
      value={selectedValue}
      error={error}
      trigger={(currentValue) => {
        const selected = options.find((o) => o.id.toString() === currentValue);
        return (
          <div className="flex items-center justify-center gap-2">
            {selected ? (
              <>
                <div
                  className="size-5 rounded-full"
                  style={{ backgroundColor: selected?.color_code }}
                />
                <span>{selected?.color_name}</span>
              </>
            ) : (
              <></>
            )}
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
                <div className="flex items-center justify-center gap-2">
                  <div
                    className="size-5 rounded-full"
                    style={{ backgroundColor: option.color_code }}
                  />
                  <span className="text-sm text-center">{option.color_name}</span>
                </div>
              </Button>
            </SheetClose>
          ))}
          {/* 未選択の選択肢を設置 */}
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
    </BaseSheetSelectFormField>
  );
};

export default ColorSelectFormField;
