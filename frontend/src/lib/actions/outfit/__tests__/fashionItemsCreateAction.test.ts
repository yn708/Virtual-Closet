/**
 * @jest-environment node
 */
import { registerFashionItemAPI } from '@/lib/api/fashionItemsApi';
import type { FormState } from '@/types';
import { ITEM_CREATE_URL, TOP_URL } from '@/utils/constants';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { fashionItemsCreateAction } from '../fashionItemsCreateAction';

// 外部依存のモック
jest.mock('@/lib/api/fashionItemsApi', () => ({
  registerFashionItemAPI: jest.fn(),
}));

jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  redirect: jest.fn(() => {
    throw new Error('Redirect');
  }),
}));

describe('fashionItemsCreateAction', () => {
  // テストごとにモックをリセット
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('必須フィールドのみで正常に登録できる', async () => {
    // テスト用の画像ファイルを作成
    const imageBlob = new Blob(['dummy image content'], { type: 'image/jpeg' });
    const mockFile = new File([imageBlob], 'test.jpg', { type: 'image/jpeg' });

    // FormDataを作成
    const mockFormData = new FormData();
    mockFormData.append('sub_category', '1');
    mockFormData.append('seasons', 'spring');
    mockFormData.append('is_owned', 'true');
    mockFormData.append('is_old_clothes', 'false');
    mockFormData.append('image', mockFile);

    // APIレスポンスのモック
    (registerFashionItemAPI as jest.Mock).mockResolvedValueOnce({ success: true });

    // リダイレクトをテスト
    await expect(fashionItemsCreateAction({} as FormState, mockFormData)).rejects.toThrow(
      'Redirect',
    );

    // API呼び出しとリダイレクトを検証
    expect(registerFashionItemAPI).toHaveBeenCalled();
    expect(revalidatePath).toHaveBeenCalledWith(ITEM_CREATE_URL);
    expect(redirect).toHaveBeenCalledWith(TOP_URL);
  });

  it('必須フィールドが欠けている場合はバリデーションエラーを返す', async () => {
    const mockFormData = new FormData();
    mockFormData.append('brand', 'brand1');
    mockFormData.append('is_owned', 'true');
    mockFormData.append('is_old_clothes', 'false');

    const result = await fashionItemsCreateAction({} as FormState, mockFormData);

    expect(result).toEqual({
      message: 'バリデーションエラー',
      errors: expect.any(Object),
      success: false,
    });
    expect(registerFashionItemAPI).not.toHaveBeenCalled();
  });

  it('APIエラーを適切に処理する', async () => {
    const imageBlob = new Blob(['dummy image content'], { type: 'image/jpeg' });
    const mockFile = new File([imageBlob], 'test.jpg', { type: 'image/jpeg' });

    const mockFormData = new FormData();
    mockFormData.append('sub_category', '1');
    mockFormData.append('seasons', 'spring');
    mockFormData.append('is_owned', 'true');
    mockFormData.append('is_old_clothes', 'false');
    mockFormData.append('image', mockFile);

    const errorMessage = '予期せぬエラーが発生しました';
    (registerFashionItemAPI as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

    await expect(fashionItemsCreateAction({} as FormState, mockFormData)).rejects.toThrow(
      errorMessage,
    );

    expect(registerFashionItemAPI).toHaveBeenCalled();
  });

  it('シーズンの複数選択を正しく処理する', async () => {
    const imageBlob = new Blob(['dummy image content'], { type: 'image/jpeg' });
    const mockFile = new File([imageBlob], 'test.jpg', { type: 'image/jpeg' });

    const mockFormData = new FormData();
    mockFormData.append('sub_category', '1');
    ['spring', 'summer', 'autumn', 'winter'].forEach((season) => {
      mockFormData.append('seasons', season);
    });
    mockFormData.append('is_owned', 'true');
    mockFormData.append('is_old_clothes', 'false');
    mockFormData.append('image', mockFile);

    (registerFashionItemAPI as jest.Mock).mockImplementationOnce(async (formData: FormData) => {
      expect(formData.getAll('seasons')).toEqual(['spring', 'summer', 'autumn', 'winter']);
      return { success: true };
    });

    await expect(fashionItemsCreateAction({} as FormState, mockFormData)).rejects.toThrow(
      'Redirect',
    );
  });

  it('boolean値を文字列として正しく処理する', async () => {
    const imageBlob = new Blob(['dummy image content'], { type: 'image/jpeg' });
    const mockFile = new File([imageBlob], 'test.jpg', { type: 'image/jpeg' });

    const mockFormData = new FormData();
    mockFormData.append('sub_category', '1');
    mockFormData.append('seasons', 'spring');
    mockFormData.append('is_owned', 'true');
    mockFormData.append('is_old_clothes', 'false');
    mockFormData.append('image', mockFile);

    (registerFashionItemAPI as jest.Mock).mockImplementationOnce(async (formData: FormData) => {
      expect(formData.get('is_owned')).toBe('true');
      expect(formData.get('is_old_clothes')).toBe('false');
      return { success: true };
    });

    await expect(fashionItemsCreateAction({} as FormState, mockFormData)).rejects.toThrow(
      'Redirect',
    );
  });
});
