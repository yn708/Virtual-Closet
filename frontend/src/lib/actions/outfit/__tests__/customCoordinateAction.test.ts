import type { InitialItems } from '@/features/my-page/coordinate/types';
import { registerCoordinateAPI, updateCoordinateAPI } from '@/lib/api/coordinateApi';
import type { BaseCoordinate } from '@/types/coordinate';
import { customCoordinateFormData } from '@/utils/form/coordinate-handlers';
import {
  customCoordinateCreateFormSchema,
  customCoordinateUpdateFormSchema,
} from '@/utils/validations/coordinate-validation';
import { revalidatePath } from 'next/cache';
import {
  customCoordinateCreateAction,
  customCoordinateUpdateAction,
} from '../customCoordinateAction';

// モックの設定
jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}));

jest.mock('@/lib/api/coordinateApi', () => ({
  registerCoordinateAPI: jest.fn(),
  updateCoordinateAPI: jest.fn(),
}));

jest.mock('@/utils/form/coordinate-handlers', () => ({
  customCoordinateFormData: jest.fn(),
  getCustomCoordinateFormFields: jest.fn(),
}));

jest.mock('@/utils/validations/coordinate-validation', () => ({
  customCoordinateCreateFormSchema: {
    safeParse: jest.fn(),
  },
  customCoordinateUpdateFormSchema: {
    safeParse: jest.fn(),
  },
}));

describe('Coordinate Actions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('customCoordinateCreateAction', () => {
    const mockFormData = new FormData();
    const mockPrevState = {
      message: null,
      errors: null,
    };

    it('バリデーション成功時に正しく処理が実行される', async () => {
      // バリデーション成功のモック
      const mockValidatedData = {
        image: new File([''], 'test.jpg', { type: 'image/jpeg' }),
        items: JSON.stringify({ items: [], background: '#ffffff' }),
        seasons: ['1'],
        scenes: ['1'],
        tastes: ['1'],
      };

      (customCoordinateCreateFormSchema.safeParse as jest.Mock).mockReturnValue({
        success: true,
        data: mockValidatedData,
      });

      // FormDataの生成モック
      const mockApiFormData = new FormData();
      (customCoordinateFormData as jest.Mock).mockReturnValue({
        apiFormData: mockApiFormData,
        hasChanges: true,
      });

      await customCoordinateCreateAction(mockPrevState, mockFormData);

      expect(registerCoordinateAPI).toHaveBeenCalledWith('custom', mockApiFormData);
      expect(revalidatePath).toHaveBeenCalled();
    });

    it('バリデーション失敗時にエラーを返す', async () => {
      // バリデーション失敗のモック
      const mockError = {
        flatten: () => ({
          fieldErrors: {
            image: ['画像は必須です'],
          },
        }),
      };

      (customCoordinateCreateFormSchema.safeParse as jest.Mock).mockReturnValue({
        success: false,
        error: mockError,
      });

      const result = await customCoordinateCreateAction(mockPrevState, mockFormData);

      expect(result).toEqual({
        message: 'バリデーションエラー',
        errors: {
          image: ['画像は必須です'],
        },
        success: false,
      });
      expect(registerCoordinateAPI).not.toHaveBeenCalled();
    });
  });

  describe('customCoordinateUpdateAction', () => {
    const mockFormData = new FormData();
    const mockPrevState = {
      message: null,
      errors: null,
    };
    const mockInitialData: BaseCoordinate = {
      id: '1',
      image: 'test.jpg',
      seasons: [{ id: '1', season_name: '春' }],
      scenes: [{ id: '1', scene: 'デイリー' }],
      tastes: [{ id: '1', taste: 'カジュアル' }],
    };
    const mockInitialItems: InitialItems = {
      items: [
        {
          item_id: '1',
          image: 'item.jpg',
          position_data: {
            scale: 1,
            rotate: 0,
            zIndex: 1,
            xPercent: 0,
            yPercent: 0,
          },
        },
      ],
      background: '#ffffff',
    };

    it('バリデーション成功かつ変更がある場合に正しく更新される', async () => {
      const mockValidatedData = {
        image: new File([''], 'new-test.jpg', { type: 'image/jpeg' }),
        items: JSON.stringify({ items: [], background: '#000000' }),
        seasons: ['2'],
        scenes: ['2'],
        tastes: ['2'],
      };

      (customCoordinateUpdateFormSchema.safeParse as jest.Mock).mockReturnValue({
        success: true,
        data: mockValidatedData,
      });

      const mockApiFormData = new FormData();
      (customCoordinateFormData as jest.Mock).mockReturnValue({
        apiFormData: mockApiFormData,
        hasChanges: true,
      });

      const mockUpdatedItem = { ...mockInitialData, image: 'new-test.jpg' };
      (updateCoordinateAPI as jest.Mock).mockResolvedValue(mockUpdatedItem);

      const result = await customCoordinateUpdateAction(
        mockPrevState,
        mockFormData,
        mockInitialData,
        mockInitialItems,
      );

      expect(updateCoordinateAPI).toHaveBeenCalledWith('custom', '1', mockApiFormData);
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
        items: JSON.stringify(mockInitialItems),
        seasons: ['1'],
        scenes: ['1'],
        tastes: ['1'],
      };

      (customCoordinateUpdateFormSchema.safeParse as jest.Mock).mockReturnValue({
        success: true,
        data: mockValidatedData,
      });

      (customCoordinateFormData as jest.Mock).mockReturnValue({
        apiFormData: new FormData(),
        hasChanges: false,
      });

      const result = await customCoordinateUpdateAction(
        mockPrevState,
        mockFormData,
        mockInitialData,
        mockInitialItems,
      );

      expect(updateCoordinateAPI).not.toHaveBeenCalled();
      expect(result).toEqual({
        message: '変更がありません',
        errors: null,
        success: false,
        hasChanges: false,
      });
    });

    it('エラー発生時に適切なエラーメッセージを返す', async () => {
      const mockError = new Error('APIエラー');
      (customCoordinateUpdateFormSchema.safeParse as jest.Mock).mockReturnValue({
        success: true,
        data: {},
      });

      (customCoordinateFormData as jest.Mock).mockReturnValue({
        apiFormData: new FormData(),
        hasChanges: true,
      });

      (updateCoordinateAPI as jest.Mock).mockRejectedValue(mockError);

      const result = await customCoordinateUpdateAction(
        mockPrevState,
        mockFormData,
        mockInitialData,
        mockInitialItems,
      );

      expect(result).toEqual({
        message: 'APIエラー',
        errors: null,
        success: false,
      });
    });
  });
});
