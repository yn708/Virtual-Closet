'use client';

import { useToast } from '@/hooks/use-toast';
import {
  deleteCoordinateAPI,
  fetchCoordinateCountAPI,
  fetchCoordinateListAPI,
} from '@/lib/api/coordinateApi';
import type { CountDataType } from '@/types';
import type { BaseCoordinate } from '@/types/coordinate';
import { useEffect, useState } from 'react';
import type {
  CoordinateCache,
  CoordinateCategory,
  CoordinateFilters,
  CoordinatesHandlers,
  CoordinatesState,
} from '../types';

export const useCoordinates = (): {
  state: CoordinatesState;
  handlers: CoordinatesHandlers;
} => {
  const [coordinateCache, setCoordinateCache] = useState<CoordinateCache>({
    photo: [], // photo Coordinate
    custom: [], // custom Coordinate
  });
  const [selectedCategory, setSelectedCategory] = useState<CoordinateCategory | ''>('');
  // フィルター状態の初期化
  const [filters, setFilters] = useState<CoordinateFilters>({
    category: '',
    seasons: [],
    scenes: [],
    tastes: [],
  });
  // 現在のページ（データ追加取得ごとに＋１）
  const [currentPage, setCurrentPage] = useState<Record<CoordinateCategory, number>>({
    photo: 1,
    custom: 1,
  });

  // 追加取得データがあるかどうか
  const [hasMore, setHasMore] = useState<Record<CoordinateCategory, boolean>>({
    photo: true,
    custom: true,
  });

  const [isInitialLoading, setIsInitialLoading] = useState(false); // 初回データ取得Loading
  const [isLoadingMore, setIsLoadingMore] = useState(false); // 追加データ取得Loading
  const [countData, setCountData] = useState<CountDataType | null>(null); // アイテムのカウント（残りの登録可能アイテムに使用）

  const { toast } = useToast();

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const response = await fetchCoordinateCountAPI();
        setCountData(response);
      } catch (error) {
        console.error('アイテムカウント取得エラー:', error);
      }
    };
    fetchCount();
  }, []);

  // カウント数の更新
  const updateCount = async () => {
    try {
      const response = await fetchCoordinateCountAPI();
      setCountData(response);
    } catch (error) {
      console.error('カウント更新エラー:', error);
    }
  };

  /**
   * フィルタリング関数
   * シーズン、シーン、テイストに基づいてアイテムをフィルタリング
   */
  const filterItems = (items: BaseCoordinate[]): BaseCoordinate[] => {
    if (!items) return [];

    return items.filter((item) => {
      let passes = true;
      // シーズンフィルター
      if (filters.seasons.length > 0) {
        passes =
          item.seasons?.some((season) => filters.seasons.includes(season.id.toString())) ?? false;
        if (!passes) return false;
      }
      // シーンフィルター
      if (filters.scenes.length > 0) {
        passes =
          item.scenes?.some((scene) => filters.scenes.includes(scene.id.toString())) ?? false;
        if (!passes) return false;
      }
      // テイストフィルター
      if (filters.tastes.length > 0) {
        passes =
          item.tastes?.some((taste) => filters.tastes.includes(taste.id.toString())) ?? false;
        if (!passes) return false;
      }

      return true;
    });
  };

  const currentItems = selectedCategory ? filterItems(coordinateCache[selectedCategory]) : [];

  const state: CoordinatesState = {
    coordinateCache,
    selectedCategory,
    filters,
    isInitialLoading,
    isLoadingMore,
    currentItems,
    hasMore: selectedCategory ? hasMore[selectedCategory] : false,
    currentPage: selectedCategory ? currentPage[selectedCategory] : 1,
    countData,
  };

  const handlers: CoordinatesHandlers = {
    /*
    カテゴリー変更時の処理
    キャッシュの有無を確認し、必要な場合のみデータフェッチを実行
    */
    handleCategoryChange: async (categoryId: CoordinateCategory | '') => {
      try {
        if (categoryId === selectedCategory) return;

        setIsInitialLoading(true);
        setSelectedCategory(categoryId);
        setFilters((prev) => ({ ...prev, category: categoryId }));

        // 空のカテゴリーが選択された場合は早期リターン
        if (categoryId === '') return;

        // カテゴリー変更時にキャッシュをクリアし、初期データを取得
        if (!coordinateCache[categoryId].length) {
          const response = await fetchCoordinateListAPI(categoryId, 1);
          setCoordinateCache((prev) => ({
            ...prev,
            [categoryId]: response.results,
          }));
          setCurrentPage((prev) => ({ ...prev, [categoryId]: 1 }));
          setHasMore((prev) => ({ ...prev, [categoryId]: !!response.next }));
        }
      } catch (error) {
        console.error(error);
        toast({
          variant: 'destructive',
          title: 'エラー',
          description: 'データの取得に失敗しました。',
        });
      } finally {
        setIsInitialLoading(false);
      }
    },

    handleLoadMore: async () => {
      if (!selectedCategory || !hasMore[selectedCategory] || isLoadingMore || isLoadingMore) return;

      try {
        setIsLoadingMore(true);
        const nextPage = currentPage[selectedCategory] + 1;

        const response = await fetchCoordinateListAPI(selectedCategory, nextPage);

        // 重複チェック
        const existingIds = new Set(coordinateCache[selectedCategory].map((item) => item.id));
        const newItems = response.results.filter((item) => !existingIds.has(item.id));

        if (newItems.length > 0) {
          setCoordinateCache((prev) => ({
            ...prev,
            [selectedCategory]: [...prev[selectedCategory], ...newItems],
          }));

          setCurrentPage((prev) => ({
            ...prev,
            [selectedCategory]: nextPage,
          }));
        }

        setHasMore((prev) => ({
          ...prev,
          [selectedCategory]: !!response.next,
        }));
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoadingMore(false);
      }
    },

    handleFilterChange: (newFilters: Partial<CoordinateFilters>) => {
      setFilters((prev) => ({ ...prev, ...newFilters }));
    },
    /*
    コーディネート削除時の処理
    削除成功時、該当カテゴリーのキャッシュから対象アイテムを削除
    */
    handleDelete: async (id: string) => {
      if (!selectedCategory) return;

      try {
        // 選択されているカテゴリーに応じたAPI呼び出し
        await deleteCoordinateAPI(selectedCategory, id);
        // キャッシュの更新
        setCoordinateCache((prev) => ({
          ...prev,
          [selectedCategory]: prev[selectedCategory].filter((item) => item.id !== id),
        }));
        await updateCount();
        toast({
          title: '削除完了',
          description: 'コーディネートを削除しました。',
          duration: 3000,
        });
      } catch (error) {
        console.error(error);
        toast({
          variant: 'destructive',
          title: 'エラー',
          description: 'コーディネートの削除に失敗しました。',
        });
      }
    },

    /*
    コーディネート更新時の処理
    更新成功時、該当カテゴリーのキャッシュ内の対象アイテムを更新
    */
    handleUpdate: (updatedCoordinate: BaseCoordinate) => {
      setCoordinateCache((prev) => {
        const newCache = { ...prev };
        (Object.keys(newCache) as CoordinateCategory[]).forEach((category) => {
          newCache[category] = newCache[category].map((item) =>
            item.id === updatedCoordinate.id ? updatedCoordinate : item,
          );
        });
        return newCache;
      });
    },
  };

  return { state, handlers };
};
