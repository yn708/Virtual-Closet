import HiddenFileInput from '@/components/elements/form/HiddenFileInput';
import LoadingElements from '@/components/elements/loading/LoadingElements';
import ProfileAvatar from '@/components/elements/utils/ProfileAvatar';
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { useImage } from '@/context/ImageContext';
import { useImageSelection } from '@/hooks/image/useImageSelection';
import { useToast } from '@/hooks/use-toast';
import type { UserType } from '@/types';
import { BACKEND_URL } from '@/utils/constants';
import { useState } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { useImageProcessing } from '../../hooks/useImageProcessing';
import type { ProfileEditFormData } from '../../types';
import ImageCropDialog from '../dialog/ImageCropDialog';
import ProfileImageDropdownMenu from '../dropdown-menu/ProfileImageDropdownMenu';

interface ProfileImageFormFieldProps {
  form: UseFormReturn<ProfileEditFormData>;
  profileImage?: UserType['profile_image'];
  onDelete?: () => void;
}

const ProfileImageFormField: React.FC<ProfileImageFormFieldProps> = ({
  form,
  profileImage,
  onDelete,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [imageToEdit, setImageToEdit] = useState<string | null>(null);
  const [isImageDeleted, setIsImageDeleted] = useState(false);

  const { fileInputRef, handleFileInput, handleFileChange } = useImageSelection();
  const { setImage, preview, clearImage } = useImage();
  const { processImageFile, createImagePreview } = useImageProcessing();
  const { toast } = useToast();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsProcessing(true);
    try {
      const result = await handleFileChange(e);
      if (result.file) {
        const processedFile = await processImageFile(result.file);
        const previewUrl = await createImagePreview(processedFile);
        setImageToEdit(previewUrl);
        setIsDialogOpen(true);
      }
    } catch (error) {
      if (error) {
        toast({
          title: 'エラー',
          description: '画像の処理中にエラーが発生しました',
          variant: 'destructive',
        });
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCropComplete = (croppedImage: File) => {
    setImage(croppedImage);
    setIsDialogOpen(false);
    setIsImageDeleted(false);
  };

  const handleDelete = () => {
    clearImage();
    form.setValue('profile_image', null);
    setIsImageDeleted(true);
    if (onDelete) onDelete();
  };

  const currentPreviewImage = isImageDeleted
    ? ''
    : preview || (profileImage ? `${BACKEND_URL}${profileImage}` : '');

  return (
    <>
      <FormField
        control={form.control}
        name="profile_image"
        render={({ field }) => (
          <FormItem>
            <div className="relative w-fit mx-auto">
              {isProcessing ? (
                <LoadingElements message="画像を処理中..." />
              ) : (
                <>
                  <ProfileAvatar src={currentPreviewImage} alt="プロフィール画像" size="sm" />
                  <ProfileImageDropdownMenu
                    onSelectImage={handleFileInput}
                    onDeleteImage={preview ? clearImage : handleDelete}
                    hasImage={!!profileImage}
                    hasPreview={!!preview}
                  />
                </>
              )}
            </div>
            <FormControl>
              <HiddenFileInput {...field} ref={fileInputRef} onChange={handleFileSelect} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      {imageToEdit && (
        <ImageCropDialog
          open={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          image={imageToEdit}
          onCropComplete={handleCropComplete}
        />
      )}
    </>
  );
};

export default ProfileImageFormField;
