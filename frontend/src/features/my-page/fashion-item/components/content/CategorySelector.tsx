import { FASHION_ITEMS_CATEGORY } from '@/utils/data/selectData';
import type { CategorySelectorProps } from '../../types';
import CategorySelectButton from '../button/CategorySelectButton';
import FilterSheet from '../sheet/FilterSheet';

const CategorySelector = ({
  onCategoryChange,
  onFilterChange,
  selectedCategory,
  filters,
}: CategorySelectorProps) => {
  return selectedCategory ? (
    <div className="flex items-center justify-between py-4 px-7 gap-4">
      <h2 className="text-gray-500 dark:text-gray-300 ml-10">
        {FASHION_ITEMS_CATEGORY.find((category) => category.id === selectedCategory)?.label}
      </h2>
      <FilterSheet
        filters={filters}
        onFilterChange={onFilterChange}
        onCategoryChange={onCategoryChange}
      />
    </div>
  ) : (
    <div className="px-10 md:px-20 py-16 max-w-screen-2xl mx-auto">
      <CategorySelectButton onClick={onCategoryChange} size="large" />
    </div>
  );
};

export default CategorySelector;
