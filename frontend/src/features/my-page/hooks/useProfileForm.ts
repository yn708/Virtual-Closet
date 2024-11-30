'use client';

import { useImage } from '@/context/ImageContext';
import { useToast } from '@/hooks/use-toast';
import { profileUpdateAction } from '@/lib/actions/user/profileUpdateAction';
import type { FormStateWithChange, OnSuccessType, UserDetailType } from '@/types';
import { initialState } from '@/utils/data/initialState';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useFormState } from 'react-dom';

export const useProfileForm = (
  userDetail: UserDetailType['userDetail'],
  onSuccess?: OnSuccessType['onSuccess'],
) => {
  // 画像、生年月日の削除をするかどうかの状態管理
  const [deleteState, setDeleteState] = useState({
    image: false,
    birthDate: false,
  });

  const { toast } = useToast();
  const router = useRouter();
  const { clearImage } = useImage();

  const handleDelete = (type: 'image' | 'birthDate') => () => {
    setDeleteState((prev) => ({ ...prev, [type]: true }));
  };

  const handleFormAction = async (prevState: FormStateWithChange, formData: FormData) => {
    const result = await profileUpdateAction(prevState, formData, userDetail, deleteState);

    if (result.success && result.hasChanges) {
      toast({ title: result.message as string, duration: 3000 });
      clearImage();
      onSuccess?.();
      router.refresh();
    } else if (!result.hasChanges && !result.errors) {
      toast({ title: result.message as string, duration: 3000 });
    }

    return result;
  };

  const [state, formAction] = useFormState(handleFormAction, initialState);

  return {
    state,
    formAction,
    handleDelete,
  };
};
