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

const CoordinateContents = () => {
  const { state, handlers } = useCoordinates();
  const { selectedCategory, currentItems, isPending, filters } = state;
  const { handleCategoryChange, handleDelete, handleUpdate, handleFilterChange } = handlers;

  return (
    <BaseContentsLayout selectedCategory={selectedCategory} isPending={isPending}>
      <CategorySelector<CoordinateFilters>
        onCategoryChange={(categoryId: string) => {
          handleCategoryChange(categoryId as CoordinateCategory | ''); // ここで型を変換してhandleCategoryChangeに渡す
        }}
        onFilterChange={handleFilterChange}
        selectedCategory={selectedCategory}
        filters={filters}
        config={coordinateConfig}
      />
      {selectedCategory && (
        <BaseListLayout
          items={currentItems}
          isLoading={isPending}
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
