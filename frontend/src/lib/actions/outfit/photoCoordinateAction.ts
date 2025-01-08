'use server';

import { registerCoordinateAPI, updateCoordinateAPI } from '@/lib/api/coordinateApi';
import type { FormState, FormStateCoordinateUpdate } from '@/types';
import type { BaseCoordinate } from '@/types/coordinate';
import { COORDINATE_CREATE_URL, TOP_URL } from '@/utils/constants';
import {
  getPhotoCoordinateFormFields,
  photoCoordinateFormData,
} from '@/utils/form/coordinate-handlers';
import {
  photoCoordinateCreateFormSchema,
  photoCoordinateUpdateFormSchema,
} from '@/utils/validations/coordinate-validation';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

/* ----------------------------------------------------------------
フォトコーディネート登録アクション
------------------------------------------------------------------ */
export async function photoCoordinateCreateAction(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  // バリデーション
  const validatedFields = photoCoordinateCreateFormSchema.safeParse(
    getPhotoCoordinateFormFields(formData),
  );

  if (!validatedFields.success) {
    return {
      message: 'バリデーションエラー',
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
    };
  }

  const { apiFormData } = photoCoordinateFormData(validatedFields.data);
  await registerCoordinateAPI('photo', apiFormData);
  revalidatePath(COORDINATE_CREATE_URL);
  redirect(TOP_URL);
}

/* ----------------------------------------------------------------
フォトコーディネート登録更新アクション
------------------------------------------------------------------ */
export async function photoCoordinateUpdateAction(
  _prevState: FormStateCoordinateUpdate,
  formData: FormData,
  initialData: BaseCoordinate,
): Promise<FormStateCoordinateUpdate> {
  try {
    // バリデーション
    const validatedFields = photoCoordinateUpdateFormSchema.safeParse(
      getPhotoCoordinateFormFields(formData),
    );

    if (!validatedFields.success) {
      return {
        message: 'バリデーションエラー',
        errors: validatedFields.error.flatten().fieldErrors,
        success: false,
      };
    }

    const { apiFormData, hasChanges } = photoCoordinateFormData(validatedFields.data, initialData);

    if (!hasChanges) {
      return {
        message: '変更がありません',
        errors: null,
        success: false,
        hasChanges: false,
      };
    }
    const updatedItem = await updateCoordinateAPI('photo', initialData.id, apiFormData);

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
