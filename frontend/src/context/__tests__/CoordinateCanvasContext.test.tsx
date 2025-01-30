import type { ItemStyle } from '@/features/coordinate/types';
import type { InitialItems } from '@/features/my-page/coordinate/types';
import type { FashionItem } from '@/types';
import { DEFAULT_POSITION, INITIAL_POSITIONS } from '@/utils/data/canvasInitialPositions';
import { act, render, renderHook, screen } from '@testing-library/react';
import {
  CoordinateCanvasStateProvider,
  useCoordinateCanvasState,
} from '../CoordinateCanvasContext';

describe('CoordinateCanvasStateProvider', () => {
  // モックアイテムの作成
  const mockFashionItem: FashionItem = {
    id: '1',
    image: 'test-image.jpg',
    sub_category: {
      id: 'sub1',
      subcategory_name: 'Tシャツ',
      category: 'tops',
    },
    brand: {
      id: 'brand1',
      brand_name: 'TestBrand',
      brand_name_kana: 'テストブランド',
    },
    seasons: [
      {
        id: 'season1',
        season_name: '春',
      },
    ],
    price_range: {
      id: 'price1',
      price_range: '¥5,000-¥10,000',
    },
    design: {
      id: 'design1',
      design_pattern: 'ストライプ',
    },
    main_color: {
      id: 'color1',
      color_name: '黒',
      color_code: '#000000',
    },
    is_owned: true,
    is_old_clothes: false,
    created_at: new Date('2024-01-01'),
    updated_at: new Date('2024-01-01'),
  };

  const mockInitialItems: InitialItems = {
    items: [
      {
        item_id: '1',
        image: 'test-image.jpg',
        position_data: {
          scale: 1.2,
          rotate: 45,
          zIndex: 1,
          xPercent: 50,
          yPercent: 50,
        },
      },
    ],
    background: 'bg-gray-100',
  };

  // 初期状態のテスト
  describe('initial state', () => {
    it('provides default values when no initialItems provided', () => {
      const TestComponent = () => {
        const { state } = useCoordinateCanvasState();
        return (
          <div>
            <div data-testid="selected-items">{state.selectedItems.length}</div>
            <div data-testid="background">{state.background}</div>
          </div>
        );
      };

      render(
        <CoordinateCanvasStateProvider>
          <TestComponent />
        </CoordinateCanvasStateProvider>,
      );

      expect(screen.getByTestId('selected-items')).toHaveTextContent('0');
      expect(screen.getByTestId('background')).toHaveTextContent('bg-white');
    });

    it('initializes with provided initialItems', () => {
      const { result } = renderHook(() => useCoordinateCanvasState(), {
        wrapper: ({ children }) => (
          <CoordinateCanvasStateProvider initialItems={mockInitialItems}>
            {children}
          </CoordinateCanvasStateProvider>
        ),
      });

      expect(result.current.state.selectedItems).toHaveLength(1);
      expect(result.current.state.background).toBe('bg-gray-100');
      expect(result.current.state.itemStyles['1']).toEqual({
        scale: 1.2,
        rotate: 45,
        zIndex: 1,
        xPercent: 50,
        yPercent: 50,
      });
    });
  });

  // アイテム選択のテスト
  describe('item selection', () => {
    it('adds new item with correct initial position', () => {
      const { result } = renderHook(() => useCoordinateCanvasState(), {
        wrapper: CoordinateCanvasStateProvider,
      });

      act(() => {
        result.current.handlers.handleSelectItem(mockFashionItem);
      });

      const expectedInitialPosition = INITIAL_POSITIONS['tops'] || DEFAULT_POSITION;
      expect(result.current.state.selectedItems).toHaveLength(1);
      expect(result.current.state.itemStyles['1']).toEqual({
        ...expectedInitialPosition,
        scale: 1,
        rotate: 0,
        zIndex: 1,
      });
    });

    it('removes item when selected again', () => {
      const { result } = renderHook(() => useCoordinateCanvasState(), {
        wrapper: CoordinateCanvasStateProvider,
      });

      act(() => {
        result.current.handlers.handleSelectItem(mockFashionItem);
        result.current.handlers.handleSelectItem(mockFashionItem);
      });

      expect(result.current.state.selectedItems).toHaveLength(0);
      expect(result.current.state.itemStyles['1']).toBeUndefined();
    });

    it('handles multiple items with correct z-index', () => {
      const { result } = renderHook(() => useCoordinateCanvasState(), {
        wrapper: CoordinateCanvasStateProvider,
      });

      const secondItem = { ...mockFashionItem, id: '2' };

      act(() => {
        result.current.handlers.handleSelectItem(mockFashionItem);
        result.current.handlers.handleSelectItem(secondItem);
      });

      expect(result.current.state.selectedItems).toHaveLength(2);
      expect(result.current.state.itemStyles['1'].zIndex).toBe(1);
      expect(result.current.state.itemStyles['2'].zIndex).toBe(2);
    });
  });

  // スタイル更新のテスト
  describe('style updates', () => {
    it('updates styles correctly', () => {
      const { result } = renderHook(() => useCoordinateCanvasState(), {
        wrapper: CoordinateCanvasStateProvider,
      });

      const newStyles: Record<string, ItemStyle> = {
        '1': {
          scale: 1.5,
          rotate: 90,
          zIndex: 2,
          xPercent: 75,
          yPercent: 25,
        },
      };

      act(() => {
        result.current.handlers.handleSelectItem(mockFashionItem);
        result.current.handlers.handleUpdateStyles(newStyles);
      });

      expect(result.current.state.itemStyles['1']).toEqual(newStyles['1']);
    });
  });

  // アイテム削除のテスト
  describe('item removal', () => {
    it('removes specific item correctly', () => {
      const { result } = renderHook(() => useCoordinateCanvasState(), {
        wrapper: CoordinateCanvasStateProvider,
      });

      act(() => {
        result.current.handlers.handleSelectItem(mockFashionItem);
        result.current.handlers.handleRemoveItem('1');
      });

      expect(result.current.state.selectedItems).toHaveLength(0);
      expect(result.current.state.itemStyles['1']).toBeUndefined();
    });
  });

  // リセット機能のテスト
  describe('reset functionality', () => {
    it('resets canvas to initial state', () => {
      const { result } = renderHook(() => useCoordinateCanvasState(), {
        wrapper: CoordinateCanvasStateProvider,
      });

      act(() => {
        result.current.handlers.handleSelectItem(mockFashionItem);
        result.current.handlers.handleFullReset();
      });

      expect(result.current.state.selectedItems).toHaveLength(0);
      expect(Object.keys(result.current.state.itemStyles)).toHaveLength(0);
    });
  });

  // 背景変更のテスト
  describe('background changes', () => {
    it('updates background correctly', () => {
      const { result } = renderHook(() => useCoordinateCanvasState(), {
        wrapper: CoordinateCanvasStateProvider,
      });

      act(() => {
        result.current.handlers.handleBackgroundChange('bg-gray-200');
      });

      expect(result.current.state.background).toBe('bg-gray-200');
    });
  });

  // エラーハンドリングのテスト
  it('throws error when used outside provider', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      renderHook(() => useCoordinateCanvasState());
    }).toThrow('useCoordinate must be used within a CoordinateProvider');

    consoleError.mockRestore();
  });
});
