import { useImage } from '@/context/ImageContext';
import { useImageSelection } from '@/hooks/image/useImageSelection';
import { useEffect, useRef } from 'react';

export const useImageField = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { handleFileChange } = useImageSelection();
  const { image, removeBgProcess } = useImage();

  useEffect(() => {
    if (!fileInputRef.current || !image) return;

    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(image);
    fileInputRef.current.files = dataTransfer.files;
  }, [image]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const result = await handleFileChange(e);
    if (result.file) {
      removeBgProcess(result.file);
    }
  };

  const handleChangeClick = () => {
    fileInputRef.current?.click();
  };

  return {
    fileInputRef,
    handleFileSelect,
    handleChangeClick,
  };
};
