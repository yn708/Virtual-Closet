import { useImage } from '@/context/ImageContext';
import { Crop, Paperclip } from 'lucide-react';
import IconButton from '../button/IconButton';
import RemoveBgHintDialog from '../dialog/RemoveBgHintDialog';
import ToggleSwitch from '../utils/ToggleSwitch';

interface ImageActionsProps {
  isProcessing?: boolean;
  isShowingRemovedBg: boolean;
  onChangeClick: () => void;
  onToggleImage: () => void;
  onOpenCrop: () => void;
}

const ImageActions = ({
  isProcessing,
  isShowingRemovedBg,
  onChangeClick,
  onToggleImage,
  onOpenCrop,
}: ImageActionsProps) => {
  const { preview } = useImage();

  return (
    <div className="flex flex-col justify-between items-start gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <IconButton
          type="button"
          label="画像変更"
          variant="outline"
          size="sm"
          Icon={Paperclip}
          onClick={onChangeClick}
          disabled={isProcessing}
        />
        {!isShowingRemovedBg && !!preview && (
          <IconButton
            type="button"
            label="切り抜き"
            variant="outline"
            size="sm"
            Icon={Crop}
            onClick={onOpenCrop}
            disabled={isProcessing}
          />
        )}
      </div>
      {!!preview && (
        <div className="flex flex-col items-start gap-2 w-full">
          <ToggleSwitch
            checked={isShowingRemovedBg}
            onChange={onToggleImage}
            label="背景除去"
            disabled={isProcessing}
          />
          {/* 背景除去ヒント */}
          <RemoveBgHintDialog />
        </div>
      )}
    </div>
  );
};

export default ImageActions;
