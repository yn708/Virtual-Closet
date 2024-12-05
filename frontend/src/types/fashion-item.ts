import type { IdType } from './common';
import type { BaseOption } from './form';

/* ----------------------------------------------------------------
fashion-item詳細
------------------------------------------------------------------ */
export interface SubCategory extends IdType {
  subcategory_name: string;
  category: Category;
}

export interface Category extends IdType {
  category_name: string;
  subcategories: SubCategory[];
}

export interface Brand extends IdType {
  brand_name: string;
  brand_name_kana: string;
  is_popular: boolean;
}

export interface Season extends BaseOption, IdType {
  season_name: string;
}

export interface Design extends BaseOption, IdType {
  design_pattern: string;
}

export interface Color extends IdType {
  color_name: string;
  color_code: string;
}

export interface PriceRange extends BaseOption, IdType {
  price_range: string;
}

/* ----------------------------------------------------------------
ファッションアイテム
------------------------------------------------------------------ */

export interface MetaDataType {
  categories: Category[];
  seasons: Season[];
  designs: Design[];
  colors: Color[];
  price_ranges: PriceRange[];
  popular_brands: Brand[];
}
