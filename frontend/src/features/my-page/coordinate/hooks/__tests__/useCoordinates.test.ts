import { deleteCoordinateAPI, fetchCoordinateListAPI } from '@/lib/api/coordinateApi';
import type { BaseCoordinate } from '@/types/coordinate';
import { renderHook } from '@testing-library/react';
import { act } from 'react';
import { useCoordinates } from '../useCoordinates';

jest.mock('@/lib/api/coordinateApi', () => ({
  deleteCoordinateAPI: jest.fn(),
  fetchCoordinateListAPI: jest.fn(),
}));

const toastMock = jest.fn();
jest.mock('@/hooks/use-toast', () => ({
  useToast: jest.fn(() => ({
    toast: toastMock,
  })),
}));

describe('useCoordinates', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('初期状態が正しく設定されていること', () => {
    const { result } = renderHook(() => useCoordinates());

    expect(result.current.state.coordinateCache).toEqual({ photo: [], custom: [] });
    expect(result.current.state.selectedCategory).toBe('');
    expect(result.current.state.filters).toEqual({
      category: '',
      seasons: [],
      scenes: [],
      tastes: [],
    });

    expect(result.current.state.currentPage).toEqual(1);
    expect(result.current.state.isInitialLoading).toBe(false);
    expect(result.current.state.isLoadingMore).toBe(false);
    expect(result.current.state.hasMore).toBe(false);
    expect(result.current.state.currentItems).toEqual([]);
  });

  it('カテゴリ変更時にデータフェッチが行われ、キャッシュが更新されること', async () => {
    const mockNewItems: BaseCoordinate[] = [
      {
        id: '1',
        image: 'initial.webp',
        seasons: [{ id: '1', season_name: 'Summer' }],
        scenes: [{ id: '1', scene: 'Casual' }],
        tastes: [{ id: '1', taste: 'Minimal' }],
      },
    ];
    (fetchCoordinateListAPI as jest.Mock).mockResolvedValue({
      results: mockNewItems, // 期待するデータ
      next: null,
    });

    const { result } = renderHook(() => useCoordinates());

    await act(async () => {
      await result.current.handlers.handleCategoryChange('photo');
    });
    expect(fetchCoordinateListAPI).toHaveBeenCalledWith('photo', 1);
    expect(result.current.state.coordinateCache.photo).toEqual(mockNewItems);
  });

  it('フィルター変更時に状態が更新されること', () => {
    const { result } = renderHook(() => useCoordinates());

    act(() => {
      result.current.handlers.handleFilterChange({ seasons: ['1'] });
    });

    expect(result.current.state.filters.seasons).toEqual(['1']);
  });

  it('コーディネート削除時にキャッシュが更新され、トーストが表示されること', async () => {
    (deleteCoordinateAPI as jest.Mock).mockResolvedValue({});
    const { result } = renderHook(() => useCoordinates());

    await act(async () => {
      await result.current.handlers.handleCategoryChange('photo');
    });

    await act(async () => {
      await result.current.handlers.handleDelete('1');
    });

    expect(deleteCoordinateAPI).toHaveBeenCalledWith('photo', '1');
    expect(result.current.state.coordinateCache.photo).toEqual([]);
    expect(toastMock).toHaveBeenCalledWith({
      title: '削除完了',
      description: 'コーディネートを削除しました。',
      duration: 3000,
    });
  });

  it('コーディネート更新時にキャッシュが正しく更新されること', () => {
    const mockInitialCoordinate: BaseCoordinate = {
      id: '1',
      image: 'initial.jpg',
      seasons: [{ id: '1', season_name: 'Summer' }],
      scenes: [{ id: '1', scene: 'Casual' }],
      tastes: [{ id: '1', taste: 'Minimal' }],
    };

    const mockUpdatedCoordinate: BaseCoordinate = {
      id: '1',
      image: 'updated.jpg',
      seasons: [{ id: '2', season_name: 'Winter' }],
      scenes: [{ id: '2', scene: 'Formal' }],
      tastes: [{ id: '2', taste: 'Classic' }],
    };

    const { result } = renderHook(() => useCoordinates());

    act(() => {
      result.current.handlers.handleCategoryChange('photo');
      result.current.state.coordinateCache.photo.push(mockInitialCoordinate);
    });

    act(() => {
      result.current.handlers.handleUpdate(mockUpdatedCoordinate);
    });

    expect(result.current.state.coordinateCache.photo).toEqual([mockUpdatedCoordinate]);
  });
});
