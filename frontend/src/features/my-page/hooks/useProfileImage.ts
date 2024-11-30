import { useImage } from '@/context/ImageContext';
import { useImageSelection } from '@/hooks/image/useImageSelection';
import { useToast } from '@/hooks/use-toast';
import { useIsOpen } from '@/hooks/utils/useIsOpen';
import { BACKEND_URL } from '@/utils/constants';
import { compressImage, conversionImage, createImagePreview } from '@/utils/imageUtils';
import { useState } from 'react';
import type { UseProfileImageProps } from '../types';

export const useProfileImage = ({ profileImage, onDelete }: UseProfileImageProps) => {
  const dialogState = useIsOpen();

  // 画像処理の状態管理
  const [isProcessing, setIsProcessing] = useState(false);
  const [imageToEdit, setImageToEdit] = useState<string | null>(null);
  const [defaultProfileImage, setDefaultProfileImage] = useState(profileImage);

  const { handleFileChange } = useImageSelection();
  const { minimumImageSet, preview, clearImage } = useImage();
  const { toast } = useToast();

  // 画像のプレビューURL生成
  const currentPreviewImage =
    preview || (defaultProfileImage ? `${BACKEND_URL}${defaultProfileImage}` : '');

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsProcessing(true);
    try {
      const result = await handleFileChange(e);
      if (!result.file) return;

      const processedFile = await conversionImage(result.file);
      const compressedFile = await compressImage(processedFile);
      const previewUrl = await createImagePreview(compressedFile);

      setImageToEdit(previewUrl);
      dialogState.onToggle();
    } catch (error) {
      console.error(error);
      toast({
        title: 'エラー',
        description: '画像の処理中にエラーが発生しました',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const updateFileInput = (file?: File) => {
    const fileInput = document.querySelector('input[name="profile_image"]') as HTMLInputElement;
    if (!fileInput) return;

    const dataTransfer = new DataTransfer();
    if (file) {
      dataTransfer.items.add(file);
    }
    fileInput.files = dataTransfer.files;
  };

  const handleCropComplete = (croppedImage: File) => {
    updateFileInput(croppedImage);
    minimumImageSet(croppedImage);
    dialogState.onClose();
  };

  const handleDelete = () => {
    clearImage();
    setDefaultProfileImage(undefined);
    updateFileInput();
    onDelete?.();
  };

  const handleClear = () => {
    clearImage();
    setDefaultProfileImage(profileImage);
    updateFileInput();
  };

  return {
    dialogState,
    isProcessing,
    imageToEdit,
    currentPreviewImage,
    defaultProfileImage,
    preview,
    handleFileSelect,
    handleCropComplete,
    handleDelete,
    handleClear,
  };
};
