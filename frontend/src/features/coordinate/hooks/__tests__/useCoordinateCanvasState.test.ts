import type { FashionItem } from '@/types';
import { DEFAULT_POSITION, INITIAL_POSITIONS } from '@/utils/data/canvasInitialPositions';
import { act, renderHook } from '@testing-library/react';
import { useCoordinateCanvasState } from '../useCoordinateCanvasState';

describe('useCoordinateCanvasState', () => {
  // テスト用のモックアイテム
  const mockItem: FashionItem = {
    id: 'item-1',
    image: 'test.jpg',
    sub_category: {
      id: 'subcat-1',
      subcategory_name: 'Test Subcategory',
      category: 'tops',
    },
    brand: {
      id: 'brand-1',
      brand_name: 'Test Brand',
      brand_name_kana: 'テストブランド',
    },
    seasons: [
      {
        id: 'season-1',
        season_name: 'Spring',
      },
    ],
    price_range: {
      id: 'price-1',
      price_range: '¥5,000-¥10,000',
    },
    design: {
      id: 'design-1',
      design_pattern: 'Solid',
    },
    main_color: {
      id: 'color-1',
      color_name: 'Black',
      color_code: '#000000',
    },
    is_owned: true,
    is_old_clothes: false,
    created_at: new Date(),
    updated_at: new Date(),
  };

  const mockItem2: FashionItem = {
    ...mockItem,
    id: 'item-2',
    sub_category: {
      ...mockItem.sub_category,
      id: 'subcat-2',
      category: 'bottoms',
    },
  };

  it('初期状態が正しく設定されること', () => {
    const { result } = renderHook(() => useCoordinateCanvasState());

    expect(result.current.state).toEqual({
      selectedItems: [],
      itemStyles: {},
      background: 'bg-white',
    });
  });

  describe('アイテム選択の管理', () => {
    it('新規アイテムが正しく追加されること', () => {
      const { result } = renderHook(() => useCoordinateCanvasState());

      act(() => {
        result.current.handlers.handleSelectItem(mockItem);
      });

      expect(result.current.state.selectedItems).toHaveLength(1);
      expect(result.current.state.selectedItems[0]).toBe(mockItem);
      expect(result.current.state.itemStyles[mockItem.id]).toEqual({
        ...INITIAL_POSITIONS[mockItem.sub_category.category],
        scale: 1,
        rotate: 0,
        zIndex: 1,
      });
    });

    it('既存アイテムが正しく削除されること', () => {
      const { result } = renderHook(() => useCoordinateCanvasState());

      act(() => {
        result.current.handlers.handleSelectItem(mockItem);
      });

      expect(result.current.state.selectedItems).toHaveLength(1);

      act(() => {
        result.current.handlers.handleSelectItem(mockItem);
      });

      expect(result.current.state.selectedItems).toHaveLength(0);
      expect(result.current.state.itemStyles[mockItem.id]).toBeUndefined();
    });

    it('複数アイテムの追加と削除が正しく動作すること', () => {
      const { result } = renderHook(() => useCoordinateCanvasState());

      act(() => {
        result.current.handlers.handleSelectItem(mockItem);
        result.current.handlers.handleSelectItem(mockItem2);
      });

      expect(result.current.state.selectedItems).toHaveLength(2);
      expect(result.current.state.itemStyles[mockItem.id].zIndex).toBe(1);
      expect(result.current.state.itemStyles[mockItem2.id].zIndex).toBe(2);

      act(() => {
        result.current.handlers.handleRemoveItem(mockItem.id);
      });

      expect(result.current.state.selectedItems).toHaveLength(1);
      expect(result.current.state.itemStyles[mockItem.id]).toBeUndefined();
      expect(result.current.state.itemStyles[mockItem2.id]).toBeDefined();
    });

    it('存在しないカテゴリーの場合にデフォルト位置が使用されること', () => {
      const { result } = renderHook(() => useCoordinateCanvasState());
      const unknownCategoryItem: FashionItem = {
        ...mockItem,
        sub_category: {
          ...mockItem.sub_category,
          category: 'unknown_category',
        },
      };

      act(() => {
        result.current.handlers.handleSelectItem(unknownCategoryItem);
      });

      expect(result.current.state.itemStyles[unknownCategoryItem.id]).toEqual({
        ...DEFAULT_POSITION,
        scale: 1,
        rotate: 0,
        zIndex: 1,
      });
    });
  });

  describe('スタイル更新と状態管理', () => {
    it('アイテムのスタイルが正しく更新されること', () => {
      const { result } = renderHook(() => useCoordinateCanvasState());
      const newStyles = {
        [mockItem.id]: {
          xPercent: 60,
          yPercent: 40,
          scale: 1.5,
          rotate: 45,
          zIndex: 2,
        },
      };

      act(() => {
        result.current.handlers.handleSelectItem(mockItem);
        result.current.handlers.handleUpdateStyles(newStyles);
      });

      expect(result.current.state.itemStyles[mockItem.id]).toEqual(newStyles[mockItem.id]);
    });

    it('キャンバスのリセットが正しく動作すること', () => {
      const { result } = renderHook(() => useCoordinateCanvasState());

      act(() => {
        result.current.handlers.handleSelectItem(mockItem);
        result.current.handlers.handleFullReset();
      });

      expect(result.current.state.selectedItems).toHaveLength(0);
      expect(Object.keys(result.current.state.itemStyles)).toHaveLength(0);
    });

    it('背景色が正しく更新されること', () => {
      const { result } = renderHook(() => useCoordinateCanvasState());
      const newBackground = 'bg-gray-100';

      act(() => {
        result.current.handlers.handleBackgroundChange(newBackground);
      });

      expect(result.current.state.background).toBe(newBackground);
    });
  });
});
