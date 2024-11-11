import FloatingLabelSelectFormField from '@/components/elements/form/FloatingLabelSelectFormField';
import { Button } from '@/components/ui/button';
import type { FC } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { useBirthDateFields } from '../../hooks/useBirthDateFields';
import type { ProfileEditFormData } from '../../types';

interface BirthDateFieldsProps {
  form: UseFormReturn<ProfileEditFormData>;
  onDelete?: () => void;
}

export const BirthDateFields: FC<BirthDateFieldsProps> = ({ form, onDelete }) => {
  const { yearOptions, monthOptions, dayOptions } = useBirthDateFields(form);

  return (
    <div>
      <div className="grid grid-cols-4 gap-4">
        <FloatingLabelSelectFormField
          form={form}
          name="birth_year"
          label="生年月日（年）"
          options={yearOptions}
          className="col-span-2"
        />
        <FloatingLabelSelectFormField
          form={form}
          name="birth_month"
          label="（月）"
          options={monthOptions}
          className="col-span-1"
        />
        <FloatingLabelSelectFormField
          form={form}
          name="birth_day"
          label="（日）"
          options={dayOptions}
          className="col-span-1"
        />
      </div>
      {onDelete && (
        <Button type="button" variant="link" className="text-red-500" onClick={onDelete}>
          生年月日を削除
        </Button>
      )}
    </div>
  );
};
