import type { FashionItem } from '@/types';
import type { BaseCoordinate, CoordinateMetaDataType } from '@/types/coordinate';

/*--------------------------------------------------------
Data
--------------------------------------------------------*/
export interface CoordinateMetaDataTypes {
  metaData: CoordinateMetaDataType;
}
export interface CoordinateInitialDataTypes {
  initialData?: BaseCoordinate;
}

/*--------------------------------------------------------
Form
--------------------------------------------------------*/
export interface CoordinateEditTypes extends CoordinateInitialDataTypes {
  onSuccess?: (updatedItem: BaseCoordinate) => void;
}

/*--------------------------------------------------------
Canvas
--------------------------------------------------------*/
// アイテムの位置、大きさ、回転などのスタイル情報
export interface ItemStyle {
  zIndex: number; // 重なり順
  scale: number; // 拡大縮小率
  rotate: number; // 回転角度
  xPercent: number; // X座標相対値
  yPercent: number; // Y座標相対値
}

//  ドラッグ開始時の情報
export interface DragStart {
  mouseX: number; // ドラッグ開始時のマウスのX座標（px）
  mouseY: number; // ドラッグ開始時のマウスのY座標（px）
  startXPercent: number; // ドラッグ開始時のアイテムの横位置（%）
  startYPercent: number; // ドラッグ開始時のアイテムの縦位置（%）
  containerWidth: number; // キャンバスの幅（px）
  containerHeight: number; // キャンバスの高さ（px）
}

// 変形（回転・拡大縮小）開始時の情報を保持するインターフェース
export interface TransformStart {
  mouseX: number;
  mouseY: number;
  centerX: number;
  centerY: number;
  startRotate: number;
  startScale: number;
  distance: number;
  angle: number;
}

// 境界値
export interface Bounds {
  left: number; // 左端の境界
  top: number; // 上端の境界
  right: number; // 右端の境界
  bottom: number; // 下端の境界
}

// アイテムのポジション
export interface PositionType {
  xPercent: number;
  yPercent: number;
}

// useCoordinateCanvasState
export interface CanvasState {
  selectedItems: FashionItem[];
  itemStyles: Record<string, ItemStyle>;
  background: string;
}
/*--------------------------------------------------------
Canvas Props
--------------------------------------------------------*/
// Customコーディネート作成時の選択アイテムに関する型
export interface OnSelectItemType {
  onSelectItem?: (item: FashionItem) => void;
}
export interface SelectedItemsType {
  selectedItems?: FashionItem[];
}
