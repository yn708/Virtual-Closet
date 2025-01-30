import { useImage } from '@/context/ImageContext';
import { Paperclip } from 'lucide-react';
import IconButton from '../button/IconButton';
import ToggleSwitch from '../utils/ToggleSwitch';

interface ImageActionsProps {
  isProcessing?: boolean;
  isShowingRemovedBg: boolean;
  onChangeClick: () => void;
  onToggleImage: () => void;
}

const ImageActions = ({
  isProcessing,
  isShowingRemovedBg,
  onChangeClick,
  onToggleImage,
}: ImageActionsProps) => {
  const { preview } = useImage();

  return (
    <div className="mt-6 flex flex-wrap justify-between items-center">
      <IconButton
        type="button"
        label="画像変更"
        variant="outline"
        size="sm"
        Icon={Paperclip}
        onClick={onChangeClick}
        disabled={isProcessing}
      />
      {!!preview && (
        <ToggleSwitch
          checked={isShowingRemovedBg}
          onChange={onToggleImage}
          label="背景除去"
          disabled={isProcessing}
        />
      )}
    </div>
  );
};

export default ImageActions;
