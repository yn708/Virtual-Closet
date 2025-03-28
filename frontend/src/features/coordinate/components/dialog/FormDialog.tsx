import IconButton from '@/components/elements/button/IconButton';
import LoadingElements from '@/components/elements/loading/LoadingElements';

import BaseDialog from '@/components/elements/dialog/BaseDialog';
import { Button } from '@/components/ui/button';
import { DialogClose } from '@/components/ui/dialog';
import { useCoordinateCanvasState } from '@/context/CoordinateCanvasContext';
import type { InitialItemsProps } from '@/features/my-page/coordinate/types';
import type { CoordinateMetaDataType } from '@/types/coordinate';
import { ChevronRight } from 'lucide-react';
import type { CoordinateEditTypes } from '../../types';
import CustomCoordinateEditorForm from '../form/CustomCoordinateEditorForm';

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
          Icon={ChevronRight}
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
          <DialogClose className="mt-5">
            <Button type="button" variant="link">
              戻る
            </Button>
          </DialogClose>
        </div>
      ) : (
        isLoading && <LoadingElements message="データ取得中..." />
      )}
    </BaseDialog>
  );
};

export default FormDialog;
