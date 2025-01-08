import IconButton from '@/components/elements/button/IconButton';
import BaseDialog from '@/components/elements/dialog/BaseDialog';
import { Button } from '@/components/ui/button';
import { DialogClose, DialogFooter } from '@/components/ui/dialog';
import { useCoordinateCanvasState } from '@/context/CoordinateCanvasContext';
import { GrPowerReset } from 'react-icons/gr';

const ResetDialog = () => {
  const { handlers } = useCoordinateCanvasState();

  return (
    <BaseDialog
      trigger={
        <IconButton
          Icon={GrPowerReset}
          label="クリア"
          size="md"
          variant="ghost"
          className="flex-col h-auto gap-1"
          labelClassName="opacity-60"
        />
      }
      title="コーディネートをリセット"
      description="選択した全てのアイテムが削除されます。よろしいですか？"
    >
      <DialogFooter className="gap-2">
        <DialogClose>
          <Button variant="outline">キャンセル</Button>
        </DialogClose>
        <DialogClose>
          <Button variant="destructive" onClick={handlers.handleFullReset}>
            リセット
          </Button>
        </DialogClose>
      </DialogFooter>
    </BaseDialog>
  );
};

export default ResetDialog;
