import FloatingLabelSelect from '@/components/elements/form/select/FloatingLabelSelect';
import { Button } from '@/components/ui/button';
import type { FC } from 'react';
import { useBirthDate } from '../../hooks/useBirthDate';
import type { BirthDateFieldsProps } from '../../types';

const BirthDateFields: FC<BirthDateFieldsProps> = ({ state, onDelete, defaultBirthDate }) => {
  const { date, yearOptions, monthOptions, dayOptions, handleFieldChange, resetDate } =
    useBirthDate(defaultBirthDate);

  const handleDelete = () => {
    resetDate();
    onDelete?.();
  };
  const { year, month, day } = date;

  return (
    <div>
      <div className="grid grid-cols-4 gap-4">
        <FloatingLabelSelect
          name="birth_year"
          label="生年月日（年）"
          options={yearOptions}
          className="col-span-2"
          error={state?.errors?.birth_year}
          defaultValue={year}
          onChange={handleFieldChange('year')}
        />
        <FloatingLabelSelect
          name="birth_month"
          label="（月）"
          options={monthOptions}
          className="col-span-1"
          error={state?.errors?.birth_month}
          defaultValue={month}
          onChange={handleFieldChange('month')}
        />
        <FloatingLabelSelect
          name="birth_day"
          label="（日）"
          options={dayOptions}
          className="col-span-1"
          error={state?.errors?.birth_day}
          defaultValue={day}
          onChange={handleFieldChange('day')}
        />
      </div>
      {onDelete && year && month && day && (
        <Button type="button" variant="link" className="text-red-500" onClick={handleDelete}>
          生年月日を削除
        </Button>
      )}
    </div>
  );
};

export default BirthDateFields;
