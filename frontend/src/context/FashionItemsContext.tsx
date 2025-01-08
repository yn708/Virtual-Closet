'use client';
import type { CategoryCache, FashionItemFilters } from '@/features/my-page/fashion-item/types';
import { useToast } from '@/hooks/use-toast';
import { deleteFashionItemAPI, fetchFashionItemsByCategoryAPI } from '@/lib/api/fashionItemsApi';
import type {
  FashionItem,
  FashionItemsContextValue,
  FashionItemsHandlers,
  FashionItemsState,
} from '@/types';
import { createContext, useContext, useState, useTransition } from 'react';

/**
 * ファッションアイテムの表示、編集、削除に関するコンテキスト
 *
 * Sheet内での使用もあるため、（CustomCoordinate作成時のCanvas内でのアイテムセレクト時）
 * カテゴリーの選択状態とキャッシュをContextで管理し、
 * Sheet開閉時のデータ保持と不要なAPI通信を防止
 */
const FashionItemsContext = createContext<FashionItemsContextValue | undefined>(undefined);

export const FashionItemsProvider = ({ children }: { children: React.ReactNode }) => {
  const [categoryCache, setCategoryCache] = useState<CategoryCache>({}); // カテゴリーごとのアイテムをキャッシュ
  const [selectedCategory, setSelectedCategory] = useState<string>(''); // 選択されたカテゴリー
  // フィルター状態の初期化
  const [filters, setFilters] = useState<FashionItemFilters>({
    category: '',
    status: [],
    season: [],
  });
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  /**
   * フィルタリング関数
   * status（所有/古着）とシーズンに基づいてアイテムをフィルタリング
   */
  const filterItems = (items: FashionItem[]): FashionItem[] => {
    return items.filter((item) => {
      // ステータスフィルター（複数選択可能）
      if (filters.status.length > 0) {
        if (filters.status.includes('owned') && !item.is_owned) return false; // 'owned'フィルターのチェック
        if (filters.status.includes('used') && !item.is_old_clothes) return false; // 'used'フィルターのチェック
        if (!filters.status.includes('owned') && !filters.status.includes('used')) return false; // どちらのフィルターも満たさない場合
      }
      // シーズンフィルター
      if (filters.season.length > 0) {
        return item.seasons.some((season) => filters.season.includes(season.id));
      }

      return true;
    });
  };

  const currentItems = selectedCategory ? filterItems(categoryCache[selectedCategory] || []) : [];

  const state: FashionItemsState = {
    categoryCache,
    selectedCategory,
    filters,
    isPending,
    currentItems,
  };

  const handlers: FashionItemsHandlers = {
    /*
  カテゴリー変更時の処理
  キャッシュの有無を確認し、必要な場合のみデータフェッチを実行
  */
    handleCategoryChange: async (categoryId: string) => {
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
    },

    handleFilterChange: (newFilters: Partial<FashionItemFilters>) => {
      setFilters((prev) => ({ ...prev, ...newFilters }));
    },

    /*
  アイテム削除時の処理
  削除成功時、全カテゴリーのキャッシュから該当アイテムを削除
  */
    handleDelete: async (id: string) => {
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
            title: 'エラー',
            description: 'アイテムの削除に失敗しました。',
          });
        }
      });
    },
    /*
  アイテム更新時のキャッシュ更新関数
  */
    handleUpdate: (updatedItem: FashionItem) => {
      setCategoryCache((prev) => {
        const newCache = { ...prev };
        Object.keys(newCache).forEach((categoryId) => {
          newCache[categoryId] = newCache[categoryId].map((item) =>
            item.id === updatedItem.id ? updatedItem : item,
          );
        });
        return newCache;
      });
    },
  };

  return (
    <FashionItemsContext.Provider
      value={{
        state,
        handlers,
      }}
    >
      {children}
    </FashionItemsContext.Provider>
  );
};

export const useFashionItems = () => {
  const context = useContext(FashionItemsContext);
  if (!context) {
    throw new Error('useFashionItems must be used within FashionItemsProvider');
  }
  return context;
};
