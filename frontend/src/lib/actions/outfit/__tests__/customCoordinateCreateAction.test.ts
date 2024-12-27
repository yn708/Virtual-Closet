/**
 * @jest-environment node
 */
import { registerCustomCoordinateAPI } from '@/lib/api/coordinateApi';
import type { FormState } from '@/types';
import { COORDINATE_CREATE_CANVAS_URL, TOP_URL } from '@/utils/constants';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { customCoordinateCreateAction } from '../CustomCoordinateCreateAction';

// 外部依存のモック
jest.mock('@/lib/api/coordinateApi', () => ({
  registerCustomCoordinateAPI: jest.fn(),
}));

jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  redirect: jest.fn(() => {
    throw new Error('Redirect');
  }),
}));

describe('customCoordinateCreateAction', () => {
  // テストごとにモックをリセット
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('必須フィールドのみで正常に登録できる', async () => {
    // テスト用の画像ファイルを作成
    const imageBlob = new Blob(['dummy image content'], { type: 'image/jpeg' });
    const mockFile = new File([imageBlob], 'test.jpg', { type: 'image/jpeg' });

    // テスト用のアイテムデータ
    const itemsData = [
      { id: 1, type: 'tops' },
      { id: 2, type: 'bottoms' },
    ];

    // FormDataを作成
    const mockFormData = new FormData();
    mockFormData.append('preview_image', mockFile);
    mockFormData.append('items', JSON.stringify(itemsData));

    // APIレスポンスのモック
    (registerCustomCoordinateAPI as jest.Mock).mockResolvedValueOnce({ success: true });

    // リダイレクトをテスト
    await expect(customCoordinateCreateAction({} as FormState, mockFormData)).rejects.toThrow(
      'Redirect',
    );

    // API呼び出しとリダイレクトを検証
    expect(registerCustomCoordinateAPI).toHaveBeenCalled();
    expect(revalidatePath).toHaveBeenCalledWith(COORDINATE_CREATE_CANVAS_URL);
    expect(redirect).toHaveBeenCalledWith(TOP_URL);
  });

  it('アイテムが2つ未満の場合はエラーを返す', async () => {
    const imageBlob = new Blob(['dummy image content'], { type: 'image/jpeg' });
    const mockFile = new File([imageBlob], 'test.jpg', { type: 'image/jpeg' });

    // 1つのアイテムのみ
    const itemsData = [{ id: 1, type: 'tops' }];

    const mockFormData = new FormData();
    mockFormData.append('preview_image', mockFile);
    mockFormData.append('items', JSON.stringify(itemsData));

    const result = await customCoordinateCreateAction({} as FormState, mockFormData);

    expect(result).toEqual({
      message: '最低2つのアイテムが必要です',
      errors: { items: ['最低2つのアイテムが必要です'] },
      success: false,
    });
    expect(registerCustomCoordinateAPI).not.toHaveBeenCalled();
  });

  it('必須フィールドが欠けている場合はバリデーションエラーを返す', async () => {
    const mockFormData = new FormData();
    mockFormData.append('seasons', 'spring');
    mockFormData.append('tastes', 'casual');

    const result = await customCoordinateCreateAction({} as FormState, mockFormData);

    expect(result).toEqual({
      message: 'バリデーションエラー',
      errors: expect.any(Object),
      success: false,
    });
    expect(registerCustomCoordinateAPI).not.toHaveBeenCalled();
  });

  it('APIエラーを適切に処理する', async () => {
    const imageBlob = new Blob(['dummy image content'], { type: 'image/jpeg' });
    const mockFile = new File([imageBlob], 'test.jpg', { type: 'image/jpeg' });

    const itemsData = [
      { id: 1, type: 'tops' },
      { id: 2, type: 'bottoms' },
    ];

    const mockFormData = new FormData();
    mockFormData.append('preview_image', mockFile);
    mockFormData.append('items', JSON.stringify(itemsData));

    const errorMessage = '予期せぬエラーが発生しました';
    (registerCustomCoordinateAPI as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

    await expect(customCoordinateCreateAction({} as FormState, mockFormData)).rejects.toThrow(
      errorMessage,
    );

    expect(registerCustomCoordinateAPI).toHaveBeenCalled();
  });

  it('オプションフィールドを全て含めて正しく処理する', async () => {
    const imageBlob = new Blob(['dummy image content'], { type: 'image/jpeg' });
    const mockFile = new File([imageBlob], 'test.jpg', { type: 'image/jpeg' });

    const itemsData = [
      { id: 1, type: 'tops' },
      { id: 2, type: 'bottoms' },
    ];

    const mockFormData = new FormData();
    mockFormData.append('preview_image', mockFile);
    mockFormData.append('items', JSON.stringify(itemsData));
    ['spring', 'summer'].forEach((season) => {
      mockFormData.append('seasons', season);
    });
    ['casual', 'simple'].forEach((taste) => {
      mockFormData.append('tastes', taste);
    });
    ['daily', 'work'].forEach((scene) => {
      mockFormData.append('scenes', scene);
    });

    (registerCustomCoordinateAPI as jest.Mock).mockImplementationOnce(
      async (formData: FormData) => {
        expect(formData.getAll('seasons')).toEqual(['spring', 'summer']);
        expect(formData.getAll('tastes')).toEqual(['casual', 'simple']);
        expect(formData.getAll('scenes')).toEqual(['daily', 'work']);
        return { success: true };
      },
    );

    await expect(customCoordinateCreateAction({} as FormState, mockFormData)).rejects.toThrow(
      'Redirect',
    );
  });
});
