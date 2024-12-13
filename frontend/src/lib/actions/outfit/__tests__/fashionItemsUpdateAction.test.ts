/**
 * @jest-environment node
 */
import { updateFashionItemAPI } from '@/lib/api/fashionItemsApi';
import type { FashionItem, FormStateFashionItemUpdate } from '@/types';
import { fashionItemsUpdateAction } from '../fashionItemsUpdateAction';

// updateFashionItemAPIのモック
jest.mock('@/lib/api/fashionItemsApi', () => ({
  updateFashionItemAPI: jest.fn(),
}));

describe('fashionItemsUpdateAction', () => {
  // テストごとにモックをリセット
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // FormDataの作成ヘルパー関数
  const createMockFormData = (data: { [key: string]: string | string[] | File | null }) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => formData.append(key, v));
      } else if (value !== null) {
        formData.append(key, value);
      }
    });
    return formData;
  };

  // テスト用の初期アイテムデータ
  const mockInitialData: FashionItem = {
    id: '1',
    image: 'test-image.jpg',
    sub_category: { id: '1', subcategory_name: 'Tシャツ' },
    brand: { id: '1', brand_name: 'ブランドA', brand_name_kana: 'ブランドエー' },
    seasons: [{ id: 'spring', season_name: '春' }], // IDを修正
    price_range: { id: '1', price_range: '1000-3000' },
    design: { id: '1', design_pattern: 'カジュアル' },
    main_color: { id: '1', color_name: '黒', color_code: '#000000' },
    is_owned: true,
    is_old_clothes: false,
    created_at: new Date(),
    updated_at: new Date(),
  };

  it('サブカテゴリーの変更を正しく処理する', async () => {
    const mockUpdatedItem = {
      ...mockInitialData,
      sub_category: { id: '2', subcategory_name: 'パーカー' },
    };
    (updateFashionItemAPI as jest.Mock).mockResolvedValueOnce(mockUpdatedItem);

    const mockFormData = createMockFormData({
      sub_category: '2',
      is_owned: 'true',
      is_old_clothes: 'false',
      // 既存の値を維持
      brand: '1',
      price_range: '1',
      design: '1',
      main_color: '1',
      seasons: ['spring'],
    });

    const result = await fashionItemsUpdateAction(
      {} as FormStateFashionItemUpdate,
      mockFormData,
      mockInitialData,
    );

    expect(updateFashionItemAPI).toHaveBeenCalledWith('1', expect.any(FormData));
    const [_, formData] = (updateFashionItemAPI as jest.Mock).mock.calls[0];
    expect(formData.get('sub_category')).toBe('2');
    expect(result.success).toBe(true);
    expect(result.hasChanges).toBe(true);
  });

  it('シーズンの変更を正しく処理する', async () => {
    const mockUpdatedItem = {
      ...mockInitialData,
      seasons: [
        { id: '1', season_name: '春' },
        { id: '2', season_name: '夏' },
      ],
    };
    (updateFashionItemAPI as jest.Mock).mockResolvedValueOnce(mockUpdatedItem);

    const mockFormData = createMockFormData({
      sub_category: '1',
      brand: '1',
      seasons: ['spring', 'summer'],
      price_range: '1',
      design: '1',
      main_color: '1',
      is_owned: 'true',
      is_old_clothes: 'false',
    });

    const result = await fashionItemsUpdateAction(
      {} as FormStateFashionItemUpdate,
      mockFormData,
      mockInitialData,
    );

    expect(updateFashionItemAPI).toHaveBeenCalledWith('1', expect.any(FormData));
    const [_, formData] = (updateFashionItemAPI as jest.Mock).mock.calls[0];
    const seasons = formData.getAll('seasons');
    expect(seasons).toEqual(['spring', 'summer']);
    expect(result.success).toBe(true);
    expect(result.hasChanges).toBe(true);
  });

  it('変更がない場合はAPIを呼び出さない', async () => {
    const mockFormData = createMockFormData({
      sub_category: '1',
      brand: '1',
      seasons: ['spring'],
      price_range: '1',
      design: '1',
      main_color: '1',
      is_owned: 'true',
      is_old_clothes: 'false',
    });

    const result = await fashionItemsUpdateAction(
      {} as FormStateFashionItemUpdate,
      mockFormData,
      mockInitialData,
    );

    expect(updateFashionItemAPI).not.toHaveBeenCalled();
    expect(result).toEqual({
      message: '変更がありません',
      errors: null,
      success: false,
      hasChanges: false,
    });
  });
  it('バリデーションエラーを適切に処理する', async () => {
    const mockFormData = createMockFormData({
      sub_category: '1',
      brand: '1',
      seasons: ['invalid_season'], // 無効なシーズン値
      price_range: '1',
      design: '1',
      main_color: '1',
      is_owned: 'true',
      is_old_clothes: 'false',
    });

    const result = await fashionItemsUpdateAction(
      {} as FormStateFashionItemUpdate,
      mockFormData,
      mockInitialData,
    );

    expect(result.success).toBe(false);
    expect(result.message).toBe('バリデーションエラー');
    expect(result.errors).toBeDefined();
    expect(updateFashionItemAPI).not.toHaveBeenCalled();
  });

  it('新しい画像のアップロードを正しく処理する', async () => {
    const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const mockUpdatedItem = { ...mockInitialData, image: 'new-test-image.jpg' };
    (updateFashionItemAPI as jest.Mock).mockResolvedValueOnce(mockUpdatedItem);

    const mockFormData = createMockFormData({
      sub_category: '1',
      brand: '1',
      seasons: ['spring'],
      price_range: '1',
      design: '1',
      main_color: '1',
      image: mockFile,
      is_owned: 'true',
      is_old_clothes: 'false',
    });

    const result = await fashionItemsUpdateAction(
      {} as FormStateFashionItemUpdate,
      mockFormData,
      mockInitialData,
    );

    expect(updateFashionItemAPI).toHaveBeenCalledWith('1', expect.any(FormData));
    const [_, formData] = (updateFashionItemAPI as jest.Mock).mock.calls[0];
    expect(formData.get('image')).toBeInstanceOf(File);
    expect(result.success).toBe(true);
    expect(result.hasChanges).toBe(true);
  });

  it('APIエラーを適切に処理する', async () => {
    (updateFashionItemAPI as jest.Mock).mockRejectedValueOnce(
      new Error('予期せぬエラーが発生しました'),
    );

    const mockFormData = createMockFormData({
      sub_category: '2',
      brand: '1',
      seasons: ['spring'],
      price_range: '1',
      design: '1',
      main_color: '1',
      is_owned: 'true',
      is_old_clothes: 'false',
    });

    const result = await fashionItemsUpdateAction(
      {} as FormStateFashionItemUpdate,
      mockFormData,
      mockInitialData,
    );

    expect(result).toEqual({
      message: '予期せぬエラーが発生しました',
      errors: null,
      success: false,
    });
  });

  it('複数のフィールドの変更を正しく処理する', async () => {
    const mockUpdatedItem = {
      ...mockInitialData,
      sub_category: { id: '2', subcategory_name: 'パーカー' },
      brand: { id: '2', brand_name: 'ブランドB', brand_name_kana: 'ブランドビー' },
      seasons: [
        { id: '2', season_name: '夏' },
        { id: '3', season_name: '秋' },
      ],
      is_owned: false,
      is_old_clothes: true,
      updated_at: new Date(),
    };
    (updateFashionItemAPI as jest.Mock).mockResolvedValueOnce(mockUpdatedItem);

    const mockFormData = createMockFormData({
      sub_category: '2',
      brand: '2',
      seasons: ['summer', 'autumn'],
      price_range: '2',
      design: '2',
      main_color: '2',
      is_owned: 'false',
      is_old_clothes: 'true',
    });

    const result = await fashionItemsUpdateAction(
      {} as FormStateFashionItemUpdate,
      mockFormData,
      mockInitialData,
    );

    expect(updateFashionItemAPI).toHaveBeenCalledWith('1', expect.any(FormData));
    const [_, formData] = (updateFashionItemAPI as jest.Mock).mock.calls[0];
    expect(formData.get('sub_category')).toBe('2');
    expect(formData.get('brand')).toBe('2');
    expect(formData.getAll('seasons')).toEqual(['summer', 'autumn']);
    expect(formData.get('price_range')).toBe('2');
    expect(formData.get('design')).toBe('2');
    expect(formData.get('main_color')).toBe('2');
    expect(formData.get('is_owned')).toBe('false');
    expect(formData.get('is_old_clothes')).toBe('true');
    expect(result.success).toBe(true);
    expect(result.hasChanges).toBe(true);
    expect(result.updatedItem).toEqual(mockUpdatedItem);
  });
});
