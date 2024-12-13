import HiddenFileInput from '@/components/elements/form/input/HiddenFileInput';
import LoadingElements from '@/components/elements/loading/LoadingElements';
import ProfileAvatar from '@/components/elements/utils/ProfileAvatar';
import React from 'react';
import { useProfileImage } from '../../hooks/useProfileImage';
import type { ProfileImageFieldProps } from '../../types';
import ImageCropDialog from '../dialog/ImageCropDialog';
import ProfileImageDropdownMenu from '../dropdown-menu/ProfileImageDropdownMenu';

const ProfileImageField: React.FC<ProfileImageFieldProps> = ({ state, profileImage, onDelete }) => {
  const {
    dialogState,
    isProcessing,
    imageToEdit,
    currentPreviewImage,
    preview,
    handleFileSelect,
    handleCropComplete,
    handleDelete,
    handleClear,
  } = useProfileImage({ profileImage, onDelete });

  return (
    <div className="space-y-2">
      <HiddenFileInput name="profile_image" onChange={handleFileSelect} />

      <div className="relative w-fit mx-auto">
        {isProcessing ? (
          <LoadingElements message="画像を処理中..." />
        ) : (
          <>
            <ProfileAvatar src={currentPreviewImage} alt="プロフィール画像" size="sm" />
            <ProfileImageDropdownMenu
              onDeleteImage={preview ? handleClear : handleDelete}
              hasImage={!!profileImage}
              hasPreview={!!preview}
            />
          </>
        )}
      </div>

      {imageToEdit && (
        <ImageCropDialog
          open={dialogState.isOpen}
          onClose={dialogState.onClose}
          image={imageToEdit}
          onCropComplete={handleCropComplete}
        />
      )}

      {state?.errors?.['profile_image'] && (
        <p className="text-sm text-center text-red-500 mt-1">{state.errors['profile_image']}</p>
      )}
    </div>
  );
};

export default ProfileImageField;
