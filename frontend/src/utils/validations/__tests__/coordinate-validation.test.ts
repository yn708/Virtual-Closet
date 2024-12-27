import {
  photoCoordinateCreateFormSchema,
  customCoordinateCreateFormSchema,
} from '../coordinate-validation';

/*----------------------------------------------------------------------------
写真コーディネート登録フォームのテスト
画像は必須。その他は任意入力可能。
----------------------------------------------------------------------------*/
describe('photoCoordinateCreateFormSchema', () => {
  // モックファイルの作成
  const mockFile = new File(['dummy content'], 'test-image.jpg', {
    type: 'image/jpeg',
  });

  // 有効なフォームデータ
  const validFormData = {
    image: mockFile,
    seasons: ['spring', 'summer'],
    tastes: ['casual', 'simple'],
    scenes: ['daily', 'work'],
  };

  describe('基本的なバリデーション', () => {
    it('有効なデータを許可する', () => {
      const result = photoCoordinateCreateFormSchema.safeParse(validFormData);
      expect(result.success).toBe(true);
    });

    it('必須項目のみでも有効', () => {
      const minimalData = {
        image: mockFile,
      };
      const result = photoCoordinateCreateFormSchema.safeParse(minimalData);
      expect(result.success).toBe(true);
    });
  });

  describe('画像のバリデーション', () => {
    it('画像は必須', () => {
      const { image: _image, ...dataWithoutImage } = validFormData;
      const result = photoCoordinateCreateFormSchema.safeParse(dataWithoutImage);
      expect(result.success).toBe(false);
    });

    it('画像はnullを許可しない', () => {
      const result = photoCoordinateCreateFormSchema.safeParse({
        ...validFormData,
        image: null,
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
      ];

      validSeasons.forEach((seasons) => {
        const result = photoCoordinateCreateFormSchema.safeParse({
          ...validFormData,
          seasons,
        });
        expect(result.success).toBe(true);
      });
    });

    it('シーズンは未定義を許可', () => {
      const result = photoCoordinateCreateFormSchema.safeParse({
        ...validFormData,
        seasons: undefined,
      });
      expect(result.success).toBe(true);
    });

    it('無効なシーズン値は許可しない', () => {
      const result = photoCoordinateCreateFormSchema.safeParse({
        ...validFormData,
        seasons: ['invalid_season'],
      });
      expect(result.success).toBe(false);
    });
  });

  describe('テイストのバリデーション', () => {
    it('テイストは3つまで許可', () => {
      const result = photoCoordinateCreateFormSchema.safeParse({
        ...validFormData,
        tastes: ['casual', 'simple', 'elegant'],
      });
      expect(result.success).toBe(true);
    });

    it('テイストが4つ以上は許可しない', () => {
      const result = photoCoordinateCreateFormSchema.safeParse({
        ...validFormData,
        tastes: ['casual', 'simple', 'elegant', 'sporty'],
      });
      expect(result.success).toBe(false);
    });

    it('テイストはnullを許可', () => {
      const result = photoCoordinateCreateFormSchema.safeParse({
        ...validFormData,
        tastes: null,
      });
      expect(result.success).toBe(true);
    });
  });

  describe('シーンのバリデーション', () => {
    it('シーンは3つまで許可', () => {
      const result = photoCoordinateCreateFormSchema.safeParse({
        ...validFormData,
        scenes: ['daily', 'work', 'party'],
      });
      expect(result.success).toBe(true);
    });

    it('シーンが4つ以上は許可しない', () => {
      const result = photoCoordinateCreateFormSchema.safeParse({
        ...validFormData,
        scenes: ['daily', 'work', 'party', 'date'],
      });
      expect(result.success).toBe(false);
    });

    it('シーンはnullを許可', () => {
      const result = photoCoordinateCreateFormSchema.safeParse({
        ...validFormData,
        scenes: null,
      });
      expect(result.success).toBe(true);
    });
  });
});

/*----------------------------------------------------------------------------
カスタムコーディネート登録フォームのテスト
プレビュー画像とアイテムは必須。その他は任意入力可能。
----------------------------------------------------------------------------*/
describe('customCoordinateCreateFormSchema', () => {
  // モックファイルの作成
  const mockFile = new File(['dummy content'], 'test-image.jpg', {
    type: 'image/jpeg',
  });

  // 有効なフォームデータ
  const validFormData = {
    preview_image: mockFile,
    items: JSON.stringify([{ id: 1, type: 'tops' }]),
    seasons: ['spring', 'summer'],
    tastes: ['casual', 'simple'],
    scenes: ['daily', 'work'],
  };

  describe('基本的なバリデーション', () => {
    it('有効なデータを許可する', () => {
      const result = customCoordinateCreateFormSchema.safeParse(validFormData);
      expect(result.success).toBe(true);
    });

    it('必須項目のみでも有効', () => {
      const minimalData = {
        preview_image: mockFile,
        items: JSON.stringify([{ id: 1, type: 'tops' }]),
      };
      const result = customCoordinateCreateFormSchema.safeParse(minimalData);
      expect(result.success).toBe(true);
    });
  });

  describe('プレビュー画像のバリデーション', () => {
    it('プレビュー画像は必須', () => {
      const { preview_image: _preview_image, ...dataWithoutImage } = validFormData;
      const result = customCoordinateCreateFormSchema.safeParse(dataWithoutImage);
      expect(result.success).toBe(false);
    });

    it('プレビュー画像はnullを許可しない', () => {
      const result = customCoordinateCreateFormSchema.safeParse({
        ...validFormData,
        preview_image: null,
      });
      expect(result.success).toBe(false);
    });
  });

  describe('アイテムのバリデーション', () => {
    it('アイテムは必須', () => {
      const { items: _items, ...dataWithoutItems } = validFormData;
      const result = customCoordinateCreateFormSchema.safeParse(dataWithoutItems);
      expect(result.success).toBe(false);
    });

    it('アイテムは文字列である必要がある', () => {
      const result = customCoordinateCreateFormSchema.safeParse({
        ...validFormData,
        items: [{ id: 1, type: 'tops' }], // オブジェクトそのままは許可しない
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
      ];

      validSeasons.forEach((seasons) => {
        const result = customCoordinateCreateFormSchema.safeParse({
          ...validFormData,
          seasons,
        });
        expect(result.success).toBe(true);
      });
    });

    it('シーズンは未定義を許可', () => {
      const result = customCoordinateCreateFormSchema.safeParse({
        ...validFormData,
        seasons: undefined,
      });
      expect(result.success).toBe(true);
    });

    it('無効なシーズン値は許可しない', () => {
      const result = customCoordinateCreateFormSchema.safeParse({
        ...validFormData,
        seasons: ['invalid_season'],
      });
      expect(result.success).toBe(false);
    });
  });

  describe('テイストのバリデーション', () => {
    it('テイストは3つまで許可', () => {
      const result = customCoordinateCreateFormSchema.safeParse({
        ...validFormData,
        tastes: ['casual', 'simple', 'elegant'],
      });
      expect(result.success).toBe(true);
    });

    it('テイストが4つ以上は許可しない', () => {
      const result = customCoordinateCreateFormSchema.safeParse({
        ...validFormData,
        tastes: ['casual', 'simple', 'elegant', 'sporty'],
      });
      expect(result.success).toBe(false);
    });

    it('テイストはnullを許可', () => {
      const result = customCoordinateCreateFormSchema.safeParse({
        ...validFormData,
        tastes: null,
      });
      expect(result.success).toBe(true);
    });
  });

  describe('シーンのバリデーション', () => {
    it('シーンは3つまで許可', () => {
      const result = customCoordinateCreateFormSchema.safeParse({
        ...validFormData,
        scenes: ['daily', 'work', 'party'],
      });
      expect(result.success).toBe(true);
    });

    it('シーンが4つ以上は許可しない', () => {
      const result = customCoordinateCreateFormSchema.safeParse({
        ...validFormData,
        scenes: ['daily', 'work', 'party', 'date'],
      });
      expect(result.success).toBe(false);
    });

    it('シーンはnullを許可', () => {
      const result = customCoordinateCreateFormSchema.safeParse({
        ...validFormData,
        scenes: null,
      });
      expect(result.success).toBe(true);
    });
  });
});
