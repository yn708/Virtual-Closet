import type { BaseFieldProps, Brand, Category, Color, FieldValueProps, LabelType } from '@/types';

/* ----------------------------------------------------------------
Form Field
------------------------------------------------------------------ */
export interface ColorSelectFieldProps extends BaseFieldProps, FieldValueProps {
  options: Color[];
}
export interface BrandSelectFieldProps extends BaseFieldProps, FieldValueProps {
  options: Brand[];
}

export interface CategorySelectFieldProps extends BaseFieldProps {
  value?: string;
  options: Category[];
  renderIcon?: (categoryId: string) => React.ReactNode;
}

/* ----------------------------------------------------------------
Brand
------------------------------------------------------------------ */
export interface BrandContentProps {
  selectedValue?: string;
  onValueChange: (value: string) => void;
  initialOptions: Brand[];
}

export interface BrandListProps extends LabelType {
  brands: Brand[];
  isLoading?: boolean;
  emptyMessage?: string;
  selectedValue?: string;
  onValueChange: (value: string) => void;
}
