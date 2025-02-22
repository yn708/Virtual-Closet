import {
  fashionItemCreateFormSchema,
  fashionItemUpdateFormSchema,
} from '../fashion-item-validation';

/*----------------------------------------------------------------------------
ファッションアイテム登録フォームのテスト
サブカテゴリ、画像は必須。その他は任意入力可能。
----------------------------------------------------------------------------*/
describe('fashionItemCreateFormSchema', () => {
  // モックファイルの作成
  const mockFile = new File(['dummy content'], 'test-image.jpg', {
    type: 'image/jpeg',
  });

  // 有効なフォームデータ
  const validFormData = {
    sub_category: 'tops',
    brand: 'test brand',
    seasons: ['spring', 'summer'],
    design: 'casual',
    price_range: '1000-3000',
    main_color: 'black',
    image: mockFile,
    is_owned: true,
    is_old_clothes: false,
  };

  describe('サブカテゴリのバリデーション', () => {
    it('空文字列は許可しない', () => {
      const result = fashionItemCreateFormSchema.safeParse({
        ...validFormData,
        sub_category: '',
      });
      expect(result.success).toBe(false);
    });

    it('nullは許可しない', () => {
      const result = fashionItemCreateFormSchema.safeParse({
        ...validFormData,
        sub_category: null,
      });
      expect(result.success).toBe(false);
    });
  });

  describe('シーズンのバリデーション', () => {
    it('有効なシーズンの組み合わせを許可する', () => {
      const validSeasons = [
        ['spring'],
        ['spring', 'summer'],
        ['spring', 'summer', 'autumn', 'winter'],
        [], // 空配列も許可
      ];

      validSeasons.forEach((seasons) => {
        const result = fashionItemCreateFormSchema.safeParse({
          ...validFormData,
          seasons,
        });
        expect(result.success).toBe(true);
      });
    });

    it('無効なシーズン値は許可しない', () => {
      const result = fashionItemCreateFormSchema.safeParse({
        ...validFormData,
        seasons: ['invalid_season'],
      });
      expect(result.success).toBe(false);
    });
  });

  describe('任意項目のバリデーション', () => {
    it('ブランドはnullable', () => {
      const result = fashionItemCreateFormSchema.safeParse({
        ...validFormData,
        brand: null,
      });
      expect(result.success).toBe(true);
    });

    it('デザインはnullable', () => {
      const result = fashionItemCreateFormSchema.safeParse({
        ...validFormData,
        design: null,
      });
      expect(result.success).toBe(true);
    });

    it('価格帯はnullable', () => {
      const result = fashionItemCreateFormSchema.safeParse({
        ...validFormData,
        price_range: null,
      });
      expect(result.success).toBe(true);
    });

    it('メインカラーはnullable', () => {
      const result = fashionItemCreateFormSchema.safeParse({
        ...validFormData,
        main_color: null,
      });
      expect(result.success).toBe(true);
    });
  });

  describe('画像のバリデーション', () => {
    it('画像は必須', () => {
      const result = fashionItemCreateFormSchema.safeParse({
        ...validFormData,
        image: null,
      });
      expect(result.success).toBe(false);
    });
  });

  describe('所持状態のバリデーション', () => {
    it('is_ownedはboolean型のみ許可', () => {
      const result = fashionItemCreateFormSchema.safeParse({
        ...validFormData,
        is_owned: 'true', // 文字列は許可しない
      });
      expect(result.success).toBe(false);
    });

    it('is_old_clothesはboolean型のみ許可', () => {
      const result = fashionItemCreateFormSchema.safeParse({
        ...validFormData,
        is_old_clothes: 'false', // 文字列は許可しない
      });
      expect(result.success).toBe(false);
    });
  });
});

/*----------------------------------------------------------------------------
ファッションアイテム更新フォームのテスト
すべての項目が任意入力
----------------------------------------------------------------------------*/
describe('fashionItemUpdateFormSchema', () => {
  // モックファイルの作成
  const mockFile = new File(['dummy content'], 'test-image.jpg', {
    type: 'image/jpeg',
  });

  // 有効なフォームデータ（全項目入力）
  const validFormData = {
    sub_category: 'tops',
    brand: 'test brand',
    seasons: ['spring', 'summer'],
    design: 'casual',
    price_range: '1000-3000',
    main_color: 'black',
    image: mockFile,
    is_owned: true,
    is_old_clothes: false,
  };

  describe('シーズンのバリデーション', () => {
    it('有効なシーズンの組み合わせを許可する', () => {
      const validSeasons = [
        ['spring'],
        ['spring', 'summer'],
        ['spring', 'summer', 'autumn', 'winter'],
      ];

      validSeasons.forEach((seasons) => {
        const result = fashionItemUpdateFormSchema.safeParse({
          ...validFormData,
          seasons,
        });
        expect(result.success).toBe(true);
      });
    });

    it('seasonsが未定義でも有効', () => {
      const result = fashionItemUpdateFormSchema.safeParse({
        ...validFormData,
        seasons: undefined,
      });
      expect(result.success).toBe(true);
    });

    it('無効なシーズン値は許可しない', () => {
      const result = fashionItemUpdateFormSchema.safeParse({
        ...validFormData,
        seasons: ['invalid_season'],
      });
      expect(result.success).toBe(false);
    });
  });

  describe('所持状態のバリデーション', () => {
    it('is_ownedはboolean型のみ許可', () => {
      const result = fashionItemUpdateFormSchema.safeParse({
        ...validFormData,
        is_owned: 'true', // 文字列は許可しない
      });
      expect(result.success).toBe(false);
    });

    it('is_old_clothesはboolean型のみ許可', () => {
      const result = fashionItemUpdateFormSchema.safeParse({
        ...validFormData,
        is_old_clothes: 'false', // 文字列は許可しない
      });
      expect(result.success).toBe(false);
    });

    it('is_owned は必須', () => {
      const { is_owned: _is_owned, ...dataWithoutIsOwned } = validFormData;
      const result = fashionItemUpdateFormSchema.safeParse(dataWithoutIsOwned);
      expect(result.success).toBe(false);
    });
    it('is_old_clothes は必須', () => {
      const { is_old_clothes: _is_old_clothes, ...dataWithoutIsOldClothes } = validFormData;
      const result = fashionItemUpdateFormSchema.safeParse(dataWithoutIsOldClothes);
      expect(result.success).toBe(false);
    });
  });
});
