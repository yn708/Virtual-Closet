import { renderHook } from '@testing-library/react';
import type { UseFormReturn } from 'react-hook-form';
import type { ProfileEditFormData } from '../../types';
import { useBirthDateFields } from '../useBirthDateFields';

describe('useBirthDateFields', () => {
  // フォームの戻り値を保持する変数
  let watchValue: Partial<ProfileEditFormData> = {};
  let getValuesResult: Partial<ProfileEditFormData> = {};

  // モックフォームの作成
  const mockForm = {
    watch: jest.fn((field: keyof ProfileEditFormData) => watchValue[field]),
    getValues: jest.fn((field: keyof ProfileEditFormData) => getValuesResult[field]),
  } as unknown as UseFormReturn<ProfileEditFormData>;

  beforeEach(() => {
    jest.clearAllMocks();
    // テストごとに値をリセット
    watchValue = {};
    getValuesResult = {};
  });

  // 選択肢の生成をテスト
  it('should generate correct options on init', () => {
    const { result } = renderHook(() => useBirthDateFields(mockForm));

    const currentYear = new Date().getFullYear();
    expect(result.current.yearOptions[0]).toEqual({
      id: currentYear.toString(),
      name: `${currentYear}年`,
    });
    expect(result.current.monthOptions[0]).toEqual({
      id: '01',
      name: '1月',
    });
  });

  // 日付の選択肢が更新されることをテスト
  it('should update day options when year and month change', () => {
    // watchの戻り値を設定
    watchValue = {
      birth_year: '2024',
      birth_month: '2',
    };

    const { result } = renderHook(() => useBirthDateFields(mockForm));

    // 2月なので29日まで
    expect(result.current.dayOptions).toHaveLength(29);
    expect(result.current.dayOptions[0]).toEqual({
      id: '01',
      name: '1日',
    });
  });

  // getBirthDateの動作をテスト
  it('should format birth date correctly', () => {
    // getValuesの戻り値を設定
    getValuesResult = {
      birth_year: '2024',
      birth_month: '2',
      birth_day: '3',
    };

    const { result } = renderHook(() => useBirthDateFields(mockForm));
    expect(result.current.getBirthDate()).toBe('2024-02-03');
  });

  // 日付が不完全な場合のテスト
  it('should return null when date is incomplete', () => {
    // getValuesがnullを返すように設定
    getValuesResult = {
      birth_year: null,
      birth_month: null,
      birth_day: null,
    };

    const { result } = renderHook(() => useBirthDateFields(mockForm));
    expect(result.current.getBirthDate()).toBeNull();
  });
});
