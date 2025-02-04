import { useImage } from '@/context/ImageContext';
import { IMAGE_URL } from '@/utils/constants';
import { useEffect, useRef, useState } from 'react';
import type { UseProfileImageProps } from '../types';

export const useProfileImage = ({ profileImage, onDelete }: UseProfileImageProps) => {
  // 画像処理の状態管理
  const [defaultProfileImage, setDefaultProfileImage] = useState(profileImage);
  const { preview, clearImage } = useImage();

  const isInitialized = useRef(false);

  // 初回マウント時のみclearImageを実行（previewに違う画像が表示されるのを防ぐため）
  useEffect(() => {
    if (!isInitialized.current) {
      clearImage();
      isInitialized.current = true;
    }
    // eslint警告無視（初回マウント時のみclearImageを実行したいだけのため）
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 画像のプレビューURL生成
  const currentPreviewImage =
    preview || (defaultProfileImage ? `${IMAGE_URL}${defaultProfileImage}` : '');

  const updateFileInput = (file?: File) => {
    const fileInput = document.querySelector('input[name="profile_image"]') as HTMLInputElement;
    if (!fileInput) return;

    const dataTransfer = new DataTransfer();
    if (file) {
      dataTransfer.items.add(file);
    }
    fileInput.files = dataTransfer.files;
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
    currentPreviewImage,
    defaultProfileImage,
    preview,
    updateFileInput,
    handleDelete,
    handleClear,
  };
};
