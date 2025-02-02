'use server';

import type { InitialItems } from '@/features/my-page/coordinate/types';
import { registerCoordinateAPI, updateCoordinateAPI } from '@/lib/api/coordinateApi';
import type { FormState, FormStateCoordinateUpdate } from '@/types';
import type { BaseCoordinate } from '@/types/coordinate';
import { COORDINATE_CREATE_CANVAS_URL } from '@/utils/constants';
import {
  customCoordinateFormData,
  getCustomCoordinateFormFields,
} from '@/utils/form/coordinate-handlers';
import {
  customCoordinateCreateFormSchema,
  customCoordinateUpdateFormSchema,
} from '@/utils/validations/coordinate-validation';
import { revalidatePath } from 'next/cache';

/* ----------------------------------------------------------------
カスタムコーディネート登録アクション
------------------------------------------------------------------ */
export async function customCoordinateCreateAction(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  // バリデーション
  const validatedFields = customCoordinateCreateFormSchema.safeParse(
    getCustomCoordinateFormFields(formData),
  );

  if (!validatedFields.success) {
    return {
      message: 'バリデーションエラー',
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
    };
  }

  const { apiFormData } = customCoordinateFormData(validatedFields.data);
  try {
    await registerCoordinateAPI('custom', apiFormData);
    revalidatePath(COORDINATE_CREATE_CANVAS_URL);
    return {
      message: null,
      errors: null,
      success: true,
    };
  } catch (error) {
    if (error instanceof Error) {
      const errorData = JSON.parse(error.message);
      const errorMessage = errorData.non_field_errors?.[0];

      return {
        message: errorMessage,
        errors: null,
        success: false,
      };
    }
    return {
      message: null,
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
  initialItems?: InitialItems,
): Promise<FormStateCoordinateUpdate> {
  try {
    // バリデーション
    const validatedFields = customCoordinateUpdateFormSchema.safeParse(
      getCustomCoordinateFormFields(formData),
    );

    if (!validatedFields.success) {
      return {
        message: 'バリデーションエラー',
        errors: validatedFields.error.flatten().fieldErrors,
        success: false,
      };
    }

    const { apiFormData, hasChanges } = customCoordinateFormData(
      validatedFields.data,
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
    const updatedItem = await updateCoordinateAPI('custom', initialData.id, apiFormData);

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
