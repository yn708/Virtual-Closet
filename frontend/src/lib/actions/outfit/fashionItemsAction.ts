'use server';

import { registerFashionItemAPI, updateFashionItemAPI } from '@/lib/api/fashionItemsApi';
import type { FashionItem, FormState, FormStateFashionItemUpdate } from '@/types';
import { ITEM_CREATE_URL } from '@/utils/constants';
import { fashionItemFormData, getFashionItemFormFields } from '@/utils/form/fashion-items-handlers';
import {
  fashionItemCreateFormSchema,
  fashionItemUpdateFormSchema,
} from '@/utils/validations/fashion-item-validation';
import { revalidatePath } from 'next/cache';

/* ----------------------------------------------------------------
ファッションアイテム登録アクション
------------------------------------------------------------------ */
export async function fashionItemsCreateAction(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  // バリデーション
  const validatedFields = fashionItemCreateFormSchema.safeParse(getFashionItemFormFields(formData));

  if (!validatedFields.success) {
    return {
      message: 'バリデーションエラー',
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
    };
  }

  const { apiFormData } = fashionItemFormData(validatedFields.data);
  try {
    await registerFashionItemAPI(apiFormData);
    revalidatePath(ITEM_CREATE_URL);
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
ファッションアイテム登録更新アクション
------------------------------------------------------------------ */
export async function fashionItemsUpdateAction(
  _prevState: FormStateFashionItemUpdate,
  formData: FormData,
  initialData: FashionItem,
): Promise<FormStateFashionItemUpdate> {
  try {
    // バリデーション
    const validatedFields = fashionItemUpdateFormSchema.safeParse(
      getFashionItemFormFields(formData),
    );

    if (!validatedFields.success) {
      return {
        message: 'バリデーションエラー',
        errors: validatedFields.error.flatten().fieldErrors,
        success: false,
      };
    }

    const { apiFormData, hasChanges } = fashionItemFormData(validatedFields.data, initialData);

    if (!hasChanges) {
      return {
        message: '変更がありません',
        errors: null,
        success: false,
        hasChanges: false,
      };
    }

    const updatedItem = await updateFashionItemAPI(initialData.id, apiFormData);

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
