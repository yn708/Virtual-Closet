import type { BaseFilterProps } from '../../types';
import CategorySelectButton from '../button/CategorySelectButton';
import FilterSheet from '../sheet/FilterSheet';

interface CategorySelectorProps<T> extends BaseFilterProps<T> {
  selectedCategory?: string;
}

const CategorySelector = <T extends Record<string, unknown>>({
  onCategoryChange,
  onFilterChange,
  selectedCategory,
  filters,
  config,
}: CategorySelectorProps<T>) => {
  return selectedCategory ? (
    <div className="ml-4">
      <FilterSheet
        filters={filters}
        onFilterChange={onFilterChange}
        onCategoryChange={onCategoryChange}
        config={config}
      />
    </div>
  ) : (
    <div className="px-3 md:px-10 py-16 max-w-screen-2xl mx-auto">
      <CategorySelectButton
        onCategoryChange={onCategoryChange}
        size="large"
        config={config}
        selectedId={selectedCategory}
      />
    </div>
  );
};

export default CategorySelector;
