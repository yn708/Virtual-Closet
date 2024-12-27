/**
 * @jest-environment node
 */
import { registerPhotoCoordinateAPI } from '@/lib/api/coordinateApi';
import type { FormState } from '@/types';
import { COORDINATE_CREATE_URL, TOP_URL } from '@/utils/constants';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { photoCoordinateCreateAction } from '../PhotoCoordinateCreateAction';

// 外部依存のモック
jest.mock('@/lib/api/coordinateApi', () => ({
  registerPhotoCoordinateAPI: jest.fn(),
}));

jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  redirect: jest.fn(() => {
    throw new Error('Redirect');
  }),
}));

describe('photoCoordinateCreateAction', () => {
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
    mockFormData.append('image', mockFile);

    // APIレスポンスのモック
    (registerPhotoCoordinateAPI as jest.Mock).mockResolvedValueOnce({ success: true });

    // リダイレクトをテスト
    await expect(photoCoordinateCreateAction({} as FormState, mockFormData)).rejects.toThrow(
      'Redirect',
    );

    // API呼び出しとリダイレクトを検証
    expect(registerPhotoCoordinateAPI).toHaveBeenCalled();
    expect(revalidatePath).toHaveBeenCalledWith(COORDINATE_CREATE_URL);
    expect(redirect).toHaveBeenCalledWith(TOP_URL);
  });

  it('画像が欠けている場合はバリデーションエラーを返す', async () => {
    const mockFormData = new FormData();
    mockFormData.append('seasons', 'spring');
    mockFormData.append('tastes', 'casual');

    const result = await photoCoordinateCreateAction({} as FormState, mockFormData);

    expect(result).toEqual({
      message: 'バリデーションエラー',
      errors: expect.any(Object),
      success: false,
    });
    expect(registerPhotoCoordinateAPI).not.toHaveBeenCalled();
  });

  it('APIエラーを適切に処理する', async () => {
    const imageBlob = new Blob(['dummy image content'], { type: 'image/jpeg' });
    const mockFile = new File([imageBlob], 'test.jpg', { type: 'image/jpeg' });

    const mockFormData = new FormData();
    mockFormData.append('image', mockFile);

    const errorMessage = '予期せぬエラーが発生しました';
    (registerPhotoCoordinateAPI as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

    await expect(photoCoordinateCreateAction({} as FormState, mockFormData)).rejects.toThrow(
      errorMessage,
    );

    expect(registerPhotoCoordinateAPI).toHaveBeenCalled();
  });

  it('全てのオプションフィールドを含めて正しく処理する', async () => {
    const imageBlob = new Blob(['dummy image content'], { type: 'image/jpeg' });
    const mockFile = new File([imageBlob], 'test.jpg', { type: 'image/jpeg' });

    const mockFormData = new FormData();
    mockFormData.append('image', mockFile);
    ['spring', 'summer'].forEach((season) => {
      mockFormData.append('seasons', season);
    });
    ['casual', 'simple'].forEach((taste) => {
      mockFormData.append('tastes', taste);
    });
    ['daily', 'work'].forEach((scene) => {
      mockFormData.append('scenes', scene);
    });

    (registerPhotoCoordinateAPI as jest.Mock).mockImplementationOnce(async (formData: FormData) => {
      // FormDataの内容を検証
      expect(formData.getAll('seasons')).toEqual(['spring', 'summer']);
      expect(formData.getAll('tastes')).toEqual(['casual', 'simple']);
      expect(formData.getAll('scenes')).toEqual(['daily', 'work']);
      expect(formData.get('image')).toBeTruthy();
      return { success: true };
    });

    await expect(photoCoordinateCreateAction({} as FormState, mockFormData)).rejects.toThrow(
      'Redirect',
    );
  });

  it('画像以外のフィールドが未定義の場合も正常に処理する', async () => {
    const imageBlob = new Blob(['dummy image content'], { type: 'image/jpeg' });
    const mockFile = new File([imageBlob], 'test.jpg', { type: 'image/jpeg' });

    const mockFormData = new FormData();
    mockFormData.append('image', mockFile);

    (registerPhotoCoordinateAPI as jest.Mock).mockImplementationOnce(async (formData: FormData) => {
      // 必須フィールドのみ存在することを確認
      expect(formData.get('image')).toBeTruthy();
      expect(formData.getAll('seasons')).toEqual([]);
      expect(formData.getAll('tastes')).toEqual([]);
      expect(formData.getAll('scenes')).toEqual([]);
      return { success: true };
    });

    await expect(photoCoordinateCreateAction({} as FormState, mockFormData)).rejects.toThrow(
      'Redirect',
    );
  });

  it('無効な画像タイプの場合はバリデーションエラーを返す', async () => {
    // 無効なファイルタイプを作成
    const invalidBlob = new Blob(['invalid content'], { type: 'text/plain' });
    const mockFile = new File([invalidBlob], 'test.txt', { type: 'text/plain' });

    const mockFormData = new FormData();
    mockFormData.append('image', mockFile);

    const result = await photoCoordinateCreateAction({} as FormState, mockFormData);

    expect(result).toEqual({
      message: 'バリデーションエラー',
      errors: expect.any(Object),
      success: false,
    });
    expect(registerPhotoCoordinateAPI).not.toHaveBeenCalled();
  });
});
