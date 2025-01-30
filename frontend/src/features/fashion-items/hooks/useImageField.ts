import { useImage } from '@/context/ImageContext';
import { useImageSelection } from '@/hooks/image/useImageSelection';
import { useEffect, useRef, useState } from 'react';

export const useImageField = () => {
  const { image, minimumImageSet, optimizationProcess, removeBgProcess } = useImage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [normalImage, setNormalImage] = useState<File | null>(null);
  const [removedBgImage, setRemovedBgImage] = useState<File | null>(null);
  const [isShowingRemovedBg, setIsShowingRemovedBg] = useState(false);

  const { handleFileChange } = useImageSelection();

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
      await removeBgProcess(normalImage);
      setIsShowingRemovedBg(true);
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

  return {
    fileInputRef,
    handleFileSelect,
    handleChangeClick,
    handleToggleImage,
    isShowingRemovedBg,
  };
};
