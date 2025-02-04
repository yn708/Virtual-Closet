import { useIsOpen } from '@/hooks/utils/useIsOpen';
import { useState } from 'react';
import type { BaseFilterChange } from '../types';

interface UseFilterSheetProps<T> extends BaseFilterChange {
  initialFilters: T;
  onFilterApply: (filters: Partial<T>) => void;
}

export function useFilterSheet<T extends Record<string, unknown>>({
  initialFilters,
  onFilterApply,
  onCategoryChange,
  config,
}: UseFilterSheetProps<T>) {
  const { isOpen, onClose, onToggle } = useIsOpen();
  const [tempFilters, setTempFilters] = useState<T>(initialFilters);
  const [appliedFiltersCount, setAppliedFiltersCount] = useState(0); // フィルター数を管理

  const state = {
    isOpen,
    tempFilters,
    appliedFiltersCount,
  };

  // フィルター数を計算する関数
  const calculateAppliedFilters = () => {
    return Object.entries(tempFilters).filter(([key, value]) => {
      return key !== 'category' && value && (Array.isArray(value) ? value.length > 0 : value);
    }).length;
  };

  const handlers = {
    /**
     * シートの開閉状態を切り替える
     * シートが閉じている場合は、一時フィルターを初期状態にリセット
     */
    handleSheetOpenChange: () => {
      if (!isOpen) {
        setTempFilters(initialFilters);
      }
      onToggle();
    },

    /**
     * フィルターの値を更新
     */
    handleFilterChange: (key: keyof T, value: string[]) => {
      const group = config.filterGroups.find((g) => g.key === key);
      if (!group) return;

      setTempFilters((prev) => ({ ...prev, [key]: value }));
    },

    /**
     * カテゴリーの選択状態を更新
     */
    handleCategoryChange: (categoryId: string) => {
      setTempFilters((prev) => ({ ...prev, category: categoryId }));
    },

    /**
     * フィルターを適用して確定
     * カテゴリーが変更されている場合は、カテゴリーの更新も実行
     */
    handleApplyFilters: () => {
      const count = calculateAppliedFilters(); // フィルター数を更新
      setAppliedFiltersCount(count); // 数値を更新

      if (tempFilters.category !== initialFilters.category) {
        onCategoryChange(tempFilters.category as string);
      }
      onFilterApply(tempFilters);
      onClose();
    },

    /**
     * デフォルト値にリセット
     */
    handleReset: () => {
      setTempFilters((prev) => ({
        ...(config.filterHandlers.defaultFilters as T),
        category: prev.category, // 現在のカテゴリーを維持
      }));
    },
  };

  return {
    state,
    handlers,
  };
}
