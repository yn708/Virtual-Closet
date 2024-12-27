import type { OnSelectItemType, SelectedItemsType } from '@/features/coordinate/types';
import type { ChildrenType, ClassNameType, FashionItem } from '@/types';

/*--------------------------------------------------------
hooks
--------------------------------------------------------*/
export interface UseFilterSheetProps {
  initialFilters: FilterState;
  onFilterApply: (filters: FilterState) => void;
  onCategoryChange: (categoryId: string) => void;
}

/*--------------------------------------------------------
ファションアイテム表示
--------------------------------------------------------*/
// 取得したアイテムキャッシュ用
export interface CategoryCache {
  [key: string]: FashionItem[];
}

export interface FashionItemListProps extends OnSelectItemType, SelectedItemsType {
  items: FashionItem[];
  isLoading?: boolean;
  onDelete: (id: string) => void;
  onUpdate: (item: FashionItem) => void;
}

/*--------------------------------------------------------
フィルター用
--------------------------------------------------------*/
// 共通のフィルター関連プロップス
export interface BaseFilterProps {
  onFilterChange: (filters: Partial<FilterState>) => void;
}
export interface BaseCategoryFilterProps {
  onCategoryChange: (categoryId: string) => void;
  filters: FilterState;
}

export type Status = '' | 'owned' | 'used';
export interface FilterState {
  category: string;
  status: Status | Status[];
  season: string[];
}

export interface CategorySelectorProps extends BaseFilterProps, BaseCategoryFilterProps {
  selectedCategory?: string;
}

export interface SeasonFilterProps extends BaseFilterProps {
  selectedSeason?: string;
}

/*--------------------------------------------------------
Button
--------------------------------------------------------*/
export interface CategorySelectButtonProps extends ClassNameType {
  onClick: (id: string) => void;
  selectedId?: string;
  size?: 'small' | 'large';
}

/*--------------------------------------------------------
Content
--------------------------------------------------------*/
export interface ItemImageProps {
  item: FashionItem;
  onDelete: (id: string) => void;
  onUpdate: (item: FashionItem) => void;
}

export interface ItemImageDrawerProps {
  item: FashionItem;
  onDelete: (id: string) => void;
  onUpdate: (item: FashionItem) => void;
}

export interface ItemDetailInfoProps {
  item: FashionItem;
}

export interface BorderBoxProps {
  label: string;
  value: string | React.ReactNode;
}

export interface DeleteItemDialogProps extends ChildrenType {
  onDelete: () => void;
}

export interface EditItemDialogProps extends ChildrenType {
  item: FashionItem;
  onUpdate: (item: FashionItem) => void;
}
