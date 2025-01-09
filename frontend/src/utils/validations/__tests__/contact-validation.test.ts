import { anonymousContactSchema, authenticatedContactSchema } from '../contact-validation';

describe('Contact Form Schemas', () => {
  // 有効なデータのテストケース用の共通データ
  const validBaseData = {
    subject: 'お問い合わせ',
    message: 'これは10文字以上のテストメッセージです。',
    privacyAgreed: true,
  };

  describe('anonymousContactSchema', () => {
    // 正常系テスト
    it('有効なデータで正しくバリデーションが通ること', () => {
      const validData = {
        ...validBaseData,
        name: 'テスト太郎',
        email: 'test@example.com',
      };

      const result = anonymousContactSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    // 名前のバリデーション
    describe('name field', () => {
      it('空の場合エラーとなること', () => {
        const invalidData = {
          ...validBaseData,
          name: '',
          email: 'test@example.com',
        };

        const result = anonymousContactSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.errors[0].message).toBe('お名前を入力してください');
        }
      });

      it('20文字を超える場合エラーとなること', () => {
        const invalidData = {
          ...validBaseData,
          name: 'あ'.repeat(21),
          email: 'test@example.com',
        };

        const result = anonymousContactSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.errors[0].message).toBe('20文字以内で入力してください');
        }
      });
    });

    // メールアドレスのバリデーション
    describe('email field', () => {
      it('無効なメールアドレス形式でエラーとなること', () => {
        const invalidData = {
          ...validBaseData,
          name: 'テスト太郎',
          email: 'invalid-email',
        };

        const result = anonymousContactSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.errors[0].message).toBe('有効なメールアドレスを入力してください');
        }
      });
    });
  });

  describe('authenticatedContactSchema', () => {
    // 正常系テスト
    it('有効なデータで正しくバリデーションが通ること', () => {
      const result = authenticatedContactSchema.safeParse(validBaseData);
      expect(result.success).toBe(true);
    });

    // 件名のバリデーション
    describe('subject field', () => {
      it('空の場合エラーとなること', () => {
        const invalidData = {
          ...validBaseData,
          subject: '',
        };

        const result = authenticatedContactSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.errors[0].message).toBe('選択してください');
        }
      });
    });

    // メッセージのバリデーション
    describe('message field', () => {
      it('10文字未満でエラーとなること', () => {
        const invalidData = {
          ...validBaseData,
          message: '短すぎる',
        };

        const result = authenticatedContactSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.errors[0].message).toBe('10文字以上で入力してください');
        }
      });

      it('700文字を超えるとエラーとなること', () => {
        const invalidData = {
          ...validBaseData,
          message: 'あ'.repeat(701),
        };

        const result = authenticatedContactSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.errors[0].message).toBe('700文字以内で入力してください');
        }
      });
    });

    // プライバシーポリシー同意のバリデーション
    describe('privacyAgreed field', () => {
      it('false の場合エラーとなること', () => {
        const invalidData = {
          ...validBaseData,
          privacyAgreed: false,
        };

        const result = authenticatedContactSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.errors[0].message).toBe('プライバシーポリシーに同意してください');
        }
      });
    });
  });
});
