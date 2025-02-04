import type { ItemStyle } from '@/features/coordinate/types';
import type { CategoryCache, FashionItemFilters } from '@/features/my-page/fashion-item/types';
import type { CountDataType } from './common';
import type { FashionItem } from './fashion-item';

/* ----------------------------------------------------------------
useImage、context
------------------------------------------------------------------ */
export interface UseImageType {
  image: File | null;
  preview: string | null;
  isProcessing: boolean;
  minimumImageSet: (file: File) => Promise<File>;
  compressImageProcess: (file: File) => Promise<File | null>;
  createImageUrl: (file: File) => Promise<string | null>;
  optimizationProcess: (file: File) => Promise<File | null>;
  removeBgProcess: (file: File) => Promise<File | null>;
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
// 状態の型定義
export interface FashionItemsState {
  categoryCache: CategoryCache;
  selectedCategory: string;
  filters: FashionItemFilters;
  isInitialLoading: boolean;
  isLoadingMore: boolean;
  currentItems: FashionItem[];
  hasMore: boolean;
  currentPage: number;
  countData: CountDataType | null;
}

// ハンドラーの型定義
export interface FashionItemsHandlers {
  handleCategoryChange: (categoryId: string) => Promise<void>;
  handleDelete: (id: string) => Promise<void>;
  handleUpdate: (updatedItem: FashionItem) => void;
  handleFilterChange: (newFilters: Partial<FashionItemFilters>) => void;
  loadMore: () => void;
}

export interface FashionItemsContextValue {
  state: FashionItemsState;
  handlers: FashionItemsHandlers;
}

/* ----------------------------------------------------------------
CustomCoordinateCanvasContext
------------------------------------------------------------------ */
// 状態の型定義
export interface CoordinateCanvasContextState {
  selectedItems: FashionItem[];
  itemStyles: Record<string, ItemStyle>;
  background: string;
}

// ハンドラーの型定義
export interface CoordinateCanvasContextHandlers {
  handleSelectItem: (item: FashionItem) => void;
  handleRemoveItem: (itemId: string) => void;
  handleUpdateStyles: (newStyles: Record<string, ItemStyle>) => void;
  handleFullReset: () => void;
  handleBackgroundChange: (background: string) => void;
}

export interface CoordinateCanvasContextValue {
  state: CoordinateCanvasContextState;
  handlers: CoordinateCanvasContextHandlers;
}
