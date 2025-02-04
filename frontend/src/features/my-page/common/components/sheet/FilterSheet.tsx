import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { ListFilter } from 'lucide-react';
import { useFilterSheet } from '../../hooks/useFilterSheet';
import type { BaseFilterProps } from '../../types';
import CategorySelectButton from '../button/CategorySelectButton';
import FilterGroup from '../contents/FilterGroup';

const FilterSheet = <T extends Record<string, unknown>>({
  filters,
  onFilterChange,
  onCategoryChange,
  config,
}: BaseFilterProps<T>) => {
  const { state, handlers } = useFilterSheet<T>({
    initialFilters: filters,
    onFilterApply: onFilterChange,
    onCategoryChange,
    config,
  });

  return (
    <Sheet open={state.isOpen} onOpenChange={handlers.handleSheetOpenChange}>
      <SheetTrigger asChild>
        <Button variant="ghost" className="gap-2 relative">
          <ListFilter className="size-4" />
          <span className="hidden sm:inline">絞り込み</span>

          {/* フィルター数を適用後に表示 */}
          {state.appliedFiltersCount > 0 && (
            <span className="absolute -top-1 -right-2 bg-blue-600 text-white text-xs font-semibold rounded-full size-5 flex items-center justify-center">
              {state.appliedFiltersCount}
            </span>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="w-full max-w-full sm:max-w-[500px] flex flex-col">
        <SheetHeader>
          <SheetTitle>{config.title}</SheetTitle>
          <SheetDescription />
        </SheetHeader>

        <div className="flex-1 mt-10 min-h-0">
          <ScrollArea className="h-full pr-4">
            <div className="space-y-10 pb-4">
              <div className="space-y-2">
                <CategorySelectButton
                  onCategoryChange={handlers.handleCategoryChange}
                  config={config}
                  selectedId={state.tempFilters.category as string}
                />
              </div>

              <div className="space-y-6">
                {config.filterGroups.map((group) => (
                  <FilterGroup
                    key={group.key}
                    group={group}
                    value={state.tempFilters[group.key] as string[]}
                    onChange={(value) => handlers.handleFilterChange(group.key, value)}
                  />
                ))}
              </div>
            </div>
          </ScrollArea>
        </div>

        <SheetFooter className="shrink-0 p-4 border-t">
          <div className="flex justify-between w-full gap-2">
            <Button variant="outline" onClick={handlers.handleReset} className="flex-1">
              リセット
            </Button>
            <Button
              onClick={handlers.handleApplyFilters}
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
