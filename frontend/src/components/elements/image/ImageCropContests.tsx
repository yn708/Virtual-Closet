import { useImageCropDisplay } from '@/hooks/image/useImageCropDisplay';
import ImageCropDialog from '../dialog/ImageCropDialog';
import HiddenFileInput from '../form/input/HiddenFileInput';
import LoadingElements from '../loading/LoadingElements';

interface ImageCropContentsProps {
  name?: string;
  fileInputRef?: React.RefObject<HTMLInputElement>;
  cropShape?: 'rect' | 'round'; // 形指定
  children?: React.ReactNode;
  loadingClassName?: string;
  fullScreen?: boolean;
  cropCallback?: (file: File) => void;
}

const ImageCropContents = ({
  name,
  fileInputRef,
  cropShape = 'rect',
  children,
  loadingClassName,
  fullScreen = false,
  cropCallback,
}: ImageCropContentsProps) => {
  const {
    isOpen,
    imageToEdit,
    processLoading,
    onToggle,
    handleFileSelect,
    handleCropComplete,
    handleCropClose,
  } = useImageCropDisplay();

  const handleCropCallback = (file: File) => {
    handleCropComplete(file, cropCallback);
  };
  return (
    <div>
      <HiddenFileInput name={name} onChange={handleFileSelect} ref={fileInputRef} />
      {processLoading ? (
        <LoadingElements
          fullScreen={fullScreen}
          containerClassName={loadingClassName}
          message={
            <>
              画像処理中... <br />
              HEIC形式、サイズの大きい画像の場合 <br />
              少し時間がかかります。
            </>
          }
        />
      ) : (
        <>{children}</>
      )}
      {imageToEdit && (
        <ImageCropDialog
          open={isOpen}
          onToggle={onToggle}
          onClose={handleCropClose}
          image={imageToEdit}
          onCropComplete={handleCropCallback}
          cropShape={cropShape}
        />
      )}
    </div>
  );
};

export default ImageCropContents;
