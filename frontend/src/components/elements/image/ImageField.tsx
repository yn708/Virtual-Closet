'use client';

import HiddenFileInput from '@/components/elements/form/input/HiddenFileInput';
import { ImagePreview } from '@/components/elements/image/ImagePreview';
import ImageUploadArea from '@/components/elements/image/ImageUploadArea';
import LoadingElements from '@/components/elements/loading/LoadingElements';
import { useImageField } from '@/features/fashion-items/hooks/useImageField';
import type { ImageFieldProps } from '@/types';
import ImageCropDialog from '../dialog/ImageCropDialog';
import ImageActions from './ImageActions';

const ImageField = ({ preview, isProcessing, error }: ImageFieldProps) => {
  const { state, handlers } = useImageField();
  const { fileInputRef, isShowingRemovedBg, isOpen, imageToEdit } = state;
  const {
    handleFileSelect,
    handleChangeClick,
    handleToggleImage,
    handleCropComplete,
    handleCropClose,
    onToggle,
    handleCropOpen,
  } = handlers;

  return (
    <div className="space-y-4">
      <HiddenFileInput onChange={handleFileSelect} ref={fileInputRef} />
      {!preview && !isProcessing ? (
        <ImageUploadArea />
      ) : (
        <div className="space-y-4">
          <div className="relative max-w-2xl mx-auto h-40 sm:h-64 md:h-96 rounded-lg overflow-hidden">
            {isProcessing ? (
              <div className="absolute inset-0 flex items-center justify-center backdrop-blur-sm">
                <LoadingElements
                  message={
                    <>
                      画像処理中... <br />
                      HEIC形式、サイズの大きい画像の場合 <br />
                      少し時間がかかります。
                    </>
                  }
                />
              </div>
            ) : (
              preview && (
                <ImagePreview
                  src={preview || '/placeholder.svg'}
                  isShowingRemovedBg={isShowingRemovedBg}
                />
              )
            )}
          </div>
          <ImageActions
            isProcessing={isProcessing}
            isShowingRemovedBg={isShowingRemovedBg}
            onChangeClick={handleChangeClick}
            onToggleImage={handleToggleImage}
            onOpenCrop={handleCropOpen}
          />
        </div>
      )}

      {imageToEdit && (
        <ImageCropDialog
          open={isOpen}
          onToggle={onToggle}
          onClose={handleCropClose}
          image={imageToEdit}
          onCropComplete={handleCropComplete}
        />
      )}

      {error && <p className="text-sm text-destructive mt-2">{error[0]}</p>}
    </div>
  );
};

export default ImageField;
