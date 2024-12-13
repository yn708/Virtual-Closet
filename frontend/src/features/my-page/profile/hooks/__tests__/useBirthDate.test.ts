import {
  generateDayOptions,
  generateMonthOptions,
  generateYearOptions,
} from '@/utils/profileUtils';
import { act, renderHook } from '@testing-library/react';
import { useBirthDate } from '../useBirthDate';

// Mock profile utilities
jest.mock('@/utils/profileUtils', () => ({
  generateYearOptions: jest.fn(),
  generateMonthOptions: jest.fn(),
  generateDayOptions: jest.fn(),
}));

describe('useBirthDate', () => {
  // デフォルトのモック値を設定し、各テスト前にリセットする
  beforeEach(() => {
    jest.clearAllMocks();
    (generateYearOptions as jest.Mock).mockReturnValue([
      { value: '2000', label: '2000' },
      { value: '2001', label: '2001' },
    ]);
    (generateMonthOptions as jest.Mock).mockReturnValue([
      { value: '1', label: 'January' },
      { value: '2', label: 'February' },
    ]);
    (generateDayOptions as jest.Mock).mockReturnValue([
      { value: '1', label: '1' },
      { value: '2', label: '2' },
    ]);
  });

  describe('Initialization', () => {
    it('should initialize with empty state when no default value is provided', () => {
      // デフォルト値が指定されていない場合、初期状態が空であることを確認
      const { result } = renderHook(() => useBirthDate());

      expect(result.current.date).toEqual({});
      expect(generateYearOptions).toHaveBeenCalled();
      expect(generateMonthOptions).toHaveBeenCalled();
      expect(generateDayOptions).not.toHaveBeenCalled();
    });

    it('should initialize with provided default date', () => {
      // デフォルト値が指定されている場合、その値で初期化されることを確認
      const { result } = renderHook(() => useBirthDate('2000-01-01'));

      expect(result.current.date).toEqual({
        year: '2000',
        month: '01',
        day: '01',
      });
    });
  });

  describe('Field Updates', () => {
    it('should update year field correctly', () => {
      // 年フィールドを更新し、正しく反映されることを確認
      const { result } = renderHook(() => useBirthDate());

      act(() => {
        result.current.handleFieldChange('year')('2000');
      });

      expect(result.current.date.year).toBe('2000');
      expect(generateDayOptions).not.toHaveBeenCalled();
    });

    it('should update month field and trigger day options update', () => {
      // 月フィールドを更新し、日付オプションが更新されることを確認
      const { result } = renderHook(() => useBirthDate());

      act(() => {
        result.current.handleFieldChange('year')('2000');
        result.current.handleFieldChange('month')('01');
      });

      expect(result.current.date.month).toBe('01');
      expect(generateDayOptions).toHaveBeenCalledWith(2000, 1);
    });

    it('should update day field within valid range', () => {
      (generateDayOptions as jest.Mock).mockReturnValueOnce(
        Array.from({ length: 31 }, (_, i) => ({
          value: `${i + 1}`.padStart(2, '0'),
          label: `${i + 1}`,
        })),
      );

      const { result } = renderHook(() => useBirthDate());

      act(() => {
        result.current.handleFieldChange('year')('2000');
        result.current.handleFieldChange('month')('01');
        result.current.handleFieldChange('day')('15'); // 15日を選択
      });

      expect(result.current.date.day).toBe('15'); // 正しいか確認
    });
  });

  describe('Date Validation', () => {
    it('should handle invalid date when switching months', () => {
      // 31日まである月から28日までの月に変更した際、無効な日付が削除されることを確認
      (generateDayOptions as jest.Mock).mockReturnValueOnce(
        Array.from({ length: 31 }, (_, i) => ({
          value: String(i + 1),
          label: String(i + 1),
        })),
      );

      const { result } = renderHook(() => useBirthDate('2000-01-31'));

      (generateDayOptions as jest.Mock).mockReturnValueOnce(
        Array.from({ length: 28 }, (_, i) => ({
          value: String(i + 1),
          label: String(i + 1),
        })),
      );

      act(() => {
        result.current.handleFieldChange('month')('02');
      });

      expect(result.current.date.day).toBeUndefined();
    });

    it('should update day options when year and month are selected', () => {
      // 年と月が選択された際に、日付オプションが更新されることを確認
      const { result } = renderHook(() => useBirthDate());

      act(() => {
        result.current.handleFieldChange('year')('2000');
        result.current.handleFieldChange('month')('02');
      });

      expect(generateDayOptions).toHaveBeenCalledWith(2000, 2);
    });
  });

  describe('Reset Functionality', () => {
    it('should reset all date fields to empty state', () => {
      // 全てのフィールドがリセットされ、空の状態になることを確認
      const { result } = renderHook(() => useBirthDate('2000-01-01'));

      act(() => {
        result.current.resetDate();
      });

      expect(result.current.date).toEqual({
        year: '',
        month: '',
        day: '',
      });
    });
  });
});
