import { registerCoordinateAPI, updateCoordinateAPI } from '@/lib/api/coordinateApi';
import type { BaseCoordinate } from '@/types/coordinate';
import { photoCoordinateFormData } from '@/utils/form/coordinate-handlers';
import {
  photoCoordinateCreateFormSchema,
  photoCoordinateUpdateFormSchema,
} from '@/utils/validations/coordinate-validation';
import { revalidatePath } from 'next/cache';
import { photoCoordinateCreateAction, photoCoordinateUpdateAction } from '../photoCoordinateAction';

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
  photoCoordinateFormData: jest.fn(),
  getPhotoCoordinateFormFields: jest.fn(),
}));

jest.mock('@/utils/validations/coordinate-validation', () => ({
  photoCoordinateCreateFormSchema: {
    safeParse: jest.fn(),
  },
  photoCoordinateUpdateFormSchema: {
    safeParse: jest.fn(),
  },
}));

describe('Photo Coordinate Actions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('photoCoordinateCreateAction', () => {
    const mockFormData = new FormData();
    const mockPrevState = {
      message: null,
      errors: null,
    };

    it('バリデーション成功時に正しく処理が実行される', async () => {
      // バリデーション成功のモック
      const mockValidatedData = {
        image: new File([''], 'test.jpg', { type: 'image/jpeg' }),
        seasons: ['1'],
        scenes: ['1'],
        tastes: ['1'],
      };

      (photoCoordinateCreateFormSchema.safeParse as jest.Mock).mockReturnValue({
        success: true,
        data: mockValidatedData,
      });

      // FormDataの生成モック
      const mockApiFormData = new FormData();
      (photoCoordinateFormData as jest.Mock).mockReturnValue({
        apiFormData: mockApiFormData,
        hasChanges: true,
      });

      await photoCoordinateCreateAction(mockPrevState, mockFormData);

      expect(registerCoordinateAPI).toHaveBeenCalledWith('photo', mockApiFormData);
      expect(revalidatePath).toHaveBeenCalled();
    });

    it('バリデーション失敗時にエラーを返す', async () => {
      // バリデーション失敗のモック
      const mockError = {
        flatten: () => ({
          fieldErrors: {
            image: ['画像は必須です'],
            seasons: ['シーズンは1つ以上選択してください'],
          },
        }),
      };

      (photoCoordinateCreateFormSchema.safeParse as jest.Mock).mockReturnValue({
        success: false,
        error: mockError,
      });

      const result = await photoCoordinateCreateAction(mockPrevState, mockFormData);

      expect(result).toEqual({
        message: 'バリデーションエラー',
        errors: {
          image: ['画像は必須です'],
          seasons: ['シーズンは1つ以上選択してください'],
        },
        success: false,
      });
      expect(registerCoordinateAPI).not.toHaveBeenCalled();
    });
  });

  describe('photoCoordinateUpdateAction', () => {
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

    it('バリデーション成功かつ変更がある場合に正しく更新される', async () => {
      const mockValidatedData = {
        image: new File([''], 'new-test.jpg', { type: 'image/jpeg' }),
        seasons: ['2'],
        scenes: ['2'],
        tastes: ['2'],
      };

      (photoCoordinateUpdateFormSchema.safeParse as jest.Mock).mockReturnValue({
        success: true,
        data: mockValidatedData,
      });

      const mockApiFormData = new FormData();
      (photoCoordinateFormData as jest.Mock).mockReturnValue({
        apiFormData: mockApiFormData,
        hasChanges: true,
      });

      const mockUpdatedItem = { ...mockInitialData, image: 'new-test.jpg' };
      (updateCoordinateAPI as jest.Mock).mockResolvedValue(mockUpdatedItem);

      const result = await photoCoordinateUpdateAction(
        mockPrevState,
        mockFormData,
        mockInitialData,
      );

      expect(updateCoordinateAPI).toHaveBeenCalledWith('photo', '1', mockApiFormData);
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
        seasons: ['1'],
        scenes: ['1'],
        tastes: ['1'],
      };

      (photoCoordinateUpdateFormSchema.safeParse as jest.Mock).mockReturnValue({
        success: true,
        data: mockValidatedData,
      });

      (photoCoordinateFormData as jest.Mock).mockReturnValue({
        apiFormData: new FormData(),
        hasChanges: false,
      });

      const result = await photoCoordinateUpdateAction(
        mockPrevState,
        mockFormData,
        mockInitialData,
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
      (photoCoordinateUpdateFormSchema.safeParse as jest.Mock).mockReturnValue({
        success: true,
        data: {},
      });

      (photoCoordinateFormData as jest.Mock).mockReturnValue({
        apiFormData: new FormData(),
        hasChanges: true,
      });

      (updateCoordinateAPI as jest.Mock).mockRejectedValue(mockError);

      const result = await photoCoordinateUpdateAction(
        mockPrevState,
        mockFormData,
        mockInitialData,
      );

      expect(result).toEqual({
        message: 'APIエラー',
        errors: null,
        success: false,
      });
    });
  });
});
