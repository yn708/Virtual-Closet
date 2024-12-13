import ImageField from '@/components/elements/image/ImageField';
import type { ImagePreviewSectionProps } from '@/features/fashion-items/types';

const ImageFormField = ({ isProcessing, preview, error }: ImagePreviewSectionProps) => {
  return (
    <div className="col-span-2 p-4">
      <ImageField isProcessing={isProcessing} preview={preview} error={error} />
    </div>
  );
};
export default ImageFormField;
