'use client';

import IconButton from '@/components/elements/button/IconButton';
import HiddenFileInput from '@/components/elements/form/HiddenFileInput';
import { useImage } from '@/context/ImageContext';
import type { ImageUploadSectionProps } from '@/features/navItems/types';
import { useImageSelection } from '@/hooks/image/useImageSelection';
import { useRouter } from 'next/navigation';
import { AiOutlinePicture } from 'react-icons/ai';
import { AccordionSection } from './AccordionSection';

export const ImageUploadSection: React.FC<ImageUploadSectionProps> = ({
  value,
  label,
  Icon,
  redirectUrl,
  onClose,
  children,
}) => {
  const { image, setImage, clearImage } = useImage();
  const router = useRouter();
  const { fileInputRef, handleFileInput, handleFileChange, isLoading } = useImageSelection();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const result = await handleFileChange(e);
    if (result.file) {
      if (image) {
        clearImage();
      }

      setImage(result.file);
      router.push(redirectUrl);
      onClose();
    }
  };

  return (
    <AccordionSection value={value} Icon={Icon} label={label}>
      <HiddenFileInput ref={fileInputRef} onChange={handleFileSelect} />
      <IconButton
        Icon={AiOutlinePicture}
        size="sm"
        label={`${isLoading ? '処理中' : 'カメラロールから選択'}`}
        onClick={handleFileInput}
        disabled={isLoading}
        rounded={true}
      />
      {children}
    </AccordionSection>
  );
};
