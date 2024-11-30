import { ALLOWED_IMAGE_TYPES, MAX_FILE_SIZE, MIN_PASSWORD_LENGTH } from '@/utils/constants';
import {
  createPasswordSchema,
  emailSchema,
  optionalImageSchema,
  requiredImageSchema,
} from '../common-validation';

describe('Authentication and Image Validation Schemas', () => {
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
          `${MIN_PASSWORD_LENGTH}文字以上である必要があります。`,
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
        expect(result.error.errors[0].message).toBe('大文字を含む必要があります。');
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
        expect(result.error.errors[0].message).toBe('小文字を含む必要があります。');
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
        expect(result.error.errors[0].message).toBe('数字を含む必要があります。');
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
          '3回以上連続する文字を含めることはできません。',
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

  /*----------------------------------------------------------------------------
  画像バリデーションのテスト
  ----------------------------------------------------------------------------*/
  describe('Image Validation Schemas', () => {
    // テスト用のファイルモックを作成するヘルパー関数
    const createMockFile = (name: string, type: string, size: number): File => {
      const file = new File([''], name, { type });
      Object.defineProperty(file, 'size', { value: size });
      return file;
    };

    describe('optionalImageSchema', () => {
      it('有効な画像ファイルを許可する', () => {
        const validFile = createMockFile('test.jpg', 'image/jpeg', 1024 * 1024); // 1MB
        const result = optionalImageSchema.safeParse(validFile);
        expect(result.success).toBe(true);
      });

      it('nullを許可する', () => {
        const result = optionalImageSchema.safeParse(null);
        expect(result.success).toBe(true);
      });

      it('サポートされていないファイル形式を拒否する', () => {
        const invalidFile = createMockFile('test.txt', 'text/plain', 1024);
        const result = optionalImageSchema.safeParse(invalidFile);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.errors[0].message).toBe(
            'JPEG, PNG, GIF、HEIC形式の画像のみがサポートされています。',
          );
        }
      });

      it('サイズ制限を超える画像を拒否する', () => {
        const largeFile = createMockFile('large.jpg', 'image/jpeg', MAX_FILE_SIZE + 1);
        const result = optionalImageSchema.safeParse(largeFile);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.errors[0].message).toBe(
            `画像サイズは${MAX_FILE_SIZE / 1024 / 1024}MB以下にしてください。`,
          );
        }
      });
    });

    describe('requiredImageSchema', () => {
      it('有効な画像ファイルを許可する', () => {
        const validFile = createMockFile('test.jpg', 'image/jpeg', 1024 * 1024);
        const result = requiredImageSchema.safeParse(validFile);
        expect(result.success).toBe(true);
      });

      it('nullを拒否する', () => {
        const result = requiredImageSchema.safeParse(null);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.errors[0].message).toBe('画像ファイルは必須です。');
        }
      });

      it('undefined を拒否する', () => {
        const result = requiredImageSchema.safeParse(undefined);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.errors[0].message).toBe('画像ファイルは必須です。');
        }
      });

      it('ALLOWED_IMAGE_TYPESに含まれる全ての形式を許可する', () => {
        ALLOWED_IMAGE_TYPES.forEach((type) => {
          const validFile = createMockFile(`test.${type.split('/')[1]}`, type, 1024 * 1024);
          const result = requiredImageSchema.safeParse(validFile);
          expect(result.success).toBe(true);
        });
      });
    });
  });
});
