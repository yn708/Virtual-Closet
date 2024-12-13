'use server';

import { updateFashionItemAPI } from '@/lib/api/fashionItemsApi';
import type { FashionItem, FormStateFashionItemUpdate } from '@/types';
import { fashionItemUpdateFormSchema } from '@/utils/validations/fashion-item-validation';

export async function fashionItemsUpdateAction(
  _prevState: FormStateFashionItemUpdate,
  formData: FormData,
  initialData: FashionItem,
): Promise<FormStateFashionItemUpdate> {
  try {
    // バリデーションと取得
    const validatedFields = fashionItemUpdateFormSchema.safeParse({
      sub_category: formData.get('sub_category'),
      brand: formData.get('brand') || null,
      seasons: formData.getAll('seasons') || [],
      price_range: formData.get('price_range') || null,
      design: formData.get('design') || null,
      main_color: formData.get('main_color') || null,
      is_owned: formData.get('is_owned') === 'true',
      is_old_clothes: formData.get('is_old_clothes') === 'true',
      image: formData.get('image'),
    });

    if (!validatedFields.success) {
      return {
        message: 'バリデーションエラー',
        errors: validatedFields.error.flatten().fieldErrors,
        success: false,
      };
    }

    const apiFormData = new FormData();

    let hasChanges = false; // 変更があった場合のみに送信（Trueの場合にのみAPI通信）

    Object.entries(validatedFields.data).forEach(([key, value]) => {
      if ((key === 'is_owned' || key === 'is_old_clothes') && value !== null) {
        // ブール値の場合のみ処理を行う
        if (typeof value === 'boolean' && value !== initialData[key]) {
          apiFormData.append(key, value.toString());
          hasChanges = true;
        }
      } else if (
        key === 'brand' ||
        key === 'price_range' ||
        key === 'design' ||
        key === 'main_color'
      ) {
        if (value !== (initialData[key]?.id?.toString() || null)) {
          apiFormData.append(key, value?.toString() ?? 'null');
          hasChanges = true;
        }
      } else if (key === 'sub_category') {
        if (value && value.toString() !== initialData[key]?.id?.toString()) {
          apiFormData.append(key, value.toString());
          hasChanges = true;
        }
      } else if (key === 'image') {
        if (value && value instanceof File) {
          apiFormData.append(key, value);
          hasChanges = true;
        }
      } else if (key === 'seasons') {
        const initialSeasonIds = initialData.seasons.map((s) => s.id.toString());
        const currentSeasons = Array.isArray(value) ? value.map(String) : [];
        const hasSeasonChanges =
          currentSeasons.length !== initialSeasonIds.length ||
          !currentSeasons.every((s) => initialSeasonIds.includes(s)) ||
          !initialSeasonIds.every((s) => currentSeasons.includes(s));

        if (hasSeasonChanges) {
          if (currentSeasons.length > 0) {
            // シーズンが存在する場合は、各シーズンを追加
            currentSeasons.forEach((season) => {
              apiFormData.append('seasons', season);
            });
          }
          hasChanges = true;
        }
      }
    });

    // 変更がある場合のみ送信実行
    if (hasChanges) {
      const updatedItem = await updateFashionItemAPI(initialData.id, apiFormData);

      return {
        message: '更新が完了しました',
        errors: null,
        success: true,
        hasChanges: true,
        updatedItem,
      };
    }

    // 変更がない場合
    return {
      message: '変更がありません',
      errors: null,
      success: false,
      hasChanges: false,
    };
  } catch (error) {
    console.error(error);
    return {
      message: error instanceof Error ? error.message : '予期せぬエラーが発生しました',
      errors: null,
      success: false,
    };
  }
}
