import IconButton from '@/components/elements/button/IconButton';
import { AiOutlineDelete } from 'react-icons/ai';
import { LuPencil } from 'react-icons/lu';
import type { ItemImageDrawerProps } from '../../types';
import DeleteItemDialog from '../dialog/DeleteItemDialog';
import EditItemDialog from '../dialog/EditItemDialog';

const ItemActions = ({ item, onDelete, onUpdate }: ItemImageDrawerProps) => {
  return (
    <div className="gap-2 flex items-center justify-center">
      <EditItemDialog item={item} onUpdate={onUpdate}>
        <IconButton
          Icon={LuPencil}
          label="編集"
          size="sm"
          variant="default"
          type="button"
          className="w-full bg-gray-700 dark:bg-gray-200"
        />
      </EditItemDialog>

      <DeleteItemDialog onDelete={() => onDelete(item.id)}>
        <IconButton
          Icon={AiOutlineDelete}
          label="削除"
          size="sm"
          variant="destructive"
          type="button"
          className="w-full dark:bg-red-700"
        />
      </DeleteItemDialog>
    </div>
  );
};
export default ItemActions;
