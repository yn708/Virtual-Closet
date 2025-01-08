import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import EditItemDialog from '@/features/my-page/common/components/dialog/EditItemDialog';
import { useIsOpen } from '@/hooks/utils/useIsOpen';
import type { FashionItem } from '@/types';
import type { BaseCoordinate } from '@/types/coordinate';
import { BACKEND_URL } from '@/utils/constants';
import type { ComponentType } from 'react';
import type { UpdateItemTypes } from '../../types';
import DeleteItemDialog from '../dialog/DeleteItemDialog';
import ItemImage from '../image/ItemImage';

interface BaseImageDrawerProps<T extends FashionItem | BaseCoordinate> extends UpdateItemTypes<T> {
  onDelete: (id: string) => void;
  selectedCategory?: string;
  renderTrigger?: (imageUrl: string) => React.ReactNode;
  DetailInfoComponent: ComponentType<{ item: T }>;
}

const BaseImageDrawer = <T extends FashionItem | BaseCoordinate>({
  item,
  type,
  onDelete,
  onUpdate,
  selectedCategory,
  renderTrigger,
  DetailInfoComponent,
}: BaseImageDrawerProps<T>) => {
  const imageUrl = `${BACKEND_URL}${item.image.replace('http://backend:8000', '')}`;
  const { isOpen, onClose, onToggle } = useIsOpen();

  const handleUpdate = (updatedItem: T) => {
    onUpdate(updatedItem);
    onClose();
  };

  const defaultTrigger = (
    <div className="relative group w-full bg-white dark:bg-gray-900 transition-all duration-300">
      <ItemImage src={imageUrl} />
    </div>
  );

  return (
    <Drawer open={isOpen} onOpenChange={onToggle}>
      <DrawerTrigger>{renderTrigger ? renderTrigger(imageUrl) : defaultTrigger}</DrawerTrigger>
      <DrawerContent className="h-[85vh] sm:h-[90vh]">
        <div className="max-w-3xl mx-auto w-full p-4 sm:p-6 overflow-y-auto">
          <DrawerHeader className="p-0">
            <DrawerTitle className="text-xl mb-4">アイテム詳細</DrawerTitle>
            <DrawerDescription />
          </DrawerHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
            <div className="w-full max-h-[30vh] md:max-h-[60vh] overflow-hidden">
              <ItemImage src={imageUrl} />
            </div>
            <div className="w-full">
              <DetailInfoComponent item={item} />
            </div>
          </div>
          <DrawerFooter className="p-0 mt-4">
            <div className="gap-2 flex items-center justify-center">
              <EditItemDialog
                type={type}
                item={item}
                onUpdate={handleUpdate}
                category={
                  type === 'coordinate' ? (selectedCategory as 'photo' | 'custom') : undefined
                }
              />
              <DeleteItemDialog onDelete={() => onDelete(item.id)} />
            </div>
            <DrawerClose asChild>
              <Button variant="link" type="button" className="w-full">
                閉じる
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default BaseImageDrawer;
