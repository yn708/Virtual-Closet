import type { InitialItems } from '@/features/my-page/coordinate/types';
import { registerCustomCoordinateAPI, updateCustomCoordinateAPI } from '@/lib/api/coordinateApi';
import type { BaseCoordinate, ItemsData } from '@/types/coordinate';
import { customCoordinateFormData } from '@/utils/form/coordinate-handlers';
import { baseCoordinateSchema } from '@/utils/validations/coordinate-validation';
import {
  customCoordinateCreateAction,
  customCoordinateUpdateAction,
} from '../customCoordinateAction';

// モックの設定
jest.mock('@/lib/api/coordinateApi', () => ({
  registerCustomCoordinateAPI: jest.fn(),
  updateCustomCoordinateAPI: jest.fn(),
}));

jest.mock('@/utils/form/coordinate-handlers', () => ({
  customCoordinateFormData: jest.fn(),
  getCustomCoordinateFormFields: jest.fn(),
}));

jest.mock('@/utils/validations/coordinate-validation', () => ({
  baseCoordinateSchema: {
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
      ],
      background: '#ffffff',
    };

    it('バリデーション成功時に正しく処理が実行される', async () => {
      const mockValidatedData = {
        seasons: ['1'],
        scenes: ['1'],
        tastes: ['1'],
      };

      (baseCoordinateSchema.safeParse as jest.Mock).mockReturnValue({
        success: true,
        data: mockValidatedData,
      });

      await customCoordinateCreateAction(mockPrevState, mockFormData, mockItemsData);

      expect(registerCustomCoordinateAPI).toHaveBeenCalledWith({
        data: mockItemsData,
        seasons: mockValidatedData.seasons,
        scenes: mockValidatedData.scenes,
        tastes: mockValidatedData.tastes,
      });
    });

    it('バリデーション失敗時にエラーを返す', async () => {
      const mockError = {
        flatten: () => ({
          fieldErrors: {
            seasons: ['シーズンは必須です'],
          },
        }),
      };

      (baseCoordinateSchema.safeParse as jest.Mock).mockReturnValue({
        success: false,
        error: mockError,
      });

      const result = await customCoordinateCreateAction(mockPrevState, mockFormData, mockItemsData);

      expect(result).toEqual({
        message: 'バリデーションエラー',
        errors: {
          seasons: ['シーズンは必須です'],
        },
        success: false,
      });
      expect(registerCustomCoordinateAPI).not.toHaveBeenCalled();
    });

    it('APIエラー時に適切なエラーメッセージを返す', async () => {
      (baseCoordinateSchema.safeParse as jest.Mock).mockReturnValue({
        success: true,
        data: {},
      });

      const mockError = new Error(
        JSON.stringify({ non_field_errors: ['APIエラーが発生しました'] }),
      );
      (registerCustomCoordinateAPI as jest.Mock).mockRejectedValue(mockError);

      const result = await customCoordinateCreateAction(mockPrevState, mockFormData, mockItemsData);

      expect(result).toEqual({
        message: 'APIエラーが発生しました',
        errors: null,
        success: false,
      });
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
    const mockItemsData: ItemsData = {
      items: [
        {
          item: '2',
          position_data: {
            scale: 1,
            rotate: 0,
            zIndex: 1,
            xPercent: 10,
            yPercent: 10,
          },
        },
      ],
      background: '#000000',
    };

    it('バリデーション成功かつ変更がある場合に正しく更新される', async () => {
      const mockValidatedData = {
        seasons: ['2'],
        scenes: ['2'],
        tastes: ['2'],
      };

      (baseCoordinateSchema.safeParse as jest.Mock).mockReturnValue({
        success: true,
        data: mockValidatedData,
      });

      const mockChangedFields = {
        data: mockItemsData,
        seasons: ['2'],
        scenes: ['2'],
        tastes: ['2'],
      };

      (customCoordinateFormData as jest.Mock).mockReturnValue({
        hasChanges: true,
        changedFields: mockChangedFields,
      });

      const mockUpdatedItem = { ...mockInitialData, seasons: [{ id: '2', season_name: '夏' }] };
      (updateCustomCoordinateAPI as jest.Mock).mockResolvedValue(mockUpdatedItem);

      const result = await customCoordinateUpdateAction(
        mockPrevState,
        mockFormData,
        mockInitialData,
        mockItemsData,
        mockInitialItems,
      );

      expect(updateCustomCoordinateAPI).toHaveBeenCalledWith('1', mockChangedFields);
      expect(result).toEqual({
        message: '更新が完了しました',
        errors: null,
        success: true,
        hasChanges: true,
        updatedItem: mockUpdatedItem,
      });
    });

    it('変更がない場合は更新を実行しない', async () => {
      (baseCoordinateSchema.safeParse as jest.Mock).mockReturnValue({
        success: true,
        data: {},
      });

      (customCoordinateFormData as jest.Mock).mockReturnValue({
        hasChanges: false,
        changedFields: {},
      });

      const result = await customCoordinateUpdateAction(
        mockPrevState,
        mockFormData,
        mockInitialData,
        mockItemsData,
        mockInitialItems,
      );

      expect(updateCustomCoordinateAPI).not.toHaveBeenCalled();
      expect(result).toEqual({
        message: '変更がありません',
        errors: null,
        success: false,
        hasChanges: false,
      });
    });

    it('エラー発生時に適切なエラーメッセージを返す', async () => {
      const mockError = new Error('APIエラー');
      (baseCoordinateSchema.safeParse as jest.Mock).mockReturnValue({
        success: true,
        data: {},
      });

      (customCoordinateFormData as jest.Mock).mockReturnValue({
        hasChanges: true,
        changedFields: {},
      });

      (updateCustomCoordinateAPI as jest.Mock).mockRejectedValue(mockError);

      const result = await customCoordinateUpdateAction(
        mockPrevState,
        mockFormData,
        mockInitialData,
        mockItemsData,
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
