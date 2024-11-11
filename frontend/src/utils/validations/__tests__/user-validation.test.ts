import { ProfileUpdateFormSchema } from '../user-validation';

/*----------------------------------------------------------------------------
プロフィールアップデートフォームのテスト
----------------------------------------------------------------------------*/
describe('ProfileUpdateFormSchema', () => {
  // 有効なフォームデータ
  const validFormData = {
    username: 'test user',
    name: 'test test',
    birth_year: '1990',
    birth_month: '01',
    birth_day: '01',
    gender: 'male',
    profile_image: null,
    height: '170',
  };

  it('有効なデータを許可する', () => {
    const result = ProfileUpdateFormSchema.safeParse(validFormData);
    expect(result.success).toBe(true);
  });

  it('ユーザー名のバリデーション', () => {
    // 5文字未満
    const tooShort = ProfileUpdateFormSchema.safeParse({
      ...validFormData,
      username: 'user',
    });
    expect(tooShort.success).toBe(false);

    // 30文字超過
    const tooLong = ProfileUpdateFormSchema.safeParse({
      ...validFormData,
      username: 'a'.repeat(31),
    });
    expect(tooLong.success).toBe(false);
  });

  it('名前のバリデーション', () => {
    // null許容
    const nullName = ProfileUpdateFormSchema.safeParse({
      ...validFormData,
      name: null,
    });
    expect(nullName.success).toBe(true);

    // 30文字超過
    const tooLong = ProfileUpdateFormSchema.safeParse({
      ...validFormData,
      name: 'あ'.repeat(31),
    });
    expect(tooLong.success).toBe(false);
  });

  it('生年月日のバリデーション', () => {
    // すべてnull
    const allNull = ProfileUpdateFormSchema.safeParse({
      ...validFormData,
      birth_year: null,
      birth_month: null,
      birth_day: null,
    });
    expect(allNull.success).toBe(true);

    // 部分的に入力
    const partial = ProfileUpdateFormSchema.safeParse({
      ...validFormData,
      birth_month: null,
    });
    expect(partial.success).toBe(false);
  });

  it('性別のバリデーション', () => {
    ['male', 'female', 'other', 'unanswered', ''].forEach((gender) => {
      const result = ProfileUpdateFormSchema.safeParse({
        ...validFormData,
        gender,
      });
      expect(result.success).toBe(true);
    });

    const invalid = ProfileUpdateFormSchema.safeParse({
      ...validFormData,
      gender: 'invalid',
    });
    expect(invalid.success).toBe(false);
  });

  it('身長のバリデーション', () => {
    // 有効なケース
    ['170', '180.5', '', null].forEach((height) => {
      const result = ProfileUpdateFormSchema.safeParse({
        ...validFormData,
        height,
      });
      expect(result.success).toBe(true);
    });

    // 無効なケース
    ['0', '300', 'abc', '-1'].forEach((height) => {
      const result = ProfileUpdateFormSchema.safeParse({
        ...validFormData,
        height,
      });
      expect(result.success).toBe(false);
    });
  });
});
