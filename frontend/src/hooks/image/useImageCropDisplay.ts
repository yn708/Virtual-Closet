import { useImage } from '@/context/ImageContext';
import { useState } from 'react';
import { useIsOpen } from '../utils/useIsOpen';
import { useImageSelection } from './useImageSelection';

export const useImageCropDisplay = () => {
  const { isOpen, onClose, onToggle } = useIsOpen();
  const { handleFileChange } = useImageSelection();
  const { minimumImageSet, compressImageProcess, createImageUrl } = useImage();

  const [imageToEdit, setImageToEdit] = useState<string | null>(null);
  const [processLoading, setProcessLoading] = useState<boolean>(false);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const result = await handleFileChange(e);
    if (result.file) {
      onToggle();
      setProcessLoading(true);
      const previewUrl = await createImageUrl(result.file); // HEIC変換と加工用Url作成
      setImageToEdit(previewUrl);
      setProcessLoading(false);
    }
  };

  const handleCropComplete = async (croppedFile: File, callback?: (file: File) => void) => {
    setProcessLoading(true);
    const compressedFile = await compressImageProcess(croppedFile); // 圧縮処理
    if (compressedFile) {
      minimumImageSet(compressedFile);
      // 他に処理がある場合に実行
      if (callback) {
        callback(compressedFile);
      }
    }
    setProcessLoading(false);

    onClose();
  };

  const handleCropClose = async () => {
    onClose();
    setImageToEdit(null);
  };

  return {
    isOpen,
    imageToEdit,
    processLoading,
    onToggle,
    handleFileSelect,
    handleCropComplete,
    handleCropClose,
  };
};
