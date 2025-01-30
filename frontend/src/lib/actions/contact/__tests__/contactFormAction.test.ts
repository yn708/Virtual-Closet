import { submitContactAPI } from '@/lib/api/contentApi';
import { getServerSession } from 'next-auth';
import { contactFormAction } from '../contactFormAction';

// モックの設定
jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}));

jest.mock('@/lib/api/contentApi', () => ({
  submitContactAPI: jest.fn(),
}));

describe('contactFormAction', () => {
  // 共通のテスト前処理
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // FormDataのヘルパー関数
  const createFormData = (data: Record<string, string | boolean>) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, String(value));
    });
    return formData;
  };

  describe('非認証ユーザーの場合', () => {
    beforeEach(() => {
      // 非認証状態をモック
      (getServerSession as jest.Mock).mockResolvedValue(null);
    });

    it('有効なデータで成功レスポンスを返すこと', async () => {
      // 有効なフォームデータを作成
      const formData = createFormData({
        name: 'テスト太郎',
        email: 'test@example.com',
        subject: 'テストの件名',
        message: 'これは10文字以上のテストメッセージです。',
        privacyAgreed: true,
      });

      // APIレスポンスをモック
      (submitContactAPI as jest.Mock).mockResolvedValue({ success: true });

      // アクションを実行
      const result = await contactFormAction(
        { message: '', errors: null, success: false },
        formData,
      );

      // 結果を検証
      expect(result).toEqual({
        message: 'お問い合わせを受け付けました',
        errors: null,
        success: true,
      });

      // APIが正しく呼び出されたことを確認
      expect(submitContactAPI).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'テスト太郎',
          email: 'test@example.com',
          subject: 'テストの件名',
          message: 'これは10文字以上のテストメッセージです。',
        }),
        false,
      );
    });

    it('バリデーションエラーを適切に処理すること', async () => {
      // 無効なフォームデータを作成
      const formData = createFormData({
        name: '',
        email: 'invalid-email',
        subject: '',
        message: '短すぎる',
        privacyAgreed: false,
      });

      const result = await contactFormAction(
        { message: '', errors: null, success: false },
        formData,
      );

      // バリデーションエラーのレスポンスを検証
      expect(result.success).toBe(false);
      expect(result.message).toBe('バリデーションエラー');
      expect(result.errors).toBeTruthy();
      expect(submitContactAPI).not.toHaveBeenCalled();
    });
  });

  describe('認証済みユーザーの場合', () => {
    beforeEach(() => {
      // 認証状態をモック
      (getServerSession as jest.Mock).mockResolvedValue({
        user: { name: 'Test User' },
      });
    });

    it('有効なデータで成功レスポンスを返すこと', async () => {
      // 有効なフォームデータを作成
      const formData = createFormData({
        subject: 'テストの件名',
        message: 'これは10文字以上のテストメッセージです。',
        privacyAgreed: true,
      });

      // APIレスポンスをモック
      (submitContactAPI as jest.Mock).mockResolvedValue({ success: true });

      // アクションを実行
      const result = await contactFormAction(
        { message: '', errors: null, success: false },
        formData,
      );

      // 結果を検証
      expect(result).toEqual({
        message: 'お問い合わせを受け付けました',
        errors: null,
        success: true,
      });

      // APIが正しく呼び出されたことを確認
      expect(submitContactAPI).toHaveBeenCalledWith(
        expect.objectContaining({
          subject: 'テストの件名',
          message: 'これは10文字以上のテストメッセージです。',
        }),
        true,
      );
    });
  });

  describe('エラーハンドリング', () => {
    it('API エラーを適切に処理すること', async () => {
      // 有効なフォームデータを作成
      const formData = createFormData({
        subject: 'テストの件名',
        message: 'これは10文字以上のテストメッセージです。',
        privacyAgreed: true,
      });

      // APIエラーをモック
      const error = new Error('API Error');
      (submitContactAPI as jest.Mock).mockRejectedValue(error);
      (getServerSession as jest.Mock).mockResolvedValue({
        user: { name: 'Test User' },
      });

      // アクションを実行
      const result = await contactFormAction(
        { message: '', errors: null, success: false },
        formData,
      );

      // エラーレスポンスを検証
      expect(result).toEqual({
        message: 'API Error',
        errors: null,
        success: false,
      });
    });

    it('予期せぬエラーを適切に処理すること', async () => {
      // 有効なフォームデータを作成
      const formData = createFormData({
        subject: 'テストの件名',
        message: 'これは10文字以上のテストメッセージです。',
        privacyAgreed: true,
      });

      // 予期せぬエラーをモック
      (submitContactAPI as jest.Mock).mockRejectedValue('Unexpected error');
      (getServerSession as jest.Mock).mockResolvedValue({
        user: { name: 'Test User' },
      });

      // アクションを実行
      const result = await contactFormAction(
        { message: '', errors: null, success: false },
        formData,
      );

      // エラーレスポンスを検証
      expect(result).toEqual({
        message: '予期せぬエラーが発生しました',
        errors: null,
        success: false,
      });
    });
  });
});
