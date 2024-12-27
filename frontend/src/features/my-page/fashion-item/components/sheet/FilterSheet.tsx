import MultipleToggleGroup from '@/components/elements/utils/MultipleToggleGroup';
import SingleToggleGroup from '@/components/elements/utils/SingleToggleGroup';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { FASHION_ITEMS_FILTER_OPTIONS, SEASON_OPTIONS } from '@/utils/data/selectData';
import { IoFilter } from 'react-icons/io5';
import { useFilterSheet } from '../../hooks/useFilterSheet';
import type { BaseCategoryFilterProps, BaseFilterProps, Status } from '../../types';
import CategorySelectButton from '../button/CategorySelectButton';

const FilterSheet = ({
  filters, // 現在適用されているフィルター
  onFilterChange, // フィルター変更時のコールバック
  onCategoryChange, // カテゴリー変更時のコールバック
}: BaseFilterProps & BaseCategoryFilterProps) => {
  const {
    isOpen,
    tempFilters,
    handleSheetOpenChange,
    handleSeasonChange,
    handleStatusChange,
    handleCategoryChange,
    handleApplyFilters,
    handleReset,
  } = useFilterSheet({
    initialFilters: filters,
    onFilterApply: onFilterChange,
    onCategoryChange,
  });

  return (
    <Sheet open={isOpen} onOpenChange={handleSheetOpenChange}>
      {/* フィルターボタン */}
      <SheetTrigger asChild>
        <Button variant="ghost" className="gap-2">
          <IoFilter className="size-4" />
          <span className="hidden sm:inline">絞り込み</span>
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="w-full max-w-full sm:max-w-[500px]">
        <SheetHeader>
          <SheetTitle>絞り込み</SheetTitle>
          <SheetDescription>項目を選び、適応ボタンを押してください。</SheetDescription>
        </SheetHeader>

        <div className="mt-10 space-y-10">
          {/* カテゴリー選択セクション */}
          <div className="space-y-2">
            <CategorySelectButton
              onClick={handleCategoryChange}
              selectedId={tempFilters.category}
            />
          </div>

          {/* その他のフィルターセクション */}
          <div>
            {/* ステータスフィルター（複数選択可能） */}
            <MultipleToggleGroup
              options={FASHION_ITEMS_FILTER_OPTIONS}
              value={tempFilters.status as Status[]}
              onValueChange={handleStatusChange}
            />
            <Separator className="w-2/3 mx-auto my-6" />
            {/* シーズンフィルター（単一選択） */}
            <SingleToggleGroup
              options={SEASON_OPTIONS}
              value={tempFilters.season[0]}
              onValueChange={handleSeasonChange}
            />
          </div>
        </div>

        {/* フッター：リセットと適用ボタン */}
        <SheetFooter className="absolute bottom-0 inset-x-0 p-4">
          <div className="flex justify-between w-full gap-2">
            <Button variant="outline" type="button" onClick={handleReset} className="flex-1">
              リセット
            </Button>
            <Button
              onClick={handleApplyFilters}
              type="button"
              className="flex-1 bg-gray-800 dark:bg-gray-200"
            >
              適用
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default FilterSheet;
