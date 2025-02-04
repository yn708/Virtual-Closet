'use client';
import { useImage } from '@/context/ImageContext';
import { useImageSelection } from '@/hooks/image/useImageSelection';
import { useToast } from '@/hooks/use-toast';
import { useIsOpen } from '@/hooks/utils/useIsOpen';
import { ERROR_DESCRIPTION_MESSAGE, ERROR_MESSAGE } from '@/utils/constants';
import { createImagePreview } from '@/utils/imageUtils';
import { useEffect, useRef, useState } from 'react';

export const useImageField = () => {
  const [normalImage, setNormalImage] = useState<File | null>(null);
  const [removedBgImage, setRemovedBgImage] = useState<File | null>(null);
  const [isShowingRemovedBg, setIsShowingRemovedBg] = useState(false);
  const [imageToEdit, setImageToEdit] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { image, minimumImageSet, optimizationProcess, removeBgProcess } = useImage();
  const { isOpen, onClose, onToggle } = useIsOpen();
  const { handleFileChange } = useImageSelection();
  const { toast } = useToast();

  useEffect(() => {
    if (!image) return;
    const isRemovedBgImage = image.name.includes('_removed_bg');
    if (isRemovedBgImage) {
      setRemovedBgImage(image);
      // 通常画像が設定されていない場合のみ、nullに設定
      if (!normalImage) {
        setNormalImage(null);
      }
    } else {
      setNormalImage(image);
      // 背景除去画像が設定されていない場合のみ、nullに設定
      if (!removedBgImage) {
        setRemovedBgImage(null);
      }
    }
  }, [image, normalImage, removedBgImage]);

  useEffect(() => {
    if (!fileInputRef.current || !image) return;

    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(image);
    fileInputRef.current.files = dataTransfer.files;
  }, [image]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const result = await handleFileChange(e);
    if (result.file) {
      const optimizedImage = await optimizationProcess(result.file);
      if (optimizedImage) {
        setNormalImage(optimizedImage);
        setRemovedBgImage(null);
        setIsShowingRemovedBg(false);
        await minimumImageSet(optimizedImage);
      }
    }
  };

  const handleChangeClick = () => {
    fileInputRef.current?.click();
  };

  const handleToggleImage = async () => {
    if (!normalImage) return;

    // まだ背景除去画像が生成されていない場合
    if (!removedBgImage) {
      const result = await removeBgProcess(normalImage);
      if (result instanceof File) {
        setIsShowingRemovedBg(true);
      } else {
        toast({
          variant: 'destructive',
          title: '背景除去機能に' + ERROR_MESSAGE,
          description: ERROR_DESCRIPTION_MESSAGE,
        });
        return false;
      }
      return;
    }

    // 背景除去画像と通常画像の切り替え
    if (isShowingRemovedBg) {
      await minimumImageSet(normalImage);
      setIsShowingRemovedBg(false);
    } else {
      await minimumImageSet(removedBgImage);
      setIsShowingRemovedBg(true);
    }
  };

  const handleCropOpen = async () => {
    const previewUrl = await createImagePreview(image as File);
    setImageToEdit(previewUrl);
    onToggle();
  };

  const handleCropComplete = async (croppedFile: File) => {
    minimumImageSet(croppedFile);
    onClose();
    setImageToEdit(null);
  };

  const handleCropClose = async () => {
    onClose();
    setImageToEdit(null);
  };

  // state, handlersにまとめる
  const state = {
    fileInputRef,
    isShowingRemovedBg,
    isOpen,
    imageToEdit,
  };

  const handlers = {
    handleFileSelect,
    handleChangeClick,
    handleToggleImage,
    handleCropComplete,
    handleCropClose,
    onToggle,
    handleCropOpen,
  };

  return {
    state,
    handlers,
  };
};
