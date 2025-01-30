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
  is_popular?: boolean;
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

export interface MetaDataType {
  categories: Category[];
  seasons: Season[];
  designs: Design[];
  colors: Color[];
  price_ranges: PriceRange[];
  popular_brands: Brand[];
}
/* ----------------------------------------------------------------
ファッションアイテム
------------------------------------------------------------------ */
// 詳細取得（必要なデータのみ取得）
export interface FashionItem {
  id: string;
  image: string;
  sub_category: { id: string; subcategory_name: string; category: string };
  brand: { id: string; brand_name: string; brand_name_kana: string } | null;
  seasons: [{ id: string; season_name: string }];
  price_range: { id: string; price_range: string } | null;
  design: { id: string; design_pattern: string } | null;
  main_color: { id: string; color_name: string; color_code: string } | null;
  is_owned: boolean;
  is_old_clothes: boolean;
  created_at: Date;
  updated_at: Date;
}
