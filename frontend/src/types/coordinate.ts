import type { Season } from './fashion-item';
import type { BaseOption } from './form';

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
