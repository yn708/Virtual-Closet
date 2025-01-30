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
import { createContext, useContext, useState } from 'react';

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

  const [isInitialLoading, setIsInitialLoading] = useState(false); // 初回データ取得時のLoading
  const [isLoadingMore, setIsLoadingMore] = useState(false); // 追加データ取得時のLoading
  const [hasMore, setHasMore] = useState(true); // 追加データがまだあるかどうか
  const [currentPage, setCurrentPage] = useState<Record<string, number>>({}); // 現在のページ（データ追加フェッチごとに＋１）
  // フィルター状態の初期化
  const [filters, setFilters] = useState<FashionItemFilters>({
    category: '',
    status: [],
    season: [],
  });

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
      } // シーズンフィルター
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
    isInitialLoading,
    isLoadingMore,
    currentItems,
    hasMore,
    currentPage: currentPage[selectedCategory] || 1,
  };

  const handlers: FashionItemsHandlers = {
    /*
    カテゴリー変更時の処理
    キャッシュの有無を確認し、必要な場合のみデータフェッチを実行
    */
    handleCategoryChange: async (categoryId: string) => {
      try {
        setIsInitialLoading(true);
        setSelectedCategory(categoryId);
        setFilters((prev) => ({ ...prev, category: categoryId }));
        setHasMore(true);

        if (!currentPage[categoryId]) {
          setCurrentPage((prev) => ({ ...prev, [categoryId]: 1 }));
        }

        if (!categoryCache[categoryId] && categoryId !== '') {
          const response = await fetchFashionItemsByCategoryAPI(categoryId, 1);
          setCategoryCache((prev) => ({
            ...prev,
            [categoryId]: response.results,
          }));
          setHasMore(!!response.next);
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

    /*
    データ追加取得処理
    */
    loadMore: async () => {
      // エラーが発生する可能性のある条件をより厳密にチェック
      if (!selectedCategory || !hasMore || isLoadingMore) return;

      try {
        setIsLoadingMore(true);

        // 現在のページ番号を取得（未設定の場合は1を使用）
        const currentPageNum = currentPage[selectedCategory] || 1;
        const nextPage = currentPageNum + 1;

        // 既存のアイテムを確認
        const existingItems = categoryCache[selectedCategory] || [];

        const response = await fetchFashionItemsByCategoryAPI(selectedCategory, nextPage);

        if (response && Array.isArray(response.results)) {
          // 重複チェック
          const existingIds = new Set(existingItems.map((item) => item.id));
          const newItems = response.results.filter((item) => !existingIds.has(item.id));

          // 新しいアイテムがある場合のみキャッシュを更新
          if (newItems.length > 0) {
            setCategoryCache((prev) => ({
              ...prev,
              [selectedCategory]: [...existingItems, ...newItems],
            }));

            // ページ番号を更新
            setCurrentPage((prev) => ({
              ...prev,
              [selectedCategory]: nextPage,
            }));
          }

          // 次のページの有無を設定
          setHasMore(!!response.next && newItems.length > 0);
        } else {
          // レスポンスが期待された形式でない場合
          setHasMore(false);
        }
      } catch (error) {
        console.error('Error in loadMore:', error);
        // エラー時にhasMoreをfalseに設定
        setHasMore(false);
      } finally {
        setIsLoadingMore(false);
      }
    },

    handleFilterChange: (newFilters: Partial<FashionItemFilters>) => {
      setFilters((prev) => ({ ...prev, ...newFilters }));
    },

    /*
    アイテム削除時の処理
    削除成功時、全カテゴリーのキャッシュから該当アイテムを削除
    */
    handleDelete: async (id: string) => {
      try {
        await deleteFashionItemAPI(id);
        setCategoryCache((prev) => {
          const newCache = { ...prev };
          Object.keys(newCache).forEach((categoryId) => {
            if (Array.isArray(newCache[categoryId])) {
              newCache[categoryId] = newCache[categoryId].filter((item) => item.id !== id);
            }
          });
          return newCache;
        });
        toast({
          title: '削除完了',
          description: 'アイテムを削除しました。',
          duration: 3000,
        });
      } catch (error) {
        console.error(error);
        toast({
          variant: 'destructive',
          title: 'エラー',
          description: 'アイテムの削除に失敗しました。',
        });
      }
    },

    /*
    アイテム更新時のキャッシュ更新関数
    */
    handleUpdate: (updatedItem: FashionItem) => {
      setCategoryCache((prev) => {
        const newCache = { ...prev };
        Object.keys(newCache).forEach((categoryId) => {
          if (Array.isArray(newCache[categoryId])) {
            newCache[categoryId] = newCache[categoryId].map((item) =>
              item.id === updatedItem.id ? updatedItem : item,
            );
          }
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
