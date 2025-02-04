import ImageCropContents from '@/components/elements/image/ImageCropContests';
import ProfileAvatar from '@/components/elements/utils/ProfileAvatar';
import React from 'react';
import { useProfileImage } from '../../hooks/useProfileImage';
import type { ProfileImageFieldProps } from '../../types';
import ProfileImageDropdownMenu from '../dropdown-menu/ProfileImageDropdownMenu';

const ProfileImageField: React.FC<ProfileImageFieldProps> = ({ state, profileImage, onDelete }) => {
  const { currentPreviewImage, preview, updateFileInput, handleDelete, handleClear } =
    useProfileImage({ profileImage, onDelete });

  return (
    <div className="space-y-2">
      <ImageCropContents name="profile_image" cropCallback={updateFileInput} cropShape="round">
        <div className="relative w-fit mx-auto">
          <ProfileAvatar src={currentPreviewImage} alt="プロフィール画像" size="sm" />
          <ProfileImageDropdownMenu
            onDeleteImage={preview ? handleClear : handleDelete}
            hasImage={!!profileImage}
            hasPreview={!!preview}
          />
        </div>
      </ImageCropContents>

      {state?.errors?.['profile_image'] && (
        <p className="text-sm text-center text-red-500 mt-1">{state.errors['profile_image']}</p>
      )}
    </div>
  );
};

export default ProfileImageField;
