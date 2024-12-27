'use server';

import { registerCustomCoordinateAPI } from '@/lib/api/coordinateApi';
import type { FormState } from '@/types';
import { COORDINATE_CREATE_CANVAS_URL, TOP_URL } from '@/utils/constants';
import { customCoordinateCreateFormSchema } from '@/utils/validations/coordinate-validation';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function customCoordinateCreateAction(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  // バリデーションと取得
  const validatedFields = customCoordinateCreateFormSchema.safeParse({
    preview_image: formData.get('preview_image'),
    items: formData.get('items'),
    seasons: formData.getAll('seasons') || [],
    tastes: formData.getAll('tastes') || null,
    scenes: formData.getAll('scenes') || null,
  });

  // バリデーションエラーの処理
  if (!validatedFields.success) {
    return {
      message: 'バリデーションエラー',
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
    };
  }

  // APIに送信するFormDataの作成
  const apiFormData = new FormData();

  // プレビュー画像の処理
  if (validatedFields.data.preview_image instanceof File) {
    apiFormData.append('preview_image', validatedFields.data.preview_image);
  }

  // itemsデータの処理
  const itemsStr = validatedFields.data.items;
  if (typeof itemsStr === 'string') {
    const itemsData = JSON.parse(itemsStr);
    if (!Array.isArray(itemsData) || itemsData.length < 2) {
      return {
        message: '最低2つのアイテムが必要です',
        errors: { items: ['最低2つのアイテムが必要です'] },
        success: false,
      };
    }
    // APIに送信するデータ形式を修正
    apiFormData.append('items', JSON.stringify(itemsData));
  }

  // その他のフィールド処理
  Object.entries(validatedFields.data).forEach(([key, value]) => {
    if (key === 'preview_image' || key === 'items') return;

    if (Array.isArray(value) && value.length > 0) {
      // seasons, tastes, scenesの処理
      value.forEach((item) => {
        apiFormData.append(key, item);
      });
    }
  });

  await registerCustomCoordinateAPI(apiFormData);

  // 成功時の処理
  revalidatePath(COORDINATE_CREATE_CANVAS_URL);
  redirect(TOP_URL);
}
