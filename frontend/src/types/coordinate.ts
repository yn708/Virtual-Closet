import type { Season } from './fashion-item';
import type { BaseOption } from './form';

/* ----------------------------------------------------------------
Type
------------------------------------------------------------------ */
export type CoordinateType = 'photo' | 'custom';

/* ----------------------------------------------------------------
Coordinate詳細
------------------------------------------------------------------ */
export interface Scene extends BaseOption {
  scene: string;
}

export interface Taste extends BaseOption {
  taste: string;
}

export interface CoordinateMetaDataType {
  seasons: Season[];
  scenes: Scene[];
  tastes: Taste[];
}

/* ----------------------------------------------------------------
fetch データ
------------------------------------------------------------------ */
// コーディネート取得
export interface BaseCoordinate {
  id: string;
  image: string;
  seasons: [{ id: string; season_name: string }];
  scenes: [{ id: string; scene: string }];
  tastes: [{ id: string; taste: string }];
}
