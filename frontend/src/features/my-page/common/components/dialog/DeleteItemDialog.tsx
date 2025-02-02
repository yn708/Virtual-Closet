import IconButton from '@/components/elements/button/IconButton';
import BaseDialog from '@/components/elements/dialog/BaseDialog';
import { Button } from '@/components/ui/button';
import { DialogClose, DialogFooter } from '@/components/ui/dialog';
import { useIsOpen } from '@/hooks/utils/useIsOpen';
import { Trash } from 'lucide-react';

const DeleteItemDialog = ({ onDelete }: { onDelete: () => void }) => {
  const { isOpen, onClose, onToggle } = useIsOpen();
  const handleSuccess = () => {
    onDelete();
    onClose();
  };
  return (
    <BaseDialog
      isOpen={isOpen}
      onToggle={onToggle}
      trigger={
        <IconButton
          Icon={Trash}
          label="削除"
          size="sm"
          variant="destructive"
          type="button"
          className="w-full dark:bg-red-700"
        />
      }
      title="アイテムの削除"
      description="このアイテムを削除してもよろしいですか？この操作は取り消せません。"
    >
      <DialogFooter>
        <div className="flex items-start justify-center gap-4">
          <DialogClose>
            <Button>キャンセル</Button>
          </DialogClose>
          <Button onClick={handleSuccess} className="bg-red-600 hover:bg-red-700">
            削除
          </Button>
        </div>
      </DialogFooter>
    </BaseDialog>
  );
};
export default DeleteItemDialog;
