import { Button } from '@/components/ui/button';
import type { ClassNameType } from '@/types';
import type { BaseFilterChange } from '../../types';

interface CategorySelectButtonProps extends ClassNameType, BaseFilterChange {
  selectedId?: string;
  size?: 'small' | 'large'; // small: Sheetに表示の時
}

const CategorySelectButton = ({
  onCategoryChange,
  selectedId,
  size = 'small',
  className = '',
  config,
}: CategorySelectButtonProps) => {
  const { categories, layout } = config;
  const gridClass = size === 'small' ? layout.categoryGrid.small : layout.categoryGrid.large;

  return (
    <div className={`grid gap-2 ${gridClass} ${className}`}>
      {categories.map((category) => {
        const isSelected = category.id === selectedId;
        const buttonBaseStyles = `h-auto bg-bray-700 transition-all`;
        const buttonSizeStyles = size === 'small' ? 'p-2' : 'px-2 py-6 md:py-10';

        return (
          <Button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            variant="outline"
            className={`
              ${buttonBaseStyles}
              ${buttonSizeStyles}
              ${
                isSelected
                  ? 'bg-blue-500 text-white border-blue-500 hover:bg-blue-500 hover:text-white'
                  : 'border-gray-200 dark:border-gray-800 hover:border-blue-400 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950'
              }
            `}
          >
            <span
              className={`relative w-full text-xs md:text-sm font-medium 
                ${category.icon ? 'text-start pl-12' : ''}
                ${category.description && size === 'large' ? 'pb-2' : ''}
                ${isSelected ? 'text-white' : 'text-gray-600 dark:text-gray-400'}`}
            >
              {/* ラベル */}
              {category.label}
              {/* アイコン（任意） */}
              {category.icon && (
                <category.icon
                  className={`absolute left-4 top-1/2 -translate-y-1/2
                    ${size === 'small' ? 'size-3 md:size-4' : 'size-4 md:size-5'}
                    ${isSelected ? 'text-white' : 'text-gray-600 dark:text-gray-400'}
                  `}
                />
              )}
              {/* ディスクリプション（任意） */}
              {category.description && size === 'large' && (
                <span
                  className={`absolute left-1/2 bottom-1 -translate-x-1/2 translate-y-full
                text-xs font-normal opacity-60
                ${isSelected ? 'text-white' : 'text-gray-600 dark:text-gray-400'}
              `}
                >
                  {category.description}
                </span>
              )}
            </span>
          </Button>
        );
      })}
    </div>
  );
};

export default CategorySelectButton;
