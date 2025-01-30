import type { FashionItem } from '@/types';
import type {
  fashionItemCreateFormSchema,
  fashionItemUpdateFormSchema,
} from '@/utils/validations/fashion-item-validation';
import type { z } from 'zod';
import { fashionItemFormData, getFashionItemFormFields } from '../fashion-items-handlers';
import { handleArrayField, handleBooleanField, handleIdField, handleImage } from '../form-helpers';

type ValidatedData =
  | z.infer<typeof fashionItemCreateFormSchema>
  | z.infer<typeof fashionItemUpdateFormSchema>;

// モックの設定
jest.mock('../form-helpers', () => ({
  handleArrayField: jest.fn(),
  handleBooleanField: jest.fn(),
  handleIdField: jest.fn(),
  handleImage: jest.fn(),
}));

describe('Fashion Items Form Handlers', () => {
  describe('getFashionItemFormFields', () => {
    it('FormDataから正しくフィールドを取得する', () => {
      const formData = new FormData();
      formData.append('sub_category', '1');
      formData.append('brand', '2');
      formData.append('seasons', 'spring');
      formData.append('seasons', 'summer');
      formData.append('price_range', '3');
      formData.append('design', '4');
      formData.append('main_color', '5');
      formData.append('is_owned', 'true');
      formData.append('is_old_clothes', 'false');
      const mockFile = new File([''], 'test.jpg', { type: 'image/jpeg' });
      formData.append('image', mockFile);

      const result = getFashionItemFormFields(formData);

      expect(result).toEqual({
        sub_category: '1',
        brand: '2',
        seasons: ['spring', 'summer'],
        price_range: '3',
        design: '4',
        main_color: '5',
        is_owned: true,
        is_old_clothes: false,
        image: mockFile,
      });
    });

    it('オプショナルなフィールドが未設定の場合、適切なデフォルト値を返す', () => {
      const formData = new FormData();
      formData.append('sub_category', '1');
      formData.append('seasons', 'spring');

      const result = getFashionItemFormFields(formData);

      expect(result).toEqual({
        sub_category: '1',
        brand: null,
        seasons: ['spring'],
        price_range: null,
        design: null,
        main_color: null,
        is_owned: false,
        is_old_clothes: false,
        image: null,
      });
    });
  });

  describe('fashionItemFormData', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    describe('Create Mode', () => {
      it('新規作成時に正しくFormDataを生成する', () => {
        const mockValidatedData = {
          image: new File([''], 'test.jpg', { type: 'image/jpeg' }),
          sub_category: '1',
          brand: '2',
          seasons: ['spring', 'summer'] as const,
          price_range: '3',
          design: '4',
          main_color: '5',
          is_owned: true,
          is_old_clothes: false,
        } satisfies ValidatedData;

        (handleImage as jest.Mock).mockReturnValue(true);
        (handleArrayField as jest.Mock).mockReturnValue(true);

        const { apiFormData, hasChanges } = fashionItemFormData(mockValidatedData);

        expect(hasChanges).toBe(true);
        expect(handleImage).toHaveBeenCalledWith(apiFormData, mockValidatedData.image);
        expect(handleArrayField).toHaveBeenCalledWith(
          apiFormData,
          'seasons',
          mockValidatedData.seasons,
          undefined,
        );
      });

      it('nullやundefinedの値は無視される', () => {
        const mockValidatedData = {
          image: null,
          sub_category: '1',
          brand: null,
          seasons: ['spring'] as const,
          price_range: null,
          design: null,
          main_color: null,
          is_owned: true,
          is_old_clothes: false,
        } satisfies ValidatedData;

        (handleImage as jest.Mock).mockReturnValue(false);
        (handleArrayField as jest.Mock).mockReturnValue(true);

        const { apiFormData, hasChanges } = fashionItemFormData(mockValidatedData);

        expect(hasChanges).toBe(true);
        expect(handleImage).toHaveBeenCalledWith(apiFormData, null);
      });
    });

    describe('Update Mode', () => {
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

      it('更新時に変更がある場合、正しくFormDataを生成する', () => {
        const mockValidatedData = {
          image: new File([''], 'new-test.jpg', { type: 'image/jpeg' }),
          sub_category: '2',
          brand: '2',
          seasons: ['spring', 'summer'] as const,
          price_range: '2',
          design: '2',
          main_color: '2',
          is_owned: false,
          is_old_clothes: true,
        } satisfies ValidatedData;

        (handleImage as jest.Mock).mockReturnValue(true);
        (handleArrayField as jest.Mock).mockReturnValue(true);
        (handleIdField as jest.Mock).mockReturnValue(true);
        (handleBooleanField as jest.Mock).mockReturnValue(true);

        const { hasChanges } = fashionItemFormData(mockValidatedData, mockInitialData);

        expect(hasChanges).toBe(true);
        expect(handleImage).toHaveBeenCalled();
        expect(handleArrayField).toHaveBeenCalled();
        expect(handleIdField).toHaveBeenCalled();
        expect(handleBooleanField).toHaveBeenCalled();
      });

      it('更新時に変更がない場合、hasChangesはfalseを返す', () => {
        const mockValidatedData = {
          image: new File([''], 'test.jpg', { type: 'image/jpeg' }),
          sub_category: '1',
          brand: '1',
          seasons: ['spring'] as const,
          price_range: '1',
          design: '1',
          main_color: '1',
          is_owned: true,
          is_old_clothes: false,
        } satisfies ValidatedData;

        (handleImage as jest.Mock).mockReturnValue(false);
        (handleArrayField as jest.Mock).mockReturnValue(false);
        (handleIdField as jest.Mock).mockReturnValue(false);
        (handleBooleanField as jest.Mock).mockReturnValue(false);

        const { hasChanges } = fashionItemFormData(mockValidatedData, mockInitialData);

        expect(hasChanges).toBe(false);
      });

      it('sub_categoryが変更された場合、正しくFormDataを更新する', () => {
        const mockValidatedData = {
          image: null,
          sub_category: '2',
          brand: '1',
          seasons: ['spring'] as const,
          price_range: '1',
          design: '1',
          main_color: '1',
          is_owned: true,
          is_old_clothes: false,
        } satisfies ValidatedData;

        (handleImage as jest.Mock).mockReturnValue(false);
        (handleArrayField as jest.Mock).mockReturnValue(false);
        (handleIdField as jest.Mock).mockReturnValue(false);
        (handleBooleanField as jest.Mock).mockReturnValue(false);

        const { hasChanges } = fashionItemFormData(mockValidatedData, mockInitialData);

        expect(hasChanges).toBe(true);
      });
    });
  });
});
