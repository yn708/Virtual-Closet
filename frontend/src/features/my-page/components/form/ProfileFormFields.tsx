import FloatingLabelInputFormField from '@/components/elements/form/FloatingLabelInputFormField';
import FloatingLabelSelectFormField from '@/components/elements/form/FloatingLabelSelectFormField';
import { GENDER_ITEMS } from '@/utils/data/selectData';
import { type FC } from 'react';
import type { UseFormReturn } from 'react-hook-form';

import type { UserType } from '@/types';
import type { ProfileEditFormData } from '../../types';
import { BirthDateFields } from './BirthDateFields';
import ProfileImageFormField from './ProfileImageFormField';

interface ProfileFormFieldsProps {
  form: UseFormReturn<ProfileEditFormData>;
  userDetail: Partial<UserType>;
  onImageDelete: () => void;
  onBirthDateDelete: () => void;
}

export const ProfileFormFields: FC<ProfileFormFieldsProps> = ({
  form,
  userDetail,
  onImageDelete,
  onBirthDateDelete,
}) => {
  return (
    <>
      <ProfileImageFormField
        form={form}
        profileImage={userDetail.profile_image}
        onDelete={userDetail.profile_image ? onImageDelete : undefined}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FloatingLabelInputFormField form={form} name="username" label="ユーザー名(必須)" />
        <FloatingLabelInputFormField form={form} name="name" label="名前" />
      </div>
      <BirthDateFields
        form={form}
        onDelete={userDetail.birth_date ? onBirthDateDelete : undefined}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FloatingLabelSelectFormField
          form={form}
          name="gender"
          label="性別"
          options={GENDER_ITEMS}
        />
        <FloatingLabelInputFormField form={form} name="height" label="身長 (cm)" type="number" />
      </div>
    </>
  );
};
