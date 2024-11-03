/**
 * @jest-environment node
 */
import {
  confirmRegistrationAPI,
  passwordResetAPI,
  resendCodeAPI,
  sendPasswordResetAPI,
  signUpAPI,
  verifyEmailPasswordAPI,
} from '@/lib/api/authApi';
import { baseFetchAPI } from '@/lib/api/baseApi';
import {
  PASSWORD_RESET_CONFIRM_ENDPOINT,
  RESEND_AUTH_CODE_ENDPOINT,
  SEND_AUTH_CODE_ENDPOINT,
  SEND_PASSWORD_RESET_ENDPOINT,
  VERIFY_CODE_ENDPOINT,
  VERIFY_EMAIL_PASSWORD_ENDPOINT,
} from '@/utils/constants';

// baseFetchAPIのモック
jest.mock('@/lib/api/baseApi', () => ({
  baseFetchAPI: jest.fn(),
}));

/**
 * 認証関連APIのテストスイート
 */
describe('Authentication APIs', () => {
  // 各テスト前にモックをリセット
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * sign-up（認証コード送信）のテスト
   */
  describe('signUpAPI', () => {
    const mockSignUpData = {
      email: 'test@example.com',
      password: 'TESTpass123',
      passwordConfirmation: 'TESTpass123',
    };

    it('正常なサインアップリクエストを送信する', async () => {
      // モックの戻り値を設定
      (baseFetchAPI as jest.Mock).mockResolvedValueOnce({ success: true });

      // API呼び出し
      await signUpAPI(mockSignUpData);

      // 正しいエンドポイントとデータでAPIが呼ばれたか確認
      expect(baseFetchAPI).toHaveBeenCalledWith(
        SEND_AUTH_CODE_ENDPOINT,
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: mockSignUpData.email,
            password1: mockSignUpData.password,
            password2: mockSignUpData.passwordConfirmation,
          }),
        }),
      );
    });

    it('APIエラーを適切に処理する', async () => {
      // エラーレスポンスのモック
      const errorResponse = { message: 'メールアドレスは既に登録されています' };
      (baseFetchAPI as jest.Mock).mockRejectedValueOnce(new Error(JSON.stringify(errorResponse)));

      // エラーがスローされることを確認
      await expect(signUpAPI(mockSignUpData)).rejects.toThrow(JSON.stringify(errorResponse));
    });
  });

  /**
   * 認証コード検証のテスト
   */
  describe('confirmRegistrationAPI', () => {
    const mockEmail = 'test@example.com';
    const mockCode = '123456';

    it('正常な認証コード検証リクエストを送信する', async () => {
      // モックの戻り値を設定
      (baseFetchAPI as jest.Mock).mockResolvedValueOnce({ success: true });

      // API呼び出し
      await confirmRegistrationAPI(mockEmail, mockCode);

      // 正しいエンドポイントとデータでAPIが呼ばれたか確認
      expect(baseFetchAPI).toHaveBeenCalledWith(
        VERIFY_CODE_ENDPOINT,
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: mockEmail,
            confirmation_code: mockCode,
          }),
        }),
      );
    });
  });

  /**
   * 認証コード再送信のテスト
   */
  describe('resendCodeAPI', () => {
    const mockLoginData = {
      email: 'test@example.com',
      password: 'Password123',
    };

    it('正常な認証コード再送信リクエストを送信する', async () => {
      // モックの戻り値を設定
      (baseFetchAPI as jest.Mock).mockResolvedValueOnce({ success: true });

      // API呼び出し
      await resendCodeAPI(mockLoginData);

      // 正しいエンドポイントとデータでAPIが呼ばれたか確認
      expect(baseFetchAPI).toHaveBeenCalledWith(
        RESEND_AUTH_CODE_ENDPOINT,
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(mockLoginData),
        }),
      );
    });
  });

  /**
   * メールアドレス・パスワード検証のテスト
   */
  describe('verifyEmailPasswordAPI', () => {
    const mockLoginData = {
      email: 'test@example.com',
      password: 'TESTpass123',
    };

    it('正常な認証情報検証リクエストを送信する', async () => {
      // モックの戻り値を設定
      (baseFetchAPI as jest.Mock).mockResolvedValueOnce({ success: true });

      // API呼び出し
      await verifyEmailPasswordAPI(mockLoginData);

      // 正しいエンドポイントとデータでAPIが呼ばれたか確認
      expect(baseFetchAPI).toHaveBeenCalledWith(
        VERIFY_EMAIL_PASSWORD_ENDPOINT,
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(mockLoginData),
        }),
      );
    });
  });

  /**
   * パスワードリセットメール送信のテスト
   */
  describe('sendPasswordResetAPI', () => {
    const mockResetData = {
      email: 'test@example.com',
    };

    it('正常なパスワードリセットメール送信リクエストを送信する', async () => {
      // モックの戻り値を設定
      (baseFetchAPI as jest.Mock).mockResolvedValueOnce({ success: true });

      // API呼び出し
      await sendPasswordResetAPI(mockResetData);

      // 正しいエンドポイントとデータでAPIが呼ばれたか確認
      expect(baseFetchAPI).toHaveBeenCalledWith(
        SEND_PASSWORD_RESET_ENDPOINT,
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(mockResetData),
        }),
      );
    });
  });

  /**
   * パスワードリセット実行のテスト
   */
  describe('passwordResetAPI', () => {
    const mockUid = 'user123';
    const mockToken = 'token123';
    const mockPasswordData = {
      password: 'NewTESTpass123',
      passwordConfirmation: 'NewTESTpass123',
    };

    it('正常なパスワードリセットリクエストを送信する', async () => {
      // モックの戻り値を設定
      (baseFetchAPI as jest.Mock).mockResolvedValueOnce({ success: true });

      // API呼び出し
      await passwordResetAPI(mockUid, mockToken, mockPasswordData);

      // 正しいエンドポイントとデータでAPIが呼ばれたか確認
      expect(baseFetchAPI).toHaveBeenCalledWith(
        PASSWORD_RESET_CONFIRM_ENDPOINT,
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            uid: mockUid,
            token: mockToken,
            new_password1: mockPasswordData.password,
            new_password2: mockPasswordData.passwordConfirmation,
          }),
        }),
      );
    });
  });
});
