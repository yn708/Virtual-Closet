/*---------------------––––––---------------------------
共通フォームの処理
---------------------––––––---------------------------*/
// 画像の処理
export function handleImage(apiFormData: FormData, image: unknown): boolean {
  if (image instanceof File) {
    apiFormData.append('image', image);
    return true;
  }
  return false;
}

// 配列フィールドの汎用処理関数
export function handleArrayField(
  apiFormData: FormData,
  key: string,
  currentValues: unknown[] | undefined | null,
  initialData?: { [key: string]: { id: string | number }[] },
): boolean {
  if (!currentValues) return false;
  if (!Array.isArray(currentValues)) return false;

  if (!initialData) {
    // Create時の処理
    currentValues.forEach((value) => apiFormData.append(key, String(value)));
    return true;
  }

  // Update時の処理
  const initialIds = initialData[key]?.map((item) => item.id.toString()) || [];
  const currentIds = currentValues.map(String);

  /*
  *初期値が存在し、currentValuesが空配列の場合は必ずアペンド
  *バックエンドの処理    
  []: 空配列の場合はそのレコードを削除
    : 何もない送信しない場合はそのまま
  */

  if (initialIds.length > 0 && currentIds.length === 0) {
    apiFormData.append(key, '[]');
    return true;
  }

  const hasFieldChanges =
    currentIds.length !== initialIds.length ||
    !currentIds.every((v) => initialIds.includes(v)) ||
    !initialIds.every((v) => currentIds.includes(v));

  if (hasFieldChanges) {
    currentIds.forEach((value) => apiFormData.append(key, value));
  }

  return hasFieldChanges;
}

// IDフィールドの変更を検出
// （brand, price_range, design, main_colorで使用）
export function handleIdField(
  apiFormData: FormData,
  key: string,
  value: unknown,
  initialValue: {
    id: string;
    [key: string]: unknown;
  } | null,
): boolean {
  const initialId = initialValue?.id?.toString() || null;
  if (value !== initialId) {
    apiFormData.append(key, value?.toString() ?? '');
    return true;
  }
  return false;
}

// ブール値フィールドの変更を検出
// （is_owned, is_old_clothesで使用）
export function handleBooleanField(
  apiFormData: FormData,
  key: string,
  value: unknown,
  initialValue?: boolean,
): boolean {
  if (typeof value === 'boolean' && value !== initialValue) {
    apiFormData.append(key, value.toString());
    return true;
  }
  return false;
}
