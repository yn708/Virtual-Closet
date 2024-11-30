'use client';

import SubmitButton from '@/components/elements/button/SubmitButton';
import type { OnSuccessType, UserDetailType } from '@/types';
import type { FC } from 'react';
import { useProfileForm } from '../../hooks/useProfileForm';
import ProfileFields from './ProfileFields';

const UserProfileForm: FC<UserDetailType & OnSuccessType> = ({ userDetail, onSuccess }) => {
  const { state, formAction, handleDelete } = useProfileForm(userDetail, onSuccess);
  return (
    <form action={formAction} className="space-y-8">
      <ProfileFields
        state={state}
        userDetail={userDetail}
        onImageDelete={handleDelete('image')}
        onBirthDateDelete={handleDelete('birthDate')}
      />
      <SubmitButton className="max-w-24 float-end" label="保存" />
    </form>
  );
};
export default UserProfileForm;
