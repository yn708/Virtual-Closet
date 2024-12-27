'use client';

import HiddenFileInput from '@/components/elements/form/input/HiddenFileInput';
import { ImagePreview } from '@/components/elements/image/ImagePreview';
import ImageUploadArea from '@/components/elements/image/ImageUploadArea';
import LoadingElements from '@/components/elements/loading/LoadingElements';
import { useImageField } from '@/features/fashion-items/hooks/useImageField';
import type { ImageFieldProps } from '@/types';
import ImageActions from './ImageActions';

const ImageField = ({ preview, isProcessing, error }: ImageFieldProps) => {
  const {
    fileInputRef,
    handleFileSelect,
    handleChangeClick,
    handleToggleImage,
    isShowingRemovedBg,
  } = useImageField();

  return (
    <div className="space-y-2">
      <HiddenFileInput onChange={handleFileSelect} ref={fileInputRef} />
      <div className="space-y-4">
        {!preview && !isProcessing ? (
          <ImageUploadArea />
        ) : (
          <div>
            <div className="relative group max-w-2xl mx-auto h-40 md:h-96 bg-gray-50 rounded-lg overflow-hidden">
              {isProcessing ? (
                <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm">
                  <LoadingElements message="画像処理中..." />
                </div>
              ) : (
                preview && <ImagePreview src={preview} isShowingRemovedBg={isShowingRemovedBg} />
              )}
            </div>
            <ImageActions
              isProcessing={isProcessing}
              isShowingRemovedBg={isShowingRemovedBg}
              onChangeClick={handleChangeClick}
              onToggleImage={handleToggleImage}
            />
          </div>
        )}
      </div>

      {error && <p className="text-sm text-destructive mt-2">{error}</p>}
    </div>
  );
};

export default ImageField;
