import type { z } from 'zod';
import { photoCoordinateCreateFormSchema } from '../coordinate-validation';

/*----------------------------------------------------------------------------
共通のテストセットアップ
----------------------------------------------------------------------------*/
const mockFile = new File(['dummy content'], 'test-image.jpg', {
  type: 'image/jpeg',
});

// 基本的な有効データ
const baseValidData = {
  image: mockFile,
  seasons: ['spring', 'summer'],
  tastes: ['casual', 'simple'],
  scenes: ['daily', 'work'],
};

/*----------------------------------------------------------------------------
基本的なバリデーションテストケース生成関数
----------------------------------------------------------------------------*/
const createBaseValidationTests = (
  schema: z.ZodType,
  validData: typeof baseValidData,
  isCustom = false,
) => {
  describe('基本的なバリデーション', () => {
    it('有効なデータを許可する', () => {
      const result = schema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('必須項目のみでも有効', () => {
      // カスタムコーディネートの場合は items も必須
      const minimalData = {
        image: mockFile,
        ...(isCustom && { items: JSON.stringify([{ id: 1, type: 'tops' }]) }),
      };
      const result = schema.safeParse(minimalData);
      expect(result.success).toBe(true);
    });
  });

  describe('シーズンのバリデーション', () => {
    it('有効なシーズンの組み合わせを許可する', () => {
      const validSeasons = [
        ['spring'],
        ['spring', 'summer'],
        ['spring', 'summer', 'autumn', 'winter'],
      ];

      validSeasons.forEach((seasons) => {
        const result = schema.safeParse({
          ...validData,
          seasons,
        });
        expect(result.success).toBe(true);
      });
    });

    it('シーズンは未定義を許可', () => {
      const result = schema.safeParse({
        ...validData,
        seasons: undefined,
      });
      expect(result.success).toBe(true);
    });

    it('シーズンはnullを許可', () => {
      const result = schema.safeParse({
        ...validData,
        seasons: null,
      });
      expect(result.success).toBe(true);
    });
  });

  describe('テイストのバリデーション', () => {
    it('テイストは3つまで許可', () => {
      const result = schema.safeParse({
        ...validData,
        tastes: ['casual', 'simple', 'elegant'],
      });
      expect(result.success).toBe(true);
    });

    it('テイストが4つ以上は許可しない', () => {
      const result = schema.safeParse({
        ...validData,
        tastes: ['casual', 'simple', 'elegant', 'sporty'],
      });
      expect(result.success).toBe(false);
    });

    it('テイストはnullを許可', () => {
      const result = schema.safeParse({
        ...validData,
        tastes: null,
      });
      expect(result.success).toBe(true);
    });
  });

  describe('シーンのバリデーション', () => {
    it('シーンは3つまで許可', () => {
      const result = schema.safeParse({
        ...validData,
        scenes: ['daily', 'work', 'party'],
      });
      expect(result.success).toBe(true);
    });

    it('シーンが4つ以上は許可しない', () => {
      const result = schema.safeParse({
        ...validData,
        scenes: ['daily', 'work', 'party', 'date'],
      });
      expect(result.success).toBe(false);
    });

    it('シーンはnullを許可', () => {
      const result = schema.safeParse({
        ...validData,
        scenes: null,
      });
      expect(result.success).toBe(true);
    });
  });
};

/*----------------------------------------------------------------------------
写真コーディネート登録フォームのテスト
画像は必須。その他は任意入力可能。
----------------------------------------------------------------------------*/
describe('photoCoordinateCreateFormSchema', () => {
  createBaseValidationTests(photoCoordinateCreateFormSchema, baseValidData, false);

  describe('画像のバリデーション', () => {
    it('画像は必須', () => {
      const { image: _image, ...dataWithoutImage } = baseValidData;
      const result = photoCoordinateCreateFormSchema.safeParse(dataWithoutImage);
      expect(result.success).toBe(false);
    });

    it('画像はnullを許可しない', () => {
      const result = photoCoordinateCreateFormSchema.safeParse({
        ...baseValidData,
        image: null,
      });
      expect(result.success).toBe(false);
    });
  });
});
