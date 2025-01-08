import IconButton from '@/components/elements/button/IconButton';
import LoadingElements from '@/components/elements/loading/LoadingElements';

import BaseDialog from '@/components/elements/dialog/BaseDialog';
import type { InitialItemsProps } from '@/features/my-page/coordinate/types';
import type { CoordinateMetaDataType } from '@/types/coordinate';
import { IoIosArrowForward } from 'react-icons/io';
import type { CoordinateEditTypes } from '../../types';
import CustomCoordinateEditorForm from '../form/CustomCoordinateEditorForm';
import { useCoordinateCanvasState } from '@/context/CoordinateCanvasContext';

interface FormDialogProps extends InitialItemsProps, CoordinateEditTypes {
  metaData: CoordinateMetaDataType | null;
  isLoading: boolean;
}

const FormDialog: React.FC<FormDialogProps> = ({
  metaData,
  isLoading,
  initialData,
  initialItems,
  onSuccess,
}) => {
  const { state } = useCoordinateCanvasState();

  return (
    <BaseDialog
      trigger={
        <IconButton
          Icon={IoIosArrowForward}
          label="次へ"
          size="sm"
          rounded={true}
          variant="default"
          className="text-xs md:text-sm !gap-1 flex-row-reverse py-2 px-4"
          type="button"
        />
      }
      title="詳細情報"
      className="max-h-screen h-screen max-w-full rounded-none p-10"
    >
      {state.selectedItems && metaData !== null ? (
        <div className="max-w-4xl mx-auto w-full">
          <CustomCoordinateEditorForm
            metaData={metaData}
            initialData={initialData}
            initialItems={initialItems}
            onSuccess={onSuccess}
          />
        </div>
      ) : (
        isLoading && <LoadingElements message="データ取得中..." />
      )}
    </BaseDialog>
  );
};

export default FormDialog;
