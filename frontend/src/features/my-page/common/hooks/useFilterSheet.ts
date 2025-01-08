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

  const state = {
    isOpen,
    tempFilters,
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
      if (tempFilters.category !== initialFilters.category) {
        onCategoryChange(tempFilters.category as string);
      }
      onFilterApply(tempFilters);
      onClose();
    },

    /**
     * すべてのフィルターをデフォルト値にリセット
     */
    handleReset: () => {
      const defaultFilters = config.filterHandlers.defaultFilters as T;
      setTempFilters(defaultFilters);
      onFilterApply(defaultFilters);
      onCategoryChange('');
    },
  };

  return {
    state,
    handlers,
  };
}
