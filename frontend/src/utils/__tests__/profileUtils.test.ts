import {
  calculateAge,
  generateDayOptions,
  generateMonthOptions,
  generateYearOptions,
} from '../profileUtils';

describe('dateUtils', () => {
  /*----------------------------------------------------------------------------
    世代計算のテスト
    ----------------------------------------------------------------------------*/
  describe('calculateAge', () => {
    // テスト用の現在日付をモック
    beforeAll(() => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2024-01-01'));
    });

    afterAll(() => {
      jest.useRealTimers();
    });

    // 正常なケースで世代が正しく計算されることを確認
    it('should calculate generation correctly', () => {
      expect(calculateAge('1995-01-01')).toBe("20's");
      expect(calculateAge('1985-12-31')).toBe("30's");
      expect(calculateAge('1975-06-15')).toBe("40's");
    });

    // null または undefined の場合に null を返すことを確認
    it('should return null for invalid dates', () => {
      expect(calculateAge(null)).toBeNull();
      expect(calculateAge(undefined)).toBeNull();
    });
  });

  /*----------------------------------------------------------------------------
    年の選択肢生成のテスト
    ----------------------------------------------------------------------------*/
  describe('generateYearOptions', () => {
    // 正しい範囲で年の選択肢が生成されることを確認
    it('should generate year options in correct range', () => {
      const options = generateYearOptions(2020, 2023);

      expect(options).toHaveLength(4);
      expect(options[0]).toEqual({ id: '2023', name: '2023年' });
      expect(options[3]).toEqual({ id: '2020', name: '2020年' });
    });

    // 単年の場合も正しく生成されることを確認
    it('should handle single year range', () => {
      const options = generateYearOptions(2023, 2023);

      expect(options).toHaveLength(1);
      expect(options[0]).toEqual({ id: '2023', name: '2023年' });
    });
  });

  /*----------------------------------------------------------------------------
    月の選択肢生成のテスト
    ----------------------------------------------------------------------------*/
  describe('generateMonthOptions', () => {
    // 12ヶ月分の選択肢が正しく生成されることを確認
    it('should generate all month options correctly', () => {
      const options = generateMonthOptions();

      expect(options).toHaveLength(12);
      expect(options[0]).toEqual({ id: '01', name: '1月' });
      expect(options[8]).toEqual({ id: '09', name: '9月' });
      expect(options[11]).toEqual({ id: '12', name: '12月' });
    });

    // IDが2桁でパディングされることを確認
    it('should pad month IDs with zero', () => {
      const options = generateMonthOptions();
      options.slice(0, 9).forEach((option) => {
        expect(option.id).toMatch(/^0\d$/);
      });
    });
  });

  /*----------------------------------------------------------------------------
    日の選択肢生成のテスト
    ----------------------------------------------------------------------------*/
  describe('generateDayOptions', () => {
    // 31日ある月で正しく生成されることを確認
    it('should generate correct days for months with 31 days', () => {
      const options = generateDayOptions(2023, 12);

      expect(options).toHaveLength(31);
      expect(options[0]).toEqual({ id: '01', name: '1日' });
      expect(options[30]).toEqual({ id: '31', name: '31日' });
    });

    // 2月の通常年（28日）で正しく生成されることを確認
    it('should handle February in non-leap year', () => {
      const options = generateDayOptions(2023, 2);
      expect(options).toHaveLength(28);
    });

    // 2月の閏年（29日）で正しく生成されることを確認
    it('should handle February in leap year', () => {
      const options = generateDayOptions(2024, 2);
      expect(options).toHaveLength(29);
    });

    // IDが2桁でパディングされることを確認
    it('should pad day IDs with zero', () => {
      const options = generateDayOptions(2023, 1);
      options.slice(0, 9).forEach((option) => {
        expect(option.id).toMatch(/^0\d$/);
      });
    });
  });
});
