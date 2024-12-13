import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import type { DeleteItemDialogProps } from '../../types';

const DeleteItemDialog = ({ children, onDelete }: DeleteItemDialogProps) => (
  <Dialog>
    <DialogTrigger asChild>{children}</DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>アイテムの削除</DialogTitle>
        <DialogDescription>
          このアイテムを削除してもよろしいですか？この操作は取り消せません。
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <DialogClose>
          <Button>キャンセル</Button>
        </DialogClose>
        <Button onClick={onDelete} className="bg-red-600 hover:bg-red-700">
          削除
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);
export default DeleteItemDialog;
