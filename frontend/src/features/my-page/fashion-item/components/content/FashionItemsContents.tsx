'use client';

import ItemCounter from '@/components/elements/utils/ItemCounter';
import { useFashionItems } from '@/context/FashionItemsContext';
import type { OnSelectItemType, SelectedItemsType } from '@/features/coordinate/types';
import CategorySelector from '@/features/my-page/common/components/contents/CategorySelector';
import BaseContentsLayout from '@/features/my-page/common/components/layout/BaseScrollContentsLayout';
import { fashionItemConfig } from '@/features/my-page/common/config/filterConfigs';
import type { FashionItemFilters } from '../../types';
import FashionItemList from './FashionItemList';
import HorizontalCategoryScroll from './HorizontalCategoryScroll';

const FashionItemsContents: React.FC<OnSelectItemType & SelectedItemsType> = ({
  onSelectItem,
  selectedItems,
}) => {
  const { state, handlers } = useFashionItems();
  const { selectedCategory, filters } = state;
  const { handleCategoryChange, handleFilterChange } = handlers;

  return (
    <BaseContentsLayout selectedCategory={selectedCategory}>
      {state.countData && state.countData.current_count > 0 && (
        <ItemCounter countData={state.countData} />
      )}
      <CategorySelector<FashionItemFilters>
        onCategoryChange={handleCategoryChange}
        onFilterChange={handleFilterChange}
        selectedCategory={selectedCategory}
        filters={filters}
        config={fashionItemConfig}
      />

      {selectedCategory && (
        <>
          <HorizontalCategoryScroll
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
          />

          <FashionItemList
            selection={
              onSelectItem
                ? {
                    onSelectItem,
                    selectedItems: selectedItems ?? [],
                  }
                : undefined
            }
          />
        </>
      )}
    </BaseContentsLayout>
  );
};

export default FashionItemsContents;
