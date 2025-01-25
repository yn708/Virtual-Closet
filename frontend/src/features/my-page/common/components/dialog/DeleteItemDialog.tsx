import IconButton from '@/components/elements/button/IconButton';
import BaseDialog from '@/components/elements/dialog/BaseDialog';
import { Button } from '@/components/ui/button';
import { DialogClose, DialogFooter } from '@/components/ui/dialog';
import { Trash } from 'lucide-react';

const DeleteItemDialog = ({ onDelete }: { onDelete: () => void }) => (
  <BaseDialog
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
      <DialogClose>
        <Button>キャンセル</Button>
      </DialogClose>
      <Button onClick={onDelete} className="bg-red-600 hover:bg-red-700">
        削除
      </Button>
    </DialogFooter>
  </BaseDialog>
);
export default DeleteItemDialog;
