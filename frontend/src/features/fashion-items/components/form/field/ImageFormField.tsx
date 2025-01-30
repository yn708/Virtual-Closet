import ImageField from '@/components/elements/image/ImageField';
import type { ImageFieldProps } from '@/types';

const ImageFormField = ({ isProcessing, preview, error }: ImageFieldProps) => {
  return (
    <div className="col-span-2 p-4">
      <ImageField isProcessing={isProcessing} preview={preview} error={error} />
    </div>
  );
};
export default ImageFormField;
