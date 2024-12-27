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
    <div className="ml-4">
      <FilterSheet
        filters={filters}
        onFilterChange={onFilterChange}
        onCategoryChange={onCategoryChange}
      />
    </div>
  ) : (
    <div className="px-3 md:px-10 py-16 max-w-screen-2xl mx-auto">
      <CategorySelectButton onClick={onCategoryChange} size="large" />
    </div>
  );
};

export default CategorySelector;
