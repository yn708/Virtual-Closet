import { AUTH_CODE_LENGTH, MIN_PASSWORD_LENGTH } from '@/utils/constants';
import {
  authCodeFormSchema,
  loginFormSchema,
  passwordResetConfirmFormSchema,
  passwordResetFormSchema,
  signUpFormSchema,
} from '../auth-validation';

describe('Form Validation Schemas', () => {
  /*----------------------------------------------------------------------------
  サインアップフォームのテスト
  ----------------------------------------------------------------------------*/
  /**
   * 検証項目：
   * - メールアドレスの形式
   * - パスワードの各種要件
   * - パスワード確認の一致
   */
  describe('signUpFormSchema', () => {
    // 有効なフォームデータ
    const validFormData = {
      email: 'test@example.com',
      password: 'ValidPass123',
      passwordConfirmation: 'ValidPass123',
    };

    it('有効なフォームデータを許可する', () => {
      const result = signUpFormSchema.safeParse(validFormData);
      expect(result.success).toBe(true);
    });

    it('無効なメールアドレスを拒否する', () => {
      const invalidData = {
        ...validFormData,
        email: 'invalid-email',
      };
      const result = signUpFormSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe('メールアドレスの形式ではありません');
      }
    });

    it('パスワードが一致しない場合を拒否する', () => {
      const mismatchedData = {
        ...validFormData,
        passwordConfirmation: 'DifferentPass123',
      };
      const result = signUpFormSchema.safeParse(mismatchedData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe('パスワードが一致しません');
      }
    });
  });
  /*----------------------------------------------------------------------------
  ログインフォームのテスト
  ----------------------------------------------------------------------------*/
  /**
   * 検証項目：
   * - メールアドレスの形式
   * - パスワードの最小文字数
   */
  describe('loginFormSchema', () => {
    it('有効なログイン情報を許可する', () => {
      const validData = {
        email: 'test@example.com',
        password: 'ValidPass123',
      };
      const result = loginFormSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('最小文字数未満のパスワードを拒否する', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'short',
      };
      const result = loginFormSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe(
          `パスワードは${MIN_PASSWORD_LENGTH}文字以上である必要があります`,
        );
      }
    });
  });
  /*----------------------------------------------------------------------------
  認証コードフォームのテスト
  ----------------------------------------------------------------------------*/
  /**
   * 検証項目：
   * - コードの文字数が正確に AUTH_CODE_LENGTH と一致すること
   */
  describe('authCodeFormSchema', () => {
    it('正確な桁数の認証コードを許可する', () => {
      const validData = {
        code: '1'.repeat(AUTH_CODE_LENGTH),
      };
      const result = authCodeFormSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('不正な桁数の認証コードを拒否する', () => {
      const invalidData = {
        code: '123', // AUTH_CODE_LENGTH より短い
      };
      const result = authCodeFormSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe(
          `認証コードは${AUTH_CODE_LENGTH}桁で入力してください。`,
        );
      }
    });
  });
  /*----------------------------------------------------------------------------
  パスワードリセット（メール送信）フォームのテスト
  ----------------------------------------------------------------------------*/
  /**
   * 検証項目：
   * - メールアドレスの形式
   */
  describe('passwordResetFormSchema', () => {
    it('有効なメールアドレスを許可する', () => {
      const validData = {
        email: 'test@example.com',
      };
      const result = passwordResetFormSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('無効なメールアドレスを拒否する', () => {
      const invalidData = {
        email: 'invalid-email',
      };
      const result = passwordResetFormSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe('メールアドレスの形式ではありません');
      }
    });
  });
  /*----------------------------------------------------------------------------
  パスワードリセット確認フォームのテスト
  ----------------------------------------------------------------------------*/
  /**
   * 検証項目：
   * - 新しいパスワードの各種要件
   * - パスワード確認の一致
   */
  describe('passwordResetConfirmFormSchema', () => {
    it('有効なパスワードリセットデータを許可する', () => {
      const validData = {
        password: 'NewValidPass123',
        passwordConfirmation: 'NewValidPass123',
      };
      const result = passwordResetConfirmFormSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('パスワードが一致しない場合を拒否する', () => {
      const invalidData = {
        password: 'NewValidPass123',
        passwordConfirmation: 'DifferentPass123',
      };
      const result = passwordResetConfirmFormSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe('パスワードが一致しません');
      }
    });
  });
});
