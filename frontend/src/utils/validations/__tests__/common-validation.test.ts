import { MIN_PASSWORD_LENGTH } from '@/utils/constants';
import { createPasswordSchema, emailSchema } from '../common-validation';

describe('Authentication Validation Schemas', () => {
  /*----------------------------------------------------------------------------
  パスワードバリデーションのテスト
  ----------------------------------------------------------------------------*/
  describe('createPasswordSchema', () => {
    // 正常テスト
    const validPassword = 'ValidPass123';
    it('有効なパスワードを許可する', () => {
      const result = createPasswordSchema.safeParse(validPassword);
      expect(result.success).toBe(true);
    });

    /**
     * エラー
     * 文字数要件のテスト
     */
    it(`${MIN_PASSWORD_LENGTH}文字未満のパスワードを拒否する`, () => {
      const shortPassword = 'Ab1';
      const result = createPasswordSchema.safeParse(shortPassword);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe(
          `パスワードは${MIN_PASSWORD_LENGTH}文字以上である必要があります`,
        );
      }
    });

    /**
     * エラー
     * 大文字を含まないパスワードが適切に拒否されることを確認
     */
    it('大文字を含まないパスワードを拒否する', () => {
      const noUpperCase = 'password123';
      const result = createPasswordSchema.safeParse(noUpperCase);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe(
          'パスワードは少なくとも1つの大文字を含む必要があります',
        );
      }
    });

    /**
     * エラー
     * 小文字を含まないパスワードが適切に拒否されることを確認
     */
    it('小文字を含まないパスワードを拒否する', () => {
      const noLowerCase = 'PASSWORD123';
      const result = createPasswordSchema.safeParse(noLowerCase);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe(
          'パスワードは少なくとも1つの小文字を含む必要があります',
        );
      }
    });

    /**
     * エラー
     * 数字を含まないパスワードが適切に拒否されることを確認
     */
    it('数字を含まないパスワードを拒否する', () => {
      const noNumber = 'PasswordABC';
      const result = createPasswordSchema.safeParse(noNumber);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe(
          'パスワードは少なくとも1つの数字を含む必要があります',
        );
      }
    });

    /**
     * エラー
     * 3回以上連続する同じ文字を含むパスワードが適切に拒否されることを確認
     */
    it('3回以上連続する文字を含むパスワードを拒否する', () => {
      const repeatingChars = 'Password111';
      const result = createPasswordSchema.safeParse(repeatingChars);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe(
          'パスワードに3回以上連続する文字を含めることはできません',
        );
      }
    });
  });
  /*----------------------------------------------------------------------------
  メールアドレスバリデーションのテスト
  ----------------------------------------------------------------------------*/
  describe('emailSchema', () => {
    // 正常
    it('有効なメールアドレスを許可する', () => {
      const validEmails = [
        'test@example.com', // 基本的な形式
        'user.name@domain.co.jp', // ドット区切りとサブドメイン
        'user+label@domain.com', // プラス記号を含む形式
      ];

      validEmails.forEach((email) => {
        const result = emailSchema.safeParse(email);
        expect(result.success).toBe(true);
      });
    });

    /**
     * エラー
     * 無効なメールアドレスパターンのテスト
     */
    it('無効なメールアドレスを拒否する', () => {
      const invalidEmails = [
        'invalid-email', // @がない
        '@domain.com', // ローカルパートがない
        'user@', // ドメインがない
        'user@domain', // TLDがない
        'user.domain.com', // @がない
      ];

      invalidEmails.forEach((email) => {
        const result = emailSchema.safeParse(email);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.errors[0].message).toBe('メールアドレスの形式ではありません');
        }
      });
    });
  });
});
