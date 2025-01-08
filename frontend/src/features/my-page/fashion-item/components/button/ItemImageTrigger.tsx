import ItemImage from '@/features/my-page/common/components/image/ItemImage';

interface ItemImageTriggerProps {
  imageUrl: string;
  brand: { id: string; brand_name: string; brand_name_kana: string } | null;
  subCategoryName: string;
}

const ItemImageTrigger = ({ imageUrl, brand, subCategoryName }: ItemImageTriggerProps) => (
  <div className="relative group w-full bg-white dark:bg-gray-900 transition-all duration-300">
    {brand && (
      <div className="absolute -left-2 top-0 h-[calc(100%-2rem)] overflow-hidden z-10">
        <span className="block rotate-90 origin-top-left translate-y-3 translate-x-4 text-[8px] lg:text-[10px] text-gray-400 font-bold w-full truncate bg-white dark:bg-gray-900 px-2">
          {brand.brand_name}
        </span>
      </div>
    )}
    <div className="px-4 border-b border-l border-gray-400">
      <ItemImage src={imageUrl} />
    </div>
    <div className="absolute left-3 -bottom-2 px-2 bg-inherit text-[8px] lg:text-[10px] max-w-[calc(100%-2rem)] text-gray-400 z-10 truncate">
      {subCategoryName}
    </div>
  </div>
);

export default ItemImageTrigger;
