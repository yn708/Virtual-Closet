import { useImage } from '@/context/ImageContext';
import { useGenericForm } from '@/hooks/form/useGenericForm';
import { useToast } from '@/hooks/use-toast';
import { updateUserProfileAPI } from '@/lib/api/userApi';
import type { UserType } from '@/types/user';
import { ProfileUpdateFormSchema } from '@/utils/validations/user-validation';
import { useState } from 'react';
import type { ProfileEditFormData } from '../types';
import { useBirthDateFields } from './useBirthDateFields';

export const useProfileForm = (userDetail: Partial<UserType>, onSuccess?: () => void) => {
  const { username, name, birth_date, gender, height } = userDetail;
  const { image, clearImage } = useImage();
  const { toast } = useToast();

  // 画像、生年月日を空にするかどうかの状態管理
  const [shouldDeleteImage, setShouldDeleteImage] = useState(false);
  const [shouldDeleteBirthDate, setShouldDeleteBirthDate] = useState(false);

  const defaultValues = {
    username,
    name: name || null,
    birth_year: birth_date?.split('-')[0] || null,
    birth_month: birth_date?.split('-')[1] || null,
    birth_day: birth_date?.split('-')[2] || null,
    gender: gender || null,
    height: height?.toString() || null,
  };

  const { form, onSubmit, isLoading, router } = useGenericForm<ProfileEditFormData>({
    schema: ProfileUpdateFormSchema,
    defaultValues,
    onSubmitSuccess: async (data) => {
      const formData = new FormData();
      let hasChanges = false;

      // usernameの変更をチェック
      if (data.username !== defaultValues.username) {
        hasChanges = true;
      }
      // usernameは必須のため必ず入れる
      formData.append('username', data.username);

      // 生年月日の処理
      if (shouldDeleteBirthDate) {
        // もし生年月日を削除する場合はTrueを送信
        formData.append('delete_birth_date', 'true');
        hasChanges = true;
      } else {
        const birthDate = getBirthDate();
        if (birthDate && birthDate !== birth_date) {
          formData.append('birth_date', birthDate);
          hasChanges = true;
        }
      }

      // 画像の処理
      // useImageのimageから取得して送信
      if (image instanceof File) {
        formData.append('profile_image', image);
        hasChanges = true;
      } else if (shouldDeleteImage) {
        // もし画像を削除する場合はTrueを送信
        formData.append('delete_profile_image', 'true');
        hasChanges = true;
      }

      // その他のフィールド処理
      Object.entries(data).forEach(([key, value]) => {
        if (
          key !== 'username' &&
          value !== null &&
          value !== undefined &&
          !['birth_year', 'birth_month', 'birth_day'].includes(key) &&
          value.toString() !== defaultValues[key as keyof typeof defaultValues]?.toString()
        ) {
          formData.append(key, value.toString());
          hasChanges = true;
        }
      });

      // もし変更されている場合のみ送信実行
      if (hasChanges) {
        await updateUserProfileAPI(formData);
        toast({
          title: 'プロフィールが更新されました',
        });
        if (onSuccess) {
          onSuccess();
        }
        clearImage();
        setShouldDeleteImage(false);
        setShouldDeleteBirthDate(false);
        router.refresh();
      } else {
        toast({
          title: '変更がありません',
        });
      }
    },
    onSubmitError: (error) => {
      if (error instanceof Error) {
        const errorData = JSON.parse(error.message);
        form.setError('username', {
          type: 'server',
          message: errorData.detail,
        });
      }
    },
  });

  const { getBirthDate } = useBirthDateFields(form);

  const handleBirthDateDelete = () => {
    form.setValue('birth_year', null);
    form.setValue('birth_month', null);
    form.setValue('birth_day', null);
    setShouldDeleteBirthDate(true);
  };

  const handleImageDelete = () => {
    setShouldDeleteImage(true);
    clearImage();
  };

  return {
    form,
    onSubmit,
    isLoading,
    handleImageDelete,
    handleBirthDateDelete,
  };
};
