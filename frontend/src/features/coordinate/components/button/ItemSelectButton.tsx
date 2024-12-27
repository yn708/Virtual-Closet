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
import ItemDetailInfo from '@/features/my-page/fashion-item/components/content/ItemDetailInfo';

import ItemImage from '@/features/my-page/fashion-item/components/content/ItemImage';
import type { FashionItem } from '@/types';
import { BACKEND_URL } from '@/utils/constants';

export interface ItemSelectButtonProps {
  item: FashionItem;
}

const ItemSelectButton = ({ item }: ItemSelectButtonProps) => {
  const imageUrl = `${BACKEND_URL}${item.image.replace('http://backend:8000', '')}`;

  return (
    <Dialog>
      <DialogTrigger asChild>
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
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl mb-4">アイテム詳細</DialogTitle>
          <DialogDescription />
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
          <div className="w-full max-h-[30vh] md:max-h-[60vh] overflow-hidden">
            <ItemImage src={imageUrl} />
          </div>
          <div className="w-full">
            <ItemDetailInfo item={item} />
          </div>
        </div>
        <DialogFooter>
          <DialogClose>
            <Button variant="outline" className="w-full">
              追加
            </Button>
          </DialogClose>
        </DialogFooter>
        <DialogClose>
          <Button variant="outline" className="w-full">
            閉じる
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};

export default ItemSelectButton;
