'use client';

import HiddenFileInput from '@/components/elements/form/input/HiddenFileInput';
import { ImagePreview } from '@/components/elements/image/ImagePreview';
import ImageUploadArea from '@/components/elements/image/ImageUploadArea';
import LoadingElements from '@/components/elements/loading/LoadingElements';
import { useImageField } from '@/features/fashion-items/hooks/useImageField';
import type { ImageFieldProps } from '@/types';

const ImageField = ({ preview, isProcessing, error }: ImageFieldProps) => {
  const { fileInputRef, handleFileSelect, handleChangeClick } = useImageField();
  return (
    <div className="space-y-2">
      <HiddenFileInput onChange={handleFileSelect} ref={fileInputRef} />
      <div className="space-y-4">
        {isProcessing ? (
          <LoadingElements message="画像処理中..." containerClassName="md:py-20" />
        ) : preview ? (
          <ImagePreview src={preview} onChangeClick={handleChangeClick} />
        ) : (
          <ImageUploadArea />
        )}
      </div>

      {error && <p className="text-sm text-destructive mt-2">{error}</p>}
    </div>
  );
};

export default ImageField;
