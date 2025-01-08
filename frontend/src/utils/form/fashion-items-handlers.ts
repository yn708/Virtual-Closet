import type { FashionItem } from '@/types';
import type {
  fashionItemCreateFormSchema,
  fashionItemUpdateFormSchema,
} from '@/utils/validations/fashion-item-validation';
import type { z } from 'zod';
import { handleArrayField, handleBooleanField, handleIdField, handleImage } from './form-helpers';

type ValidatedData =
  | z.infer<typeof fashionItemCreateFormSchema>
  | z.infer<typeof fashionItemUpdateFormSchema>;

/*---------------------––––––---------------------------
FormDataからフィールドを取得
---------------------––––––---------------------------*/
// ファッションアイテム
export function getFashionItemFormFields(formData: FormData) {
  return {
    sub_category: formData.get('sub_category'),
    brand: formData.get('brand') || null,
    seasons: formData.getAll('seasons') || [],
    price_range: formData.get('price_range') || null,
    design: formData.get('design') || null,
    main_color: formData.get('main_color') || null,
    is_owned: formData.get('is_owned') === 'true',
    is_old_clothes: formData.get('is_old_clothes') === 'true',
    image: formData.get('image'),
  };
}

/*---------------------––––––---------------------------
FormDataを作成する共通関数
---------------------––––––---------------------------*/
export function fashionItemFormData(
  validatedData: ValidatedData,
  initialData?: FashionItem,
): { apiFormData: FormData; hasChanges: boolean } {
  const apiFormData = new FormData();
  let hasChanges = false; // 変更があるかどうか(Updateモードのみ)

  // 画像とシーズンの処理
  hasChanges = handleImage(apiFormData, validatedData.image) || hasChanges;
  hasChanges =
    handleArrayField(
      apiFormData,
      'seasons',
      validatedData.seasons,
      initialData ? { seasons: initialData.seasons } : undefined,
    ) || hasChanges;

  if (initialData) {
    // Update時の処理
    // IDフィールドの処理
    const idFields = ['brand', 'price_range', 'design', 'main_color'] as const;
    idFields.forEach((key) => {
      hasChanges =
        handleIdField(apiFormData, key, validatedData[key], initialData[key]) || hasChanges;
    });

    // ブール値フィールドの処理
    const booleanFields = ['is_owned', 'is_old_clothes'] as const;
    booleanFields.forEach((key) => {
      hasChanges =
        handleBooleanField(apiFormData, key, validatedData[key], initialData[key]) || hasChanges;
    });

    // sub_categoryの処理
    if (
      validatedData.sub_category &&
      validatedData.sub_category.toString() !== initialData.sub_category?.id?.toString()
    ) {
      apiFormData.append('sub_category', validatedData.sub_category.toString());
      hasChanges = true;
    }
  } else {
    // Create時の処理
    // その他のフィールドの処理
    Object.entries(validatedData).forEach(([key, value]) => {
      if (value !== null && value !== undefined && key !== 'image' && key !== 'seasons') {
        apiFormData.append(key, value.toString());
        hasChanges = true;
      }
    });
  }

  return { apiFormData, hasChanges };
}
