import type { LabelType } from '@/types';

/*------------------------------------------------------------------
Display Type
------------------------------------------------------------------*/
export type FashionType = 'fashion-item' | 'coordinate';

/*------------------------------------------------------------------
Filter
------------------------------------------------------------------*/
export interface FilterGroupConfig extends LabelType {
  options: { id: string; label: string }[];
  key: string;
}

// CategorySelectorコンポーネントで使用中（アイテムの展開）
export interface FilterSheetConfig {
  title: string;
  categories: {
    id: string;
    label: string;
    description?: string;
    icon?: React.ComponentType<{ className?: string }>;
  }[];
  filterGroups: FilterGroupConfig[];
  layout: {
    categoryGrid: {
      small: string;
      large: string;
    };
  };
  filterHandlers: {
    defaultFilters: Record<string, unknown>;
  };
}

// フィルター全般基礎型
export interface BaseFilterChange {
  onCategoryChange: (categoryId: string) => void;
  config: FilterSheetConfig;
}
export interface BaseFilterProps<T> extends BaseFilterChange {
  filters: T;
  onFilterChange: (filters: Partial<T>) => void;
}

/*------------------------------------------------------------------
Update Item Types
------------------------------------------------------------------*/
export interface UpdateItemTypes<T> {
  type: FashionType;
  item: T;
  onUpdate: (updatedItem: T) => void;
}
