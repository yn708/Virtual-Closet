import BaseSheetSelectFormField from '@/components/elements/form/select/BaseSheetSelectFormField';
import type { BrandSelectFieldProps } from '@/features/fashion-items/types';
import type { Brand } from '@/types';
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
  const [selectedValue, setSelectedValue] = useState<Brand | undefined>(initialValue);
  const fieldValue = selectedValue?.id;

  return (
    <BaseSheetSelectFormField
      name={name}
      label={label}
      value={fieldValue}
      error={error}
      trigger={() => {
        return (
          <>
            {selectedValue && (
              <>
                <span className="mr-2 font-medium">{selectedValue.brand_name}</span>
                <span className="text-[10px] text-gray-500 opacity-70">
                  {selectedValue.brand_name_kana}
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
            setSelectedValue(newValue as Brand);
            fieldOnChange(newValue as string);
            onChange?.(newValue);
          }}
          initialOptions={options}
        />
      )}
    </BaseSheetSelectFormField>
  );
};

export default BrandSelectFormField;
