import { GENDER_ITEMS } from '@/utils/data/selectData';

import FloatingLabelInput from '@/components/elements/form/input/FloatingLabelInput';
import FloatingLabelSelect from '@/components/elements/form/select/FloatingLabelSelect';
import type { FC } from 'react';
import type { ProfileFieldsProps } from '../../types';
import BirthDateFields from './BirthDateFields';
import ProfileImageField from './ProfileImageField';

const ProfileFields: FC<ProfileFieldsProps> = ({
  state,
  userDetail,
  onImageDelete,
  onBirthDateDelete,
}) => {
  return (
    <>
      <ProfileImageField
        state={state}
        profileImage={userDetail.profile_image}
        onDelete={userDetail.profile_image ? onImageDelete : undefined}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FloatingLabelInput
          name="username"
          label="ユーザー名(必須)"
          defaultValue={userDetail.username}
          error={state.errors?.username}
        />
        <FloatingLabelInput
          name="name"
          label="名前"
          defaultValue={userDetail.name}
          error={state.errors?.name}
        />
      </div>
      <BirthDateFields
        state={state}
        onDelete={onBirthDateDelete}
        defaultBirthDate={userDetail.birth_date}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FloatingLabelSelect
          name="gender"
          label="性別"
          options={GENDER_ITEMS}
          defaultValue={userDetail.gender as string}
          error={state?.errors?.gender}
        />
        <FloatingLabelInput
          name="height"
          label="身長 (cm)"
          type="number"
          defaultValue={userDetail.height as string}
          error={state?.errors?.height}
        />
      </div>
    </>
  );
};
export default ProfileFields;
