'use client';

import CategorySelector from '@/features/my-page/common/components/contents/CategorySelector';
import BaseImageDrawer from '@/features/my-page/common/components/drawer/BaseImageDrawer';
import BaseListLayout from '@/features/my-page/common/components/layout/BaseListLayout';
import BaseContentsLayout from '@/features/my-page/common/components/layout/BaseScrollContentsLayout';
import { coordinateConfig } from '@/features/my-page/common/config/filterConfigs';
import type { BaseCoordinate } from '@/types/coordinate';
import { useCoordinates } from '../../hooks/useCoordinates';
import type { CoordinateCategory, CoordinateFilters } from '../../types';
import CoordinateDetailInfo from './CoordinateDetailInfo';
import ItemCounter from '@/components/elements/utils/ItemCounter';

const CoordinateContents = () => {
  const { state, handlers } = useCoordinates();
  const { selectedCategory, currentItems, isInitialLoading, filters, hasMore, isLoadingMore } =
    state;
  const { handleCategoryChange, handleDelete, handleUpdate, handleFilterChange, handleLoadMore } =
    handlers;

  return (
    <BaseContentsLayout selectedCategory={selectedCategory}>
      {state.countData && state.countData.current_count > 0 && (
        <ItemCounter countData={state.countData} />
      )}
      <CategorySelector<CoordinateFilters>
        onCategoryChange={(categoryId: string) => {
          handleCategoryChange(categoryId as CoordinateCategory | '');
        }}
        onFilterChange={handleFilterChange}
        selectedCategory={selectedCategory}
        filters={filters}
        config={coordinateConfig}
      />
      {selectedCategory && (
        <BaseListLayout
          items={currentItems}
          isInitialLoading={isInitialLoading}
          isLoadingMore={isLoadingMore}
          hasMore={hasMore}
          onLoadMore={handleLoadMore}
          renderItem={(item) => (
            <BaseImageDrawer<BaseCoordinate>
              type="coordinate"
              item={item}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
              selectedCategory={selectedCategory}
              DetailInfoComponent={CoordinateDetailInfo}
            />
          )}
        />
      )}
    </BaseContentsLayout>
  );
};
export default CoordinateContents;
