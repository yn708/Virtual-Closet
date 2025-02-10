import type { InitialItems } from '@/features/my-page/coordinate/types';
import type { BaseCoordinate, ItemsData } from '@/types/coordinate';
import type {
  baseCoordinateSchema,
  photoCoordinateCreateFormSchema,
} from '@/utils/validations/coordinate-validation';
import type { z } from 'zod';
import {
  customCoordinateFormData,
  getCustomCoordinateFormFields,
  getPhotoCoordinateFormFields,
  photoCoordinateFormData,
} from '../coordinate-handlers';
import { handleArrayField, handleImage } from '../form-helpers';

// モック化
jest.mock('../form-helpers', () => ({
  handleArrayField: jest.fn(),
  handleImage: jest.fn(),
}));

describe('Coordinate Form Handlers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getPhotoCoordinateFormFields', () => {
    it('FormDataから正しくフィールドを取得する', () => {
      const formData = new FormData();
      const mockFile = new File(['dummy content'], 'test.jpg', { type: 'image/jpeg' });
      formData.append('image', mockFile);
      formData.append('seasons', 'spring');
      formData.append('seasons', 'summer');
      formData.append('tastes', 'casual');
      formData.append('scenes', 'daily');

      const result = getPhotoCoordinateFormFields(formData);

      expect(result).toEqual({
        image: mockFile,
        seasons: ['spring', 'summer'],
        tastes: ['casual'],
        scenes: ['daily'],
      });
    });

    it('オプショナルなフィールドが未設定の場合、適切なデフォルト値を返す', () => {
      const formData = new FormData();
      formData.append('seasons', 'spring');

      const result = getPhotoCoordinateFormFields(formData);

      expect(result).toEqual({
        image: null,
        seasons: ['spring'],
        tastes: [],
        scenes: [],
      });
    });
  });

  describe('getCustomCoordinateFormFields', () => {
    it('FormDataから正しくフィールドを取得する', () => {
      const formData = new FormData();
      formData.append('seasons', 'spring');
      formData.append('tastes', 'casual');
      formData.append('scenes', 'daily');

      const result = getCustomCoordinateFormFields(formData);

      expect(result).toEqual({
        seasons: ['spring'],
        tastes: ['casual'],
        scenes: ['daily'],
      });
    });

    it('オプショナルなフィールドが未設定の場合、適切なデフォルト値を返す', () => {
      const formData = new FormData();
      formData.append('seasons', 'spring');

      const result = getCustomCoordinateFormFields(formData);

      expect(result).toEqual({
        seasons: ['spring'],
        tastes: [],
        scenes: [],
      });
    });
  });

  describe('photoCoordinateFormData', () => {
    const mockValidatedData = {
      image: new File(['dummy content'], 'test.jpg', { type: 'image/jpeg' }),
      seasons: ['spring', 'summer'],
      tastes: ['casual'],
      scenes: ['daily'],
    } as z.infer<typeof photoCoordinateCreateFormSchema>;

    it('新規作成時に正しくFormDataを生成する', () => {
      (handleImage as jest.Mock).mockReturnValue(true);
      (handleArrayField as jest.Mock).mockReturnValue(true);

      const { apiFormData, hasChanges } = photoCoordinateFormData(mockValidatedData);

      expect(hasChanges).toBe(true);
      expect(handleImage).toHaveBeenCalledWith(apiFormData, mockValidatedData.image);
      expect(handleArrayField).toHaveBeenCalledTimes(3); // seasons, tastes, scenes の3つ
    });

    it('更新時に変更がある場合、正しくFormDataを生成する', () => {
      const mockInitialData: BaseCoordinate = {
        id: '1',
        image: 'old-test.jpg',
        seasons: [{ id: '1', season_name: '春' }],
        tastes: [{ id: '1', taste: 'カジュアル' }],
        scenes: [{ id: '1', scene: 'デイリー' }],
      };

      (handleImage as jest.Mock).mockReturnValue(true);
      (handleArrayField as jest.Mock).mockReturnValue(true);

      const { hasChanges } = photoCoordinateFormData(mockValidatedData, mockInitialData);
      expect(hasChanges).toBe(true);
    });
  });

  describe('customCoordinateFormData', () => {
    const mockItemsData: ItemsData = {
      items: [
        {
          item: '1',
          position_data: {
            scale: 1,
            rotate: 0,
            zIndex: 1,
            xPercent: 0,
            yPercent: 0,
          },
        },
        {
          item: '2',
          position_data: {
            scale: 1,
            rotate: 0,
            zIndex: 2,
            xPercent: 10,
            yPercent: 10,
          },
        },
      ],
      background: '#ffffff',
    };

    const mockValidatedData = {
      seasons: ['spring', 'summer'],
      tastes: ['casual'],
      scenes: ['daily'],
    } as z.infer<typeof baseCoordinateSchema>;

    it('新規作成時に正しくデータを生成する', () => {
      (handleArrayField as jest.Mock).mockReturnValue(true);

      const { hasChanges, changedFields } = customCoordinateFormData(
        mockValidatedData,
        mockItemsData,
      );

      expect(hasChanges).toBe(true);
      expect(changedFields).toEqual({
        data: {
          background: '#ffffff',
          items: mockItemsData.items,
        },
        seasons: ['spring', 'summer'],
        tastes: ['casual'],
        scenes: ['daily'],
      });
    });

    it('更新時にアイテムが変更された場合、正しく処理する', () => {
      const mockInitialData: BaseCoordinate = {
        id: '1',
        image: 'test.jpg',
        seasons: [{ id: '1', season_name: '春' }],
        tastes: [{ id: '1', taste: 'カジュアル' }],
        scenes: [{ id: '1', scene: 'デイリー' }],
      };

      const mockInitialItems: InitialItems = {
        items: [
          {
            item_id: '1',
            image: 'item1.jpg',
            position_data: {
              scale: 1,
              rotate: 0,
              zIndex: 1,
              xPercent: 0,
              yPercent: 0,
            },
          },
        ],
        background: '#000000', // 異なる背景色で変更があるとする
      };

      const { hasChanges, changedFields } = customCoordinateFormData(
        mockValidatedData,
        mockItemsData,
        mockInitialData,
        mockInitialItems,
      );

      expect(hasChanges).toBe(true);
      expect(changedFields).toHaveProperty('data');
      expect(changedFields.data).toEqual({
        background: '#ffffff',
        items: mockItemsData.items,
      });
    });

    it('無効なアイテムデータの場合、適切に処理する', () => {
      const invalidItemsData = {
        items: [],
        background: '',
      } as ItemsData;

      const { hasChanges, changedFields } = customCoordinateFormData(
        mockValidatedData,
        invalidItemsData,
      );

      (handleArrayField as jest.Mock).mockReturnValue(true);

      expect(hasChanges).toBe(true);
      expect(changedFields).toEqual({
        seasons: ['spring', 'summer'],
        tastes: ['casual'],
        scenes: ['daily'],
      });
    });
  });
});
