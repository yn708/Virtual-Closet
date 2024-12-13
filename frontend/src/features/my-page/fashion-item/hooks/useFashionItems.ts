import { useToast } from '@/hooks/use-toast';
import { deleteFashionItemAPI, fetchFashionItemsByCategoryAPI } from '@/lib/api/fashionItemsApi';
import type { FashionItem } from '@/types';
import { ERROR_DESCRIPTION_MESSAGE, ERROR_MESSAGE } from '@/utils/constants';
import { useState, useTransition } from 'react';
import type { CategoryCache, FilterState } from '../types';

/* 
ファッションアイテムの表示、編集、削除に関するカスタムフック 
*/
export const useFashionItems = () => {
  const [categoryCache, setCategoryCache] = useState<CategoryCache>({}); // カテゴリーごとのアイテムをキャッシュ
  const [selectedCategory, setSelectedCategory] = useState<string>(); // 選択されたカテゴリー
  // フィルター状態の初期化
  const [filters, setFilters] = useState<FilterState>({
    category: '',
    status: [],
    season: [],
  });
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  /*
  カテゴリー変更時の処理
  キャッシュの有無を確認し、必要な場合のみデータフェッチを実行
  */
  const handleCategoryChange = async (categoryId: string) => {
    startTransition(async () => {
      try {
        setSelectedCategory(categoryId);
        setFilters((prev) => ({ ...prev, category: categoryId }));

        if (categoryCache[categoryId]) return;
        if (categoryId !== '') {
          const newItems = await fetchFashionItemsByCategoryAPI(categoryId);
          setCategoryCache((prev) => ({ ...prev, [categoryId]: newItems }));
        }
      } catch (error) {
        console.error(error);
      }
    });
  };

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  /*
  アイテム削除時の処理
  削除成功時、全カテゴリーのキャッシュから該当アイテムを削除
  */
  const handleDelete = async (id: string) => {
    startTransition(async () => {
      try {
        await deleteFashionItemAPI(id);
        setCategoryCache((prev) => {
          const newCache = { ...prev };
          Object.keys(newCache).forEach((categoryId) => {
            newCache[categoryId] = newCache[categoryId].filter((item) => item.id !== id);
          });
          return newCache;
        });
      } catch (error) {
        console.error(error);
        toast({
          variant: 'destructive',
          title: ERROR_MESSAGE,
          description: ERROR_DESCRIPTION_MESSAGE,
        });
      }
    });
  };

  // アイテム更新時のキャッシュ更新関数
  const handleUpdate = (updatedItem: FashionItem) => {
    setCategoryCache((prev) => {
      const newCache = { ...prev };
      Object.keys(newCache).forEach((categoryId) => {
        newCache[categoryId] = newCache[categoryId].map((item) =>
          item.id === updatedItem.id ? updatedItem : item,
        );
      });
      return newCache;
    });
  };

  /**
   * フィルタリング関数
   * status（所有/古着）とシーズンに基づいてアイテムをフィルタリング
   */
  const filterItems = (items: FashionItem[]): FashionItem[] => {
    return items.filter((item) => {
      // ステータスフィルター（複数選択可能）
      if (filters.status.length > 0) {
        // 'owned'フィルターのチェック
        if (filters.status.includes('owned') && !item.is_owned) {
          return false;
        }
        // 'used'フィルターのチェック
        if (filters.status.includes('used') && !item.is_old_clothes) {
          return false;
        }
        // どちらのフィルターも満たさない場合
        if (!filters.status.includes('owned') && !filters.status.includes('used')) {
          return false;
        }
      }

      // シーズンフィルター
      if (filters.season.length > 0) {
        return item.seasons.some((season) => filters.season.includes(season.id));
      }

      return true;
    });
  };

  const currentItems = selectedCategory ? filterItems(categoryCache[selectedCategory] || []) : [];

  return {
    selectedCategory,
    filters,
    isPending,
    handleCategoryChange,
    handleDelete,
    handleUpdate,
    handleFilterChange,
    currentItems,
  };
};
