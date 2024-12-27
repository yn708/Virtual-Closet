import { Button } from '@/components/ui/button';
import { CATEGORY_AND_RECENT_ICONS } from '@/utils/data/icons';
import { FASHION_ITEMS_CATEGORY } from '@/utils/data/selectData';
import type { CategorySelectButtonProps } from '../../types';

const CategorySelectButton = ({
  onClick,
  selectedId,
  size = 'small',
  className = '',
}: CategorySelectButtonProps) => {
  const baseStyles = 'grid gap-2';
  const gridStyles = size === 'small' ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4';

  return (
    <div className={`${baseStyles} ${gridStyles} ${className}`}>
      {FASHION_ITEMS_CATEGORY.map((category) => {
        const CategoryIcon =
          CATEGORY_AND_RECENT_ICONS[category.id as keyof typeof CATEGORY_AND_RECENT_ICONS];
        const isSelected = category.id === selectedId;

        const buttonBaseStyles = 'h-auto flex items-center justify-start transition-all';
        const buttonSizeStyles =
          size === 'small'
            ? 'gap-3 py-3 pl-5 md:pl-10'
            : 'gap-2 md:gap-4 pl-5 md:pl-10 py-6 md:py-10';

        const selectedStyles = isSelected
          ? 'bg-blue-500 text-white border-blue-500 hover:bg-blue-500 hover:text-white'
          : 'border-gray-200 dark:border-gray-800 hover:border-blue-400 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950';

        return (
          <Button
            key={category.id}
            onClick={() => onClick(category.id)}
            variant="outline"
            className={`
              ${buttonBaseStyles}
              ${buttonSizeStyles}
              ${selectedStyles}
            `}
          >
            {CategoryIcon && (
              <CategoryIcon
                className={`
                  ${size === 'small' ? 'size-3 md:size-4' : 'size-4 md:size-5'}
                  transition-opacity
                  ${isSelected ? 'text-white' : 'text-gray-600 dark:text-gray-400'}
                `}
              />
            )}
            <span
              className={`
              text-xs md:text-sm font-medium text-wrap
              ${isSelected ? 'text-white' : 'text-gray-600 dark:text-gray-400'}
              transition-colors duration-200
            `}
            >
              {category.label}
            </span>
          </Button>
        );
      })}
    </div>
  );
};

export default CategorySelectButton;
