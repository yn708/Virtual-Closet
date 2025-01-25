'use server';

import { updateUserProfileAPI } from '@/lib/api/userApi';
import type { FormStateWithChange, UserType } from '@/types';
import { MY_PAGE_URL } from '@/utils/constants';
import { profileUpdateFormSchema } from '@/utils/validations/user-validation';
import { revalidatePath } from 'next/cache';

export async function profileUpdateAction(
  _prevState: FormStateWithChange,
  formData: FormData,
  userDetail: Partial<UserType>,
  deleteState: { image: boolean; birthDate: boolean },
): Promise<FormStateWithChange> {
  try {
    // バリデーションと取得
    const validatedFields = profileUpdateFormSchema.safeParse({
      username: formData.get('username'),
      name: formData.get('name') || null,
      birth_year: formData.get('birth_year') || null,
      birth_month: formData.get('birth_month') || null,
      birth_day: formData.get('birth_day') || null,
      gender: formData.get('gender') || null,
      height: formData.get('height') || null,
      profile_image: formData.get('profile_image') || null,
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
    const { profile_image, username, name, birth_year, birth_month, birth_day, gender, height } =
      validatedFields.data;

    let hasChanges = false; // 変更があった場合のみに送信（Trueの場合にのみAPI通信）

    // プロフィール画像の変更検出
    if (profile_image && profile_image.size > 0) {
      apiFormData.append('profile_image', profile_image);
      hasChanges = true;
    } else if (deleteState.image && userDetail.profile_image) {
      apiFormData.append('delete_profile_image', 'true');
      hasChanges = true;
    }

    // 生年月日の変更検出
    const currentBirthDate = userDetail.birth_date;
    const newBirthDate =
      birth_year && birth_month && birth_day
        ? `${birth_year}-${birth_month.padStart(2, '0')}-${birth_day.padStart(2, '0')}`
        : null;

    if (deleteState.birthDate && currentBirthDate && !newBirthDate) {
      apiFormData.append('delete_birth_date', 'true');
      hasChanges = true;
    } else if (newBirthDate && newBirthDate !== currentBirthDate) {
      apiFormData.append('birth_date', newBirthDate);
      hasChanges = true;
    }

    // ユーザー名の変更検出
    if (username !== userDetail.username) {
      hasChanges = true;
    }
    // usernameは必須であるので必ず追加する
    apiFormData.append('username', username);

    // 名前の変更検出
    const currentName = userDetail.name ?? '';
    const newName = name ?? '';
    if (newName !== currentName) {
      apiFormData.append('name', newName);
      hasChanges = true;
    }

    // 性別の変更検出
    const currentGender = userDetail.gender ?? '';
    const newGender = gender ?? '';
    if (newGender !== currentGender) {
      apiFormData.append('gender', newGender);
      hasChanges = true;
    }

    // 身長の変更検出
    const currentHeight = userDetail.height?.toString() ?? '';
    const newHeight = height?.toString() ?? '';
    if (newHeight !== currentHeight) {
      apiFormData.append('height', newHeight);
      hasChanges = true;
    }

    // 変更がある場合のみ送信実行
    if (hasChanges) {
      await updateUserProfileAPI(apiFormData);
      revalidatePath(MY_PAGE_URL, 'layout');
      return {
        message: '更新が完了しました',
        errors: null,
        success: true,
        hasChanges: true,
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
    return {
      message: error instanceof Error ? error.message : '予期せぬエラーが発生しました',
      errors: null,
      success: false,
    };
  }
}
