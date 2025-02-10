import type { ItemStyle } from '@/features/coordinate/types';
import type { InitialItems } from '@/features/my-page/coordinate/types';
import type { BaseCoordinate, CustomCoordinateData, ItemsData, ItemType } from '@/types/coordinate';
import type { z } from 'zod';
import type {
  baseCoordinateSchema,
  photoCoordinateCreateFormSchema,
  photoCoordinateUpdateFormSchema,
} from '../validations/coordinate-validation';
import { handleArrayField, handleImage } from './form-helpers';

type ValidatedPhotoData =
  | z.infer<typeof photoCoordinateCreateFormSchema>
  | z.infer<typeof photoCoordinateUpdateFormSchema>;

type ValidatedCustomData = z.infer<typeof baseCoordinateSchema>;

interface initialItems {
  item_id: string;
  image: string;
  position_data: ItemStyle;
}

/*---------------------––––––---------------------------
FormDataからフィールドを取得
---------------------––––––---------------------------*/
// フォトコーディネート
export function getPhotoCoordinateFormFields(formData: FormData) {
  return {
    image: formData.get('image'),
    seasons: formData.getAll('seasons') || [],
    tastes: formData.getAll('tastes') || null,
    scenes: formData.getAll('scenes') || null,
  };
}

// カスタムコーディネート
export function getCustomCoordinateFormFields(formData: FormData) {
  return {
    seasons: formData.getAll('seasons') || [],
    tastes: formData.getAll('tastes') || null,
    scenes: formData.getAll('scenes') || null,
  };
}
/*---------------------––––––---------------------------
アイテムデータの検証と処理
---------------------––––––---------------------------*/

function validateAndProcessItems(data: ItemsData): {
  isValid: boolean;
  data?: ItemsData;
  error?: string;
} {
  if (!data) {
    return { isValid: false, error: 'アイテムデータが必要です' };
  }

  try {
    if (!Array.isArray(data.items) || data.items.length < 2) {
      return { isValid: false, error: '最低2つのアイテムが必要です' };
    }

    if (!data.background) {
      return { isValid: false, error: '背景データが必要です' };
    }

    return { isValid: true, data };
  } catch (error) {
    console.error(error);
    return { isValid: false, error: 'アイテムデータの形式が不正です' };
  }
}

// アイテムの比較用ヘルパー関数
function compareItems(currentItems: ItemType[], initialItems: initialItems[]): boolean {
  if (currentItems.length !== initialItems.length) return true;

  return currentItems.some((current, index) => {
    const initial = initialItems[index];
    if (String(current.item) !== String(initial.item_id)) return true;

    const currentPos = current.position_data;
    const initialPos = initial.position_data;

    return (
      currentPos.scale !== initialPos.scale ||
      currentPos.rotate !== initialPos.rotate ||
      currentPos.zIndex !== initialPos.zIndex ||
      currentPos.xPercent !== initialPos.xPercent ||
      currentPos.yPercent !== initialPos.yPercent
    );
  });
}

/*---------------------––––––---------------------------
FormDataを作成する共通関数
---------------------––––––---------------------------*/
// フォトコーディネート用
export function photoCoordinateFormData(
  validatedData: ValidatedPhotoData,
  initialData?: BaseCoordinate,
): { apiFormData: FormData; hasChanges: boolean } {
  const apiFormData = new FormData();
  let hasChanges = false;

  // 画像の処理
  hasChanges = handleImage(apiFormData, validatedData.image) || hasChanges;

  // initialDataを適切な形式に変換
  const convertedInitialData = initialData
    ? {
        seasons: initialData.seasons,
        tastes: initialData.tastes,
        scenes: initialData.scenes,
      }
    : undefined;

  // 配列フィールドの処理
  const arrayFields = ['seasons', 'tastes', 'scenes'] as const;
  arrayFields.forEach((key) => {
    const value = validatedData[key];

    hasChanges = handleArrayField(apiFormData, key, value, convertedInitialData) || hasChanges;
  });

  return { apiFormData, hasChanges };
}

// カスタムコーディネート用
export function customCoordinateFormData(
  validatedData: ValidatedCustomData,
  itemsData: ItemsData,
  initialData?: BaseCoordinate,
  initialItems?: InitialItems,
): { hasChanges: boolean; changedFields: CustomCoordinateData } {
  let hasChanges = false;
  const changedFields: Partial<CustomCoordinateData> = {};

  // アイテムデータの処理
  const result = validateAndProcessItems(itemsData);

  if (result.isValid && result.data) {
    // 背景色の比較
    if (!initialItems || result.data.background !== initialItems.background) {
      hasChanges = true;
    }

    // アイテムの比較
    if (!initialItems || compareItems(result.data.items as ItemType[], initialItems.items)) {
      hasChanges = true;
    }
    // 背景、アイテムのどちらかでも変わっていれば両方含めて送信
    if (hasChanges) {
      changedFields.data = {
        background: result.data.background ?? '',
        items: result.data.items ?? [],
      };
    }
  }

  // initialDataを適切な形式に変換
  const convertedInitialData = initialData
    ? {
        seasons: initialData.seasons,
        tastes: initialData.tastes,
        scenes: initialData.scenes,
      }
    : undefined;

  // 配列フィールドの処理
  const arrayFields = ['seasons', 'tastes', 'scenes'] as const;
  // handleArrayField の結果で変更がある場合のみ追加
  arrayFields.forEach((key) => {
    const apiFormData = new FormData();

    const value = validatedData[key];
    const hasFieldChange = handleArrayField(apiFormData, key, value, convertedInitialData);

    if (hasFieldChange) {
      hasChanges = true;
      changedFields[key] = value;
    }
  });

  return { hasChanges, changedFields: changedFields as CustomCoordinateData };
}
