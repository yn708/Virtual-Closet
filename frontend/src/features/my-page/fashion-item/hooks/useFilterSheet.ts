import { useIsOpen } from '@/hooks/utils/useIsOpen';
import { useState } from 'react';
import type { FilterState, Status, UseFilterSheetProps } from '../types';

export const useFilterSheet = ({
  initialFilters,
  onFilterApply,
  onCategoryChange,
}: UseFilterSheetProps) => {
  const { isOpen, onClose, onToggle } = useIsOpen();
  const [tempFilters, setTempFilters] = useState<FilterState>(initialFilters);

  const handleSheetOpenChange = () => {
    if (!isOpen) {
      // 閉じる時に一時フィルターを初期状態に戻す
      setTempFilters(initialFilters);
    }
    onToggle();
  };

  // シーズン選択の処理
  const handleSeasonChange = (value: string | undefined) => {
    // 値がundefinedまたは空文字の場合は空配列を設定
    if (!value || value === '') {
      setTempFilters((prev) => ({ ...prev, season: [] }));
      return;
    }
    // 現在選択されているシーズンと同じ値が選択された場合は空配列を設定
    const currentSeason = tempFilters.season[0];
    const newValue = value === currentSeason ? [] : [value];
    setTempFilters((prev) => ({ ...prev, season: newValue }));
  };

  // ステータス（複数選択可能）の変更処理
  const handleStatusChange = (value: string[]) => {
    setTempFilters((prev) => ({ ...prev, status: value as Status[] }));
  };

  // カテゴリー選択の処理
  const handleCategoryChange = (categoryId: string) => {
    setTempFilters((prev) => ({ ...prev, category: categoryId }));
  };

  // フィルターを適用する処理
  // 親コンポーネントに変更を通知し、シートを閉じる
  const handleApplyFilters = () => {
    onFilterApply(tempFilters);
    onCategoryChange(tempFilters.category);
    onClose();
  };

  // フィルターをリセットする処理
  // すべての値をデフォルト状態に戻す
  const handleReset = () => {
    const defaultFilters: FilterState = {
      category: '',
      status: [],
      season: [],
    };
    setTempFilters(defaultFilters);
    onFilterApply(defaultFilters);
    onCategoryChange('');
  };

  return {
    isOpen,
    tempFilters,
    handleSheetOpenChange,
    handleSeasonChange,
    handleStatusChange,
    handleCategoryChange,
    handleApplyFilters,
    handleReset,
  };
};
