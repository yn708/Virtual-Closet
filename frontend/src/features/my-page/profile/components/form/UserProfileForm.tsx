'use client';

import SubmitButton from '@/components/elements/button/SubmitButton';
import { Button } from '@/components/ui/button';
import { useImage } from '@/context/ImageContext';
import type { OnCloseType, UserDetailType } from '@/types';
import type { FC } from 'react';
import { useProfileForm } from '../../hooks/useProfileForm';
import ProfileFields from './ProfileFields';

const UserProfileForm: FC<UserDetailType & OnCloseType> = ({ userDetail, onClose }) => {
  const { state, formAction, handleDelete } = useProfileForm(userDetail, onClose);
  const { isProcessing, clearImage } = useImage();

  const handleCancel = () => {
    clearImage();
    onClose();
  };

  return (
    <form action={formAction} className="space-y-8">
      <ProfileFields
        state={state}
        userDetail={userDetail}
        onImageDelete={handleDelete('image')}
        onBirthDateDelete={handleDelete('birthDate')}
      />
      <div className="flex justify-end items-center gap-2">
        <Button type="button" variant="link" onClick={handleCancel}>
          キャンセル
        </Button>
        <SubmitButton className="max-w-24" label="保存" disabled={isProcessing} />
      </div>
    </form>
  );
};
export default UserProfileForm;
