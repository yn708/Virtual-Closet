import BaseSheetSelectFormField from '@/components/elements/form/select/BaseSheetSelectFormField';
import type { BrandSelectFieldProps } from '@/features/fashion-items/types';
import { useState } from 'react';
import BrandContent from '../../content/BrandContent';

const BrandSelectFormField = ({
  name,
  label,
  value: initialValue,
  error,
  options,
  onChange,
}: BrandSelectFieldProps) => {
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
          <>
            {selected && (
              <>
                <span className="mr-2 font-medium">{selected.brand_name}</span>
                <span className="text-[10px] text-gray-500 opacity-70">
                  {selected.brand_name_kana}
                </span>
              </>
            )}
          </>
        );
      }}
    >
      {({ value, onChange: fieldOnChange }) => (
        <BrandContent
          selectedValue={value}
          onValueChange={(newValue) => {
            setSelectedValue(newValue);
            fieldOnChange(newValue);
            onChange?.(newValue);
          }}
          initialOptions={options}
        />
      )}
    </BaseSheetSelectFormField>
  );
};

export default BrandSelectFormField;
