import type { CategoryCache, FilterState } from '@/features/my-page/fashion-item/types';
import type { FashionItem } from './fashion-item';

/* ----------------------------------------------------------------
useImage、context
------------------------------------------------------------------ */
export interface UseImageType {
  image: File | null;
  minimumImageSet: (file: File) => Promise<File>;
  optimizationProcess: (file: File) => Promise<File | null>;
  removeBgProcess: (file: File) => Promise<File | null>;
  preview: string | null;
  isProcessing: boolean;
  clearImage: () => void;
}

/* ----------------------------------------------------------------
useIsOpen
------------------------------------------------------------------ */
export interface UseIsOpenOnCloseType {
  onClose: () => void;
}

/* ----------------------------------------------------------------
FashionItemsContext
------------------------------------------------------------------ */
export interface FashionItemsContextType {
  categoryCache: CategoryCache;
  selectedCategory?: string;
  filters: FilterState;
  isPending: boolean;
  handleCategoryChange: (categoryId: string) => Promise<void>;
  handleDelete: (id: string) => Promise<void>;
  handleUpdate: (updatedItem: FashionItem) => void;
  handleFilterChange: (newFilters: Partial<FilterState>) => void;
  currentItems: FashionItem[];
}
