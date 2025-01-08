'use client';

import { useToast } from '@/hooks/use-toast';
import { deleteCoordinateAPI, fetchCoordinateListAPI } from '@/lib/api/coordinateApi';
import type { BaseCoordinate } from '@/types/coordinate';

import { useState, useTransition } from 'react';
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

  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

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
          item.seasons?.some((season) => {
            return filters.seasons.includes(season.id.toString());
          }) ?? false;
        if (!passes) return false;
      }

      // シーンフィルター
      if (filters.scenes.length > 0) {
        passes =
          item.scenes?.some((scene) => {
            return filters.scenes.includes(scene.id.toString());
          }) ?? false;
        if (!passes) return false;
      }

      // テイストフィルター
      if (filters.tastes.length > 0) {
        passes =
          item.tastes?.some((taste) => {
            return filters.tastes.includes(taste.id.toString());
          }) ?? false;
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
    isPending,
    currentItems,
  };

  const handlers: CoordinatesHandlers = {
    /*
  カテゴリー変更時の処理
  キャッシュの有無を確認し、必要な場合のみデータフェッチを実行
  */
    handleCategoryChange: async (categoryId: CoordinateCategory | '') => {
      startTransition(async () => {
        try {
          setSelectedCategory(categoryId);
          setFilters((prev) => ({ ...prev, category: categoryId }));

          // 空のカテゴリーが選択された場合は早期リターン
          if (categoryId === '') return;

          // キャッシュにデータがある場合はスキップ
          if (coordinateCache[categoryId].length > 0) return;

          // カテゴリーに応じたAPIを呼び出し
          const newItems = await fetchCoordinateListAPI(categoryId);

          setCoordinateCache((prev) => ({
            ...prev,
            [categoryId]: newItems,
          }));
        } catch (error) {
          console.error(error);
        }
      });
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

      startTransition(async () => {
        try {
          // 選択されているカテゴリーに応じたAPI呼び出し
          await deleteCoordinateAPI(selectedCategory, id);

          // キャッシュの更新
          setCoordinateCache((prev) => ({
            ...prev,
            [selectedCategory]: prev[selectedCategory].filter((item) => item.id !== id),
          }));

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
      });
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

  return {
    state,
    handlers,
  };
};
