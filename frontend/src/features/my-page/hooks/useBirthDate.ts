import type { SelectOption } from '@/types';

import {
  generateDayOptions,
  generateMonthOptions,
  generateYearOptions,
} from '@/utils/profileUtils';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { BirthDateState } from '../types';

export const useBirthDate = (defaultBirthDate?: string) => {
  const [date, setDate] = useState<BirthDateState>(() => {
    if (!defaultBirthDate) return {};
    const [year, month, day] = defaultBirthDate.split('-');
    return { year, month, day };
  });

  const yearOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return generateYearOptions(1900, currentYear);
  }, []);

  const monthOptions = useMemo(() => generateMonthOptions(), []);

  const [dayOptions, setDayOptions] = useState<SelectOption[]>([]);

  const updateDayOptions = useCallback(
    (year?: string, month?: string) => {
      if (year && month) {
        const newDayOptions = generateDayOptions(parseInt(year), parseInt(month));
        setDayOptions(newDayOptions);

        if (date.day && parseInt(date.day) > newDayOptions.length) {
          setDate((prev) => ({ ...prev, day: undefined }));
        }
      }
    },
    [date.day],
  );

  useEffect(() => {
    updateDayOptions(date.year, date.month);
  }, [date.year, date.month, updateDayOptions]);

  const handleFieldChange = (field: keyof BirthDateState) => (value?: string) => {
    setDate((prev) => ({ ...prev, [field]: value }));
  };

  const resetDate = () => {
    setDate({ year: '', month: '', day: '' });
  };

  return {
    date,
    yearOptions,
    monthOptions,
    dayOptions,
    handleFieldChange,
    resetDate,
  };
};
