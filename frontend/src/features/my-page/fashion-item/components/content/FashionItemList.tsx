import LoadingElements from '@/components/elements/loading/LoadingElements';
import { BACKEND_URL } from '@/utils/constants';
import type { FashionItemListProps } from '../../types';
import ItemImageDrawer from '../drawer/ItemImageDrawer';
import EmptyState from './EmptyState';
import ItemImage from './ItemImage';

const FashionItemList = ({
  items,
  isLoading,
  onDelete,
  onUpdate,
  onSelectItem,
  selectedItems,
}: FashionItemListProps) => {
  return isLoading ? (
    <div className="min-h-[50vh] flex items-center justify-center p-4">
      <LoadingElements message="アイテムを取得中..." />
    </div>
  ) : !items?.length ? (
    <EmptyState />
  ) : (
    <div className="p-2 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 md:gap-4 max-w-screen-2xl mx-auto">
      {items.map((item) => {
        const handleSelect = () => {
          if (onSelectItem) {
            onSelectItem(item);
          }
        };
        const imageUrl = `${BACKEND_URL}${item.image.replace('http://backend:8000', '')}`;
        const isSelected = selectedItems?.some((selectedItem) => selectedItem.id === item.id);

        return (
          <>
            {onSelectItem ? (
              <div
                className={`relative group w-full transition-all duration-300 cursor-pointer
                ${
                  isSelected
                    ? 'bg-blue-50 dark:bg-blue-900/30 ring-2 ring-blue-500 rounded-lg shadow-lg'
                    : 'bg-white dark:bg-gray-900'
                }`}
                onClick={handleSelect}
              >
                {/* ブランド名 */}
                {item.brand && (
                  <div className="absolute -left-2 top-0 h-[calc(100%-2rem)] overflow-hidden z-10">
                    <span
                      className={`block rotate-90 origin-top-left translate-y-3 translate-x-4 
                      text-[8px] lg:text-[10px] font-bold w-full truncate px-2
                      ${
                        isSelected
                          ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30'
                          : 'text-gray-400 bg-white dark:bg-gray-900'
                      }`}
                    >
                      {item.brand.brand_name}
                    </span>
                  </div>
                )}
                {/* 画像エリア */}
                <div className="p-2 border-b border-l border-gray-400">
                  <div className="relative">
                    <div className="absolute inset-0 z-10" /> {/* ドラッグ防止のオーバーレイ */}
                    <ItemImage src={imageUrl} />
                  </div>
                </div>
                {/* サブカテゴリー */}
                <div
                  className={`absolute left-3 -bottom-2 px-2 text-[8px] lg:text-[10px] 
                  max-w-[calc(100%-2rem)] z-10 truncate
                  ${
                    isSelected
                      ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30'
                      : 'text-gray-400 bg-inherit'
                  }`}
                >
                  {item.sub_category.subcategory_name}
                </div>
                {/* 選択状態のインジケーター */}
                {isSelected && (
                  <div
                    className="absolute -top-2 -right-2 size-4 bg-blue-500 rounded-full flex 
                    items-center justify-center shadow-md"
                  >
                    <svg
                      className="size-3 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                )}
              </div>
            ) : (
              <ItemImageDrawer key={item.id} item={item} onDelete={onDelete} onUpdate={onUpdate} />
            )}
          </>
        );
      })}
    </div>
  );
};

export default FashionItemList;
