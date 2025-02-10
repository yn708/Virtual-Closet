import type { BaseCoordinate } from '@/types/coordinate';

/*---------------------------------------------
Filter
----------------------------------------------*/
export interface CoordinateCache {
  photo: BaseCoordinate[];
  custom: BaseCoordinate[];
}
export type CoordinateCategory = keyof CoordinateCache;

export interface CoordinateFilters {
  category: CoordinateCategory | '';
  seasons: string[];
  scenes: string[];
  tastes: string[];
  [key: string]: unknown;
}

/*---------------------------------------------
Item Type
----------------------------------------------*/
export interface InitialItems {
  items: {
    item_id: string;
    image: string;
    position_data: {
      scale: number;
      rotate: number;
      zIndex: number;
      xPercent: number;
      yPercent: number;
    };
  }[];
  background: string;
}

export interface InitialItemsProps {
  initialItems?: InitialItems;
}
