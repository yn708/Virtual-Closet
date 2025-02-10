import { useToast } from '@/hooks/use-toast';
import { deleteCoordinateAPI, fetchCoordinateListAPI } from '@/lib/api/coordinateApi';
import type { BaseCoordinate } from '@/types/coordinate';
import { act, render, renderHook, screen } from '@testing-library/react';
import { CoordinatesProvider, useCoordinates } from '../CoordinatesContext';

// APIのモック
jest.mock('@/lib/api/coordinateApi', () => ({
  deleteCoordinateAPI: jest.fn(),
  fetchCoordinateListAPI: jest.fn(),
}));

// useToastのモック
jest.mock('@/hooks/use-toast', () => ({
  useToast: jest.fn(),
}));

describe('CoordinatesProvider', () => {
  const mockToast = { toast: jest.fn() };

  const mockCoordinate: BaseCoordinate = {
    id: '1',
    image: 'test-coordinate.jpg',
    seasons: [
      {
        id: '1',
        season_name: '春',
      },
    ] as [{ id: string; season_name: string }],
    scenes: [
      {
        id: '1',
        scene: 'カジュアル',
      },
    ] as [{ id: string; scene: string }],
    tastes: [
      {
        id: '1',
        taste: 'シンプル',
      },
    ] as [{ id: string; taste: string }],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useToast as jest.Mock).mockReturnValue(mockToast);
  });

  // 基本的なコンテキスト提供のテスト
  it('provides default values', () => {
    const TestComponent = () => {
      const { state } = useCoordinates();
      return (
        <div>
          <div data-testid="selected-category">{state.selectedCategory}</div>
          <div data-testid="items-count">{state.currentItems.length}</div>
          <div data-testid="filters-seasons">{state.filters.seasons.join(',')}</div>
          <div data-testid="filters-scenes">{state.filters.scenes.join(',')}</div>
          <div data-testid="filters-tastes">{state.filters.tastes.join(',')}</div>
        </div>
      );
    };

    render(
      <CoordinatesProvider>
        <TestComponent />
      </CoordinatesProvider>,
    );

    expect(screen.getByTestId('selected-category')).toHaveTextContent('');
    expect(screen.getByTestId('items-count')).toHaveTextContent('0');
    expect(screen.getByTestId('filters-seasons')).toHaveTextContent('');
    expect(screen.getByTestId('filters-scenes')).toHaveTextContent('');
    expect(screen.getByTestId('filters-tastes')).toHaveTextContent('');
  });

  // カテゴリー変更のテスト
  it('handles category change correctly', async () => {
    const mockItems = [mockCoordinate];
    (fetchCoordinateListAPI as jest.Mock).mockResolvedValue({
      results: mockItems,
      next: null,
    });

    const { result } = renderHook(() => useCoordinates(), {
      wrapper: CoordinatesProvider,
    });

    await act(async () => {
      await result.current.handlers.handleCategoryChange('photo');
    });

    expect(result.current.state.selectedCategory).toBe('photo');
    expect(result.current.state.currentItems).toHaveLength(1);
    expect(result.current.state.filters.category).toBe('photo');
    expect(fetchCoordinateListAPI).toHaveBeenCalledWith('photo', 1);
  });

  // フィルター変更のテスト
  describe('filter changes', () => {
    it('handles season filter correctly', async () => {
      const mockItems = [
        {
          ...mockCoordinate,
          id: '1',
          seasons: [{ id: '1', season_name: '春' }] as [{ id: string; season_name: string }],
        },
        {
          ...mockCoordinate,
          id: '2',
          seasons: [{ id: '2', season_name: '夏' }] as [{ id: string; season_name: string }],
        },
      ];

      const { result } = renderHook(() => useCoordinates(), {
        wrapper: CoordinatesProvider,
      });

      (fetchCoordinateListAPI as jest.Mock).mockResolvedValue({
        results: mockItems,
        next: null,
      });

      await act(async () => {
        await result.current.handlers.handleCategoryChange('photo');
      });

      act(() => {
        result.current.handlers.handleFilterChange({ seasons: ['1'] });
      });

      expect(result.current.state.currentItems).toHaveLength(1);
      expect(result.current.state.currentItems[0].id).toBe('1');
    });

    it('handles multiple filters correctly', async () => {
      const mockItems = [
        {
          ...mockCoordinate,
          id: '1',
          seasons: [{ id: '1', season_name: '春' }] as [{ id: string; season_name: string }],
          scenes: [{ id: '1', scene_name: 'カジュアル' }] as [{ id: string; scene_name: string }],
          tastes: [{ id: '1', taste_name: 'シンプル' }] as [{ id: string; taste_name: string }],
        },
        {
          ...mockCoordinate,
          id: '2',
          seasons: [{ id: '2', season_name: '夏' }] as [{ id: string; season_name: string }],
          scenes: [{ id: '2', scene_name: 'フォーマル' }] as [{ id: string; scene_name: string }],
          tastes: [{ id: '2', taste_name: 'エレガント' }] as [{ id: string; taste_name: string }],
        },
      ];

      const { result } = renderHook(() => useCoordinates(), {
        wrapper: CoordinatesProvider,
      });

      (fetchCoordinateListAPI as jest.Mock).mockResolvedValue({
        results: mockItems,
        next: null,
      });

      await act(async () => {
        await result.current.handlers.handleCategoryChange('photo');
      });

      act(() => {
        result.current.handlers.handleFilterChange({
          seasons: ['1'],
          scenes: ['1'],
          tastes: ['1'],
        });
      });

      expect(result.current.state.currentItems).toHaveLength(1);
      expect(result.current.state.currentItems[0].id).toBe('1');
    });
  });

  // 削除のテスト
  it('handles coordinate deletion correctly', async () => {
    const mockItems = [
      { ...mockCoordinate, id: '1' },
      { ...mockCoordinate, id: '2' },
    ];

    (fetchCoordinateListAPI as jest.Mock).mockResolvedValue({
      results: mockItems,
      next: null,
    });
    (deleteCoordinateAPI as jest.Mock).mockResolvedValue(undefined);

    const { result } = renderHook(() => useCoordinates(), {
      wrapper: CoordinatesProvider,
    });

    await act(async () => {
      await result.current.handlers.handleCategoryChange('photo');
    });

    expect(result.current.state.currentItems).toHaveLength(2);

    await act(async () => {
      await result.current.handlers.handleDelete('1');
    });

    expect(result.current.state.currentItems).toHaveLength(1);
    expect(result.current.state.currentItems[0].id).toBe('2');
    expect(mockToast.toast).toHaveBeenCalledWith({
      title: '削除完了',
      description: 'コーディネートを削除しました。',
      duration: 3000,
    });
  });

  // 更新のテスト
  it('handles coordinate update correctly', async () => {
    const initialCoordinate = { ...mockCoordinate, id: '1' };
    const mockItems = [initialCoordinate];

    (fetchCoordinateListAPI as jest.Mock).mockResolvedValue({
      results: mockItems,
      next: null,
    });

    const { result } = renderHook(() => useCoordinates(), {
      wrapper: CoordinatesProvider,
    });

    await act(async () => {
      await result.current.handlers.handleCategoryChange('photo');
    });

    expect(result.current.state.currentItems).toHaveLength(1);
    expect(result.current.state.currentItems[0].seasons[0].season_name).toBe('春');

    const updatedCoordinate: BaseCoordinate = {
      ...initialCoordinate,
      seasons: [{ id: '2', season_name: '夏' }] as [{ id: string; season_name: string }],
    };

    act(() => {
      result.current.handlers.handleUpdate(updatedCoordinate);
    });

    expect(result.current.state.currentItems).toHaveLength(1);
    expect(result.current.state.currentItems[0].seasons[0].season_name).toBe('夏');
  });

  // コンテキスト外使用のエラーテスト
  it('throws error when used outside provider', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      renderHook(() => useCoordinates());
    }).toThrow('useFashionItems must be used within FashionItemsProvider');

    consoleError.mockRestore();
  });

  // 追加データ読み込みのテスト
  it('handles load more correctly', async () => {
    const initialItems = [{ ...mockCoordinate, id: '1' }];
    const additionalItems = [{ ...mockCoordinate, id: '2' }];

    (fetchCoordinateListAPI as jest.Mock)
      .mockResolvedValueOnce({
        results: initialItems,
        next: 'nextPage',
      })
      .mockResolvedValueOnce({
        results: additionalItems,
        next: null,
      });

    const { result } = renderHook(() => useCoordinates(), {
      wrapper: CoordinatesProvider,
    });

    await act(async () => {
      await result.current.handlers.handleCategoryChange('photo');
    });

    expect(result.current.state.currentItems).toHaveLength(1);
    expect(result.current.state.hasMore).toBe(true);

    await act(async () => {
      await result.current.handlers.handleLoadMore();
    });

    expect(result.current.state.currentItems).toHaveLength(2);
    expect(result.current.state.hasMore).toBe(false);
    expect(result.current.state.currentPage).toBe(2);
  });
});
