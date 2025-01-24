import {
  COORDINATE_CATEGORY,
  FASHION_ITEMS_CATEGORY,
  FASHION_ITEMS_FILTER_OPTIONS,
  SCENE_OPTIONS,
  SEASON_OPTIONS,
  TASTE_OPTIONS,
} from '@/utils/data/selectData';
import type { FilterSheetConfig } from '../types';

/*-----------------------------------------------------
ファッションアイテムの絞り込み設定
-----------------------------------------------------*/
export const fashionItemConfig: FilterSheetConfig = {
  title: '絞り込み',
  categories: FASHION_ITEMS_CATEGORY,
  filterGroups: [
    {
      label: 'ステータス',
      key: 'status',
      options: FASHION_ITEMS_FILTER_OPTIONS,
    },
    {
      label: 'シーズン',
      key: 'season',
      options: SEASON_OPTIONS,
    },
  ],
  layout: {
    categoryGrid: {
      small: 'grid-cols-2',
      large: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
    },
  },
  filterHandlers: {
    defaultFilters: {
      category: '',
      status: [],
      season: [],
    },
  },
};

/*-----------------------------------------------------
コーディネートの絞り込み設定
-----------------------------------------------------*/
export const coordinateConfig: FilterSheetConfig = {
  title: '絞り込み',
  categories: COORDINATE_CATEGORY,
  filterGroups: [
    {
      label: 'シーズン',
      key: 'seasons',
      options: SEASON_OPTIONS,
    },
    {
      label: 'シーン',
      key: 'scenes',
      options: SCENE_OPTIONS,
    },
    {
      label: 'テイスト',
      key: 'tastes',
      options: TASTE_OPTIONS,
    },
  ],
  layout: {
    categoryGrid: {
      small: 'grid-cols-2',
      large: 'grid-cols-1 md:grid-cols-2',
    },
  },
  filterHandlers: {
    defaultFilters: {
      category: '',
      seasons: [],
      scenes: [],
      tastes: [],
    },
  },
};
