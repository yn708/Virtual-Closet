'use client';

import IconButton from '@/components/elements/button/IconButton';
import HiddenFileInput from '@/components/elements/form/input/HiddenFileInput';
import { useImage } from '@/context/ImageContext';
import type { ImageUploadSectionProps } from '@/features/navItems/types';
import { useImageSelection } from '@/hooks/image/useImageSelection';
import { Image } from 'lucide-react';
import { useRouter } from 'next/navigation';
import AccordionSection from './AccordionSection';

const ImageUploadSection: React.FC<ImageUploadSectionProps> = ({
  value,
  label,
  redirectUrl,
  onClose,
  children,
}) => {
  const { optimizationProcess } = useImage();
  const router = useRouter();
  const { openFileDialog, handleFileChange, isLoading } = useImageSelection();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const result = await handleFileChange(e);
    if (result.file) {
      optimizationProcess(result.file);
      router.push(redirectUrl);
      onClose();
    }
  };

  return (
    <AccordionSection value={value} label={label}>
      <HiddenFileInput onChange={handleFileSelect} />
      <IconButton
        type="button"
        Icon={Image}
        size="sm"
        label={`${isLoading ? '処理中' : 'カメラロールから選択'}`}
        onClick={openFileDialog} // IconButtonクリック時にもファイル選択ダイアログを開く
        disabled={isLoading}
        rounded={true}
      />
      {children}
    </AccordionSection>
  );
};
export default ImageUploadSection;
