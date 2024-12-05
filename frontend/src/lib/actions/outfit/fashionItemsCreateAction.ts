'use server';

import { registerFashionItem } from '@/lib/api/fashionItemsApi';
import type { FormState } from '@/types';
import { TOP_URL } from '@/utils/constants';
import { fashionItemCreateFormSchema } from '@/utils/validations/fashion-item-validation';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function fashionItemsCreateAction(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  // バリデーションと取得
  const validatedFields = fashionItemCreateFormSchema.safeParse({
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
    if (key === 'seasons' && Array.isArray(value)) {
      // 各seasonを個別のフィールドとして追加
      value.forEach((season) => {
        apiFormData.append('seasons', season);
      });
    } else if (value !== null && value !== undefined) {
      apiFormData.append(key, value.toString());
    }
  });

  await registerFashionItem(apiFormData);
  revalidatePath(TOP_URL);
  redirect(TOP_URL);
}
