import type {
  BaseFieldProps,
  BaseFieldsStateProps,
  Brand,
  Category,
  Color,
  FashionItem,
  FieldValueProps,
  LabelType,
  MetaDataType,
} from '@/types';

/* ----------------------------------------------------------------
Form Field
------------------------------------------------------------------ */
export interface ColorSelectFieldProps extends BaseFieldProps, FieldValueProps {
  options: Color[];
}
export interface BrandSelectFieldProps extends BaseFieldProps {
  value?: Brand;
  onChange?: (value: Brand | string) => void;
  options: Brand[];
}

export interface CategorySelectFieldProps extends BaseFieldProps {
  value?: string;
  options: Category[];
  renderIcon?: (categoryId: string) => React.ReactNode;
}

export interface ItemEditorFormProps {
  metaData: MetaDataType;
  initialData?: FashionItem;
  onSuccess?: (updatedItem: FashionItem) => void;
}

export interface FormFieldsProps extends BaseFieldsStateProps {
  metaData: MetaDataType;
  initialData?: FashionItem;
}

/* ----------------------------------------------------------------
Brand
------------------------------------------------------------------ */
export interface BrandContentProps {
  selectedValue?: string;
  selectedBrand?: Brand;
  onValueChange: (value: Brand | string) => void;
  initialOptions: Brand[];
}

export interface BrandListProps extends LabelType {
  brands: Brand[];
  isLoading?: boolean;
  emptyMessage?: string;
  selectedValue?: string;
  onValueChange: (value: Brand | string) => void;
}
/* ----------------------------------------------------------------
hooks
------------------------------------------------------------------ */
export interface UseItemEditorFormProps {
  initialData?: FashionItem;
  onSuccess?: (item: FashionItem) => void;
}
