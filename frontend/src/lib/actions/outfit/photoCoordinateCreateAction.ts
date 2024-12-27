'use server';

import { registerPhotoCoordinateAPI } from '@/lib/api/coordinateApi';
import type { FormState } from '@/types';
import { COORDINATE_CREATE_URL, TOP_URL } from '@/utils/constants';
import { photoCoordinateCreateFormSchema } from '@/utils/validations/coordinate-validation';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function photoCoordinateCreateAction(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  // バリデーションと取得
  const validatedFields = photoCoordinateCreateFormSchema.safeParse({
    image: formData.get('image'),
    seasons: formData.getAll('seasons') || [],
    tastes: formData.getAll('tastes') || null,
    scenes: formData.getAll('scenes') || null,
  });

  if (!validatedFields.success) {
    return {
      message: 'バリデーションエラー',
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
    };
  }

  /*
  フォーム追加処理
  */
  const apiFormData = new FormData();

  // プロフィール画像の変更検出
  if (validatedFields.data.image instanceof File) {
    apiFormData.append('image', validatedFields.data.image);
  }

  // その他のフィールド処理
  Object.entries(validatedFields.data).forEach(([key, value]) => {
    if (key === 'image') return; // imageは既に処理済みなのでスキップ

    if (Array.isArray(value)) {
      // seasons, tastes, scenesの処理
      value.forEach((item) => {
        apiFormData.append(key, item);
      });
    }
  });

  await registerPhotoCoordinateAPI(apiFormData);
  revalidatePath(COORDINATE_CREATE_URL);
  redirect(TOP_URL);
}
