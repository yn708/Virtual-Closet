'use server';

import type { InitialItems } from '@/features/my-page/coordinate/types';
import { registerCustomCoordinateAPI, updateCustomCoordinateAPI } from '@/lib/api/coordinateApi';
import type { FormState, FormStateCoordinateUpdate } from '@/types';
import type { BaseCoordinate, ItemsData } from '@/types/coordinate';
import {
  customCoordinateFormData,
  getCustomCoordinateFormFields,
} from '@/utils/form/coordinate-handlers';
import { baseCoordinateSchema } from '@/utils/validations/coordinate-validation';

/* ----------------------------------------------------------------
カスタムコーディネート登録アクション
------------------------------------------------------------------ */
export async function customCoordinateCreateAction(
  _prevState: FormState,
  formData: FormData,
  itemsData: ItemsData,
): Promise<FormState> {
  // バリデーション
  const validatedFields = baseCoordinateSchema.safeParse(getCustomCoordinateFormFields(formData));

  if (!validatedFields.success) {
    return {
      message: 'バリデーションエラー',
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
    };
  }

  const coordinateData = {
    data: itemsData,
    seasons: validatedFields.data.seasons,
    scenes: validatedFields.data.scenes,
    tastes: validatedFields.data.tastes,
  };

  try {
    await registerCustomCoordinateAPI(coordinateData);

    return {
      message: null,
      errors: null,
      success: true,
    };
  } catch (error) {
    if (error instanceof Error) {
      try {
        const errorData = JSON.parse(error.message);
        const errorMessage = errorData.non_field_errors?.[0];

        return {
          message: errorMessage,
          errors: null,
          success: false,
        };
      } catch (parseError) {
        console.error(parseError);

        // JSONとしてパースできなかった場合
        return {
          message: 'エラーが発生しました。',
          errors: null,
          success: false,
        };
      }
    }

    return {
      message: '不明なエラーが発生しました。',
      errors: null,
      success: false,
    };
  }
}

/* ----------------------------------------------------------------
カスタムコーディネート登録更新アクション
------------------------------------------------------------------ */
export async function customCoordinateUpdateAction(
  _prevState: FormStateCoordinateUpdate,
  formData: FormData,
  initialData: BaseCoordinate,
  itemsData: ItemsData,
  initialItems?: InitialItems,
): Promise<FormStateCoordinateUpdate> {
  try {
    // バリデーション
    const validatedFields = baseCoordinateSchema.safeParse(getCustomCoordinateFormFields(formData));

    if (!validatedFields.success) {
      return {
        message: 'バリデーションエラー',
        errors: validatedFields.error.flatten().fieldErrors,
        success: false,
      };
    }

    const { hasChanges, changedFields } = customCoordinateFormData(
      validatedFields.data,
      itemsData,
      initialData,
      initialItems,
    );

    if (!hasChanges) {
      return {
        message: '変更がありません',
        errors: null,
        success: false,
        hasChanges: false,
      };
    }

    const updatedItem = await updateCustomCoordinateAPI(initialData.id, changedFields);

    return {
      message: '更新が完了しました',
      errors: null,
      success: true,
      hasChanges: true,
      updatedItem,
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
