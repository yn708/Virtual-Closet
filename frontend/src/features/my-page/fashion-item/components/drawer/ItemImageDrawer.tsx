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
import { useIsOpen } from '@/hooks/utils/useIsOpen';
import type { FashionItem } from '@/types';
import { BACKEND_URL } from '@/utils/constants';
import type { ItemImageProps } from '../../types';
import ItemActions from '../content/ItemActions';
import ItemDetailInfo from '../content/ItemDetailInfo';
import ItemImage from '../content/ItemImage';

const ItemImageDrawer = ({ item, onDelete, onUpdate }: ItemImageProps) => {
  const imageUrl = `${BACKEND_URL}${item.image.replace('http://backend:8000', '')}`;
  const { isOpen, onClose, onToggle } = useIsOpen();

  const handleUpdate = (updatedItem: FashionItem) => {
    onUpdate(updatedItem);
    onClose();
  };

  return (
    <Drawer open={isOpen} onOpenChange={onToggle}>
      <DrawerTrigger>
        <div className="relative group w-full bg-white dark:bg-gray-900 transition-all duration-300">
          {/* ブランド名 */}
          {item.brand && (
            <div className="absolute -left-2 top-0 h-[calc(100%-2rem)] overflow-hidden z-10">
              <span className="block rotate-90 origin-top-left translate-y-3 translate-x-4 text-[8px] lg:text-[10px] text-gray-400 font-bold w-full truncate bg-white dark:bg-gray-900 px-2">
                {item.brand.brand_name}
              </span>
            </div>
          )}
          {/* 画像エリア */}
          <div className="px-4 border-b border-l border-gray-400">
            <ItemImage src={imageUrl} />
          </div>
          {/* サブカテゴリー */}
          <div className="absolute left-3 -bottom-2 px-2 bg-inherit text-[8px] lg:text-[10px] max-w-[calc(100%-2rem)] text-gray-400 z-10 truncate">
            {item.sub_category.subcategory_name}
          </div>
        </div>
      </DrawerTrigger>
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
              <ItemDetailInfo item={item} />
            </div>
          </div>
          <DrawerFooter className="p-0 mt-4">
            <ItemActions item={item} onDelete={onDelete} onUpdate={handleUpdate} />
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

export default ItemImageDrawer;
