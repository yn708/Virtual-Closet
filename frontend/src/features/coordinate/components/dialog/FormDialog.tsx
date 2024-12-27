import IconButton from '@/components/elements/button/IconButton';
import LoadingElements from '@/components/elements/loading/LoadingElements';

import BaseDialog from '@/components/elements/dialog/BaseDialog';
import { IoIosArrowForward } from 'react-icons/io';
import type { FormDialogProps } from '../../types';
import CustomCoordinateEditorForm from '../form/CustomCoordinateEditorForm';

const FormDialog: React.FC<FormDialogProps> = ({
  metaData,
  selectedItems,
  itemStyles,
  isLoading,
}) => {
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
      {metaData !== null ? (
        <div className="max-w-4xl mx-auto w-full">
          <CustomCoordinateEditorForm
            metaData={metaData}
            selectedItems={selectedItems}
            itemStyles={itemStyles}
          />
        </div>
      ) : (
        isLoading && <LoadingElements message="データ取得中..." />
      )}
    </BaseDialog>
  );
};

export default FormDialog;
