import { registerFashionItemAPI, updateFashionItemAPI } from '@/lib/api/fashionItemsApi';
import type { FashionItem } from '@/types';
import { fashionItemFormData } from '@/utils/form/fashion-items-handlers';
import {
  fashionItemCreateFormSchema,
  fashionItemUpdateFormSchema,
} from '@/utils/validations/fashion-item-validation';
import { revalidatePath } from 'next/cache';
import { fashionItemsCreateAction, fashionItemsUpdateAction } from '../fashionItemsAction';

// モックの設定
jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}));

jest.mock('@/lib/api/fashionItemsApi', () => ({
  registerFashionItemAPI: jest.fn(),
  updateFashionItemAPI: jest.fn(),
}));

jest.mock('@/utils/form/fashion-items-handlers', () => ({
  fashionItemFormData: jest.fn(),
  getFashionItemFormFields: jest.fn(),
}));

jest.mock('@/utils/validations/fashion-item-validation', () => ({
  fashionItemCreateFormSchema: {
    safeParse: jest.fn(),
  },
  fashionItemUpdateFormSchema: {
    safeParse: jest.fn(),
  },
}));

describe('Fashion Items Actions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fashionItemsCreateAction', () => {
    const mockFormData = new FormData();
    const mockPrevState = {
      message: null,
      errors: null,
    };

    it('バリデーション成功時に正しく処理が実行される', async () => {
      // バリデーション成功のモック
      const mockValidatedData = {
        image: new File([''], 'test.jpg', { type: 'image/jpeg' }),
        sub_category: '1',
        brand: '1',
        seasons: ['1', '2'],
        price_range: '1',
        design: '1',
        main_color: '1',
        is_owned: true,
        is_old_clothes: false,
      };

      (fashionItemCreateFormSchema.safeParse as jest.Mock).mockReturnValue({
        success: true,
        data: mockValidatedData,
      });

      const mockApiFormData = new FormData();
      (fashionItemFormData as jest.Mock).mockReturnValue({
        apiFormData: mockApiFormData,
        hasChanges: true,
      });

      const result = await fashionItemsCreateAction(mockPrevState, mockFormData);

      expect(registerFashionItemAPI).toHaveBeenCalledWith(mockApiFormData);
      expect(revalidatePath).toHaveBeenCalled();
      expect(result).toEqual({
        message: null,
        errors: null,
        success: true,
      });
    });

    it('バリデーション失敗時にエラーを返す', async () => {
      // バリデーション失敗のモック
      const mockError = {
        flatten: () => ({
          fieldErrors: {
            image: ['画像は必須です'],
            sub_category: ['サブカテゴリーは必須です'],
          },
        }),
      };

      (fashionItemCreateFormSchema.safeParse as jest.Mock).mockReturnValue({
        success: false,
        error: mockError,
      });

      const result = await fashionItemsCreateAction(mockPrevState, mockFormData);

      expect(result).toEqual({
        message: 'バリデーションエラー',
        errors: {
          image: ['画像は必須です'],
          sub_category: ['サブカテゴリーは必須です'],
        },
        success: false,
      });
      expect(registerFashionItemAPI).not.toHaveBeenCalled();
    });
  });

  describe('fashionItemsUpdateAction', () => {
    const mockFormData = new FormData();
    const mockPrevState = {
      message: null,
      errors: null,
    };

    const mockInitialData: FashionItem = {
      id: '1',
      image: 'test.jpg',
      sub_category: { id: '1', subcategory_name: 'Tシャツ', category: 'トップス' },
      brand: { id: '1', brand_name: 'ブランドA', brand_name_kana: 'ブランドエー' },
      seasons: [{ id: '1', season_name: '春' }],
      price_range: { id: '1', price_range: '1000-3000円' },
      design: { id: '1', design_pattern: '無地' },
      main_color: { id: '1', color_name: '黒', color_code: '#000000' },
      is_owned: true,
      is_old_clothes: false,
      created_at: new Date(),
      updated_at: new Date(),
    };

    it('バリデーション成功かつ変更がある場合に正しく更新される', async () => {
      const mockValidatedData = {
        image: new File([''], 'new-test.jpg', { type: 'image/jpeg' }),
        sub_category: '2',
        brand: '2',
        seasons: ['2'],
        price_range: '2',
        design: '2',
        main_color: '2',
        is_owned: false,
        is_old_clothes: true,
      };

      (fashionItemUpdateFormSchema.safeParse as jest.Mock).mockReturnValue({
        success: true,
        data: mockValidatedData,
      });

      const mockApiFormData = new FormData();
      (fashionItemFormData as jest.Mock).mockReturnValue({
        apiFormData: mockApiFormData,
        hasChanges: true,
      });

      const mockUpdatedItem = { ...mockInitialData, image: 'new-test.jpg' };
      (updateFashionItemAPI as jest.Mock).mockResolvedValue(mockUpdatedItem);

      const result = await fashionItemsUpdateAction(mockPrevState, mockFormData, mockInitialData);

      expect(updateFashionItemAPI).toHaveBeenCalledWith('1', mockApiFormData);
      expect(result).toEqual({
        message: '更新が完了しました',
        errors: null,
        success: true,
        hasChanges: true,
        updatedItem: mockUpdatedItem,
      });
    });

    it('変更がない場合は更新を実行しない', async () => {
      const mockValidatedData = {
        image: new File([''], 'test.jpg', { type: 'image/jpeg' }),
        sub_category: '1',
        brand: '1',
        seasons: ['1'],
        price_range: '1',
        design: '1',
        main_color: '1',
        is_owned: true,
        is_old_clothes: false,
      };

      (fashionItemUpdateFormSchema.safeParse as jest.Mock).mockReturnValue({
        success: true,
        data: mockValidatedData,
      });

      (fashionItemFormData as jest.Mock).mockReturnValue({
        apiFormData: new FormData(),
        hasChanges: false,
      });

      const result = await fashionItemsUpdateAction(mockPrevState, mockFormData, mockInitialData);

      expect(updateFashionItemAPI).not.toHaveBeenCalled();
      expect(result).toEqual({
        message: '変更がありません',
        errors: null,
        success: false,
        hasChanges: false,
      });
    });

    it('エラー発生時に適切なエラーメッセージを返す', async () => {
      const mockError = new Error('APIエラー');
      (fashionItemUpdateFormSchema.safeParse as jest.Mock).mockReturnValue({
        success: true,
        data: {},
      });

      (fashionItemFormData as jest.Mock).mockReturnValue({
        apiFormData: new FormData(),
        hasChanges: true,
      });

      (updateFashionItemAPI as jest.Mock).mockRejectedValue(mockError);

      const result = await fashionItemsUpdateAction(mockPrevState, mockFormData, mockInitialData);

      expect(result).toEqual({
        message: 'APIエラー',
        errors: null,
        success: false,
      });
    });
  });
});
