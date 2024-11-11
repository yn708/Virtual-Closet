'use client';
import type { Option } from '@/types';
import {
  generateDayOptions,
  generateMonthOptions,
  generateYearOptions,
} from '@/utils/profileUtils';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import type { ProfileEditFormData } from '../types';

export const useBirthDateFields = (form: UseFormReturn<ProfileEditFormData>) => {
  // 年,月の選択肢をメモ化(マウント時に一度だけ計算)
  const yearOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return generateYearOptions(1900, currentYear);
  }, []);
  const monthOptions = useMemo(() => generateMonthOptions(), []);

  // 日の選択肢の状態を管理(年、月によって異なるため、状態管理を使用)
  const [dayOptions, setDayOptions] = useState<Option[]>([]);

  // 年と月に基づいて日の選択肢を更新する関数
  const updateDayOptions = useCallback(
    (year: string | null | undefined, month: string | null | undefined) => {
      if (year && month) {
        setDayOptions(generateDayOptions(parseInt(year), parseInt(month)));
      }
    },
    [],
  );

  // 年または月が変更されたときに日の選択肢を更新
  const watchBirthYear = form.watch('birth_year');
  const watchBirthMonth = form.watch('birth_month');

  useEffect(() => {
    updateDayOptions(watchBirthYear, watchBirthMonth);
  }, [watchBirthYear, watchBirthMonth, updateDayOptions]);

  // フォームから生年月日を取得し、フォーマットする関数
  const getBirthDate = useCallback(() => {
    const year = form.getValues('birth_year');
    const month = form.getValues('birth_month');
    const day = form.getValues('birth_day');
    if (year && month && day) {
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
    return null;
  }, [form]);

  return {
    yearOptions,
    monthOptions,
    dayOptions,
    getBirthDate,
  };
};
