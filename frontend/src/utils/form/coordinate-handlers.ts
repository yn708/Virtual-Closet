import type { InitialItems } from '@/features/my-page/coordinate/types';
import type { BaseCoordinate } from '@/types/coordinate';
import type { z } from 'zod';
import type {
  customCoordinateCreateFormSchema,
  customCoordinateUpdateFormSchema,
  photoCoordinateCreateFormSchema,
  photoCoordinateUpdateFormSchema,
} from '../validations/coordinate-validation';
import { handleArrayField, handleImage } from './form-helpers';

type ValidatedPhotoData =
  | z.infer<typeof photoCoordinateCreateFormSchema>
  | z.infer<typeof photoCoordinateUpdateFormSchema>;

type ValidatedCustomData =
  | z.infer<typeof customCoordinateCreateFormSchema>
  | z.infer<typeof customCoordinateUpdateFormSchema>;

interface ItemsData {
  items: Array<unknown>;
  background: string;
}

interface currentItems {
  item: string;
  position_data: {
    scale: number;
    rotate: number;
    zIndex: number;
    xPercent: number;
    yPercent: number;
  };
}

interface initialItems {
  item_id: string;
  image: string;
  position_data: {
    scale: number;
    rotate: number;
    zIndex: number;
    xPercent: number;
    yPercent: number;
  };
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
    image: formData.get('image'),
    items: formData.get('items'),
    background: formData.get('background'),
    seasons: formData.getAll('seasons') || [],
    tastes: formData.getAll('tastes') || null,
    scenes: formData.getAll('scenes') || null,
  };
}
/*---------------------––––––---------------------------
アイテムデータの検証と処理
---------------------––––––---------------------------*/
function validateAndProcessItems(itemsStr: string | null): {
  isValid: boolean;
  data?: ItemsData;
  error?: string;
} {
  if (!itemsStr) {
    return { isValid: false, error: 'アイテムデータが必要です' };
  }

  try {
    const itemsData = JSON.parse(itemsStr) as ItemsData;

    if (!Array.isArray(itemsData.items) || itemsData.items.length < 2) {
      return { isValid: false, error: '最低2つのアイテムが必要です' };
    }

    if (!itemsData.background) {
      return { isValid: false, error: '背景データが必要です' };
    }

    return { isValid: true, data: itemsData };
  } catch (error) {
    console.error(error);
    return { isValid: false, error: 'アイテムデータの形式が不正です' };
  }
}

// アイテムの比較用ヘルパー関数
function compareItems(currentItems: currentItems[], initialItems: initialItems[]): boolean {
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
  initialData?: BaseCoordinate,
  initialItems?: InitialItems,
): { apiFormData: FormData; hasChanges: boolean } {
  const apiFormData = new FormData();
  let hasChanges = false;

  // 画像の処理
  // hasChanges = handleImage(apiFormData, validatedData.image) || hasChanges;
  // 画像の変更検知と処理
  if (validatedData.image instanceof File) {
    // 新規作成時は必ずアペンド
    if (!initialData) {
      apiFormData.append('image', validatedData.image);
      hasChanges = true;
    } else {
      // 更新時は、ファイル名が変更された場合にのみアペンド
      const currentFileName = validatedData.image.name;
      const initialFileName = initialData.image.split('/').pop(); // URLから最後のパスを取得

      if (currentFileName !== initialFileName) {
        apiFormData.append('image', validatedData.image);
        hasChanges = true;
      }
    }
  }

  // アイテムデータの処理
  if (typeof validatedData.items === 'string') {
    const result = validateAndProcessItems(validatedData.items);
    if (result.isValid && result.data) {
      // 背景色の比較
      if (!initialItems || result.data.background !== initialItems.background) {
        apiFormData.append('background', result.data.background);
        hasChanges = true;
      }

      // アイテムの比較
      if (!initialItems || compareItems(result.data.items as currentItems[], initialItems.items)) {
        apiFormData.append('items', JSON.stringify(result.data.items));
        hasChanges = true;
      }
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
  arrayFields.forEach((key) => {
    const value = validatedData[key];
    hasChanges = handleArrayField(apiFormData, key, value, convertedInitialData) || hasChanges;
  });

  return { apiFormData, hasChanges };
}
