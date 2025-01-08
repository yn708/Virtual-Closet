import { useFashionItems } from '@/context/FashionItemsContext';
import BaseImageDrawer from '@/features/my-page/common/components/drawer/BaseImageDrawer';
import BaseListLayout from '@/features/my-page/common/components/layout/BaseListLayout';
import type { FashionItem } from '@/types';
import ItemImageTrigger from '../button/ItemImageTrigger';
import ItemDetailInfo from './ItemDetailInfo';
import SelectableItem from './SelectableItem';

export interface FashionItemListProps {
  selection?: {
    onSelectItem: (item: FashionItem) => void;
    selectedItems: FashionItem[];
  };
}

const FashionItemList: React.FC<FashionItemListProps> = ({ selection }) => {
  const { state, handlers } = useFashionItems();
  const { isPending, currentItems } = state;
  const { handleDelete, handleUpdate } = handlers;

  return (
    <div
      className={`transition-opacity duration-300 ease-in-out ${isPending ? 'opacity-50' : 'opacity-100'}`}
    >
      <BaseListLayout
        items={currentItems}
        isLoading={isPending}
        renderItem={(item) => {
          if (selection) {
            const { onSelectItem, selectedItems } = selection;
            const isSelected = selectedItems?.some(
              (selectedItem) => String(selectedItem.id) === String(item.id),
            );
            const handleSelect = () => {
              onSelectItem(item);
            };
            return (
              <SelectableItem item={item} onSelectItem={handleSelect} isSelected={isSelected} />
            );
          }

          return (
            <BaseImageDrawer<FashionItem>
              type="fashion-item"
              item={item}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
              DetailInfoComponent={ItemDetailInfo}
              renderTrigger={(imageUrl) => (
                <ItemImageTrigger
                  imageUrl={imageUrl}
                  brand={item.brand}
                  subCategoryName={item.sub_category.subcategory_name}
                />
              )}
            />
          );
        }}
      />
    </div>
  );
};
export default FashionItemList;
