'use client';

import IconButton from '@/components/elements/button/IconButton';
import HiddenFileInput from '@/components/elements/form/input/HiddenFileInput';
import { useImage } from '@/context/ImageContext';
import type { ImageUploadSectionProps } from '@/features/navItems/types';
import { useImageSelection } from '@/hooks/image/useImageSelection';
import { useRouter } from 'next/navigation';
import { AiOutlinePicture } from 'react-icons/ai';
import AccordionSection from './AccordionSection';

const ImageUploadSection: React.FC<ImageUploadSectionProps> = ({
  value,
  label,
  Icon,
  redirectUrl,
  onClose,
  children,
}) => {
  const { removeBgProcess } = useImage();
  const router = useRouter();
  const { openFileDialog, handleFileChange, isLoading } = useImageSelection();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const result = await handleFileChange(e);
    if (result.file) {
      removeBgProcess(result.file);
      router.push(redirectUrl);
      onClose();
    }
  };

  return (
    <AccordionSection value={value} Icon={Icon} label={label}>
      <HiddenFileInput onChange={handleFileSelect} />
      <IconButton
        type="button"
        Icon={AiOutlinePicture}
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
