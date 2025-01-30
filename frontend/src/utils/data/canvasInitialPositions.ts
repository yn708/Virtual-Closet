import type { PositionType } from '@/features/coordinate/types';

/*----------------------------------------------------------------------------------
キャンバス上に表示するアイテムの初期位置設定
----------------------------------------------------------------------------------*/
export const INITIAL_POSITIONS: Record<string, PositionType> = {
  tops: { xPercent: 50, yPercent: 20 },
  outer: { xPercent: 45, yPercent: 25 },
  bottoms: { xPercent: 50, yPercent: 70 },
  dress: { xPercent: 50, yPercent: 50 },
  setup: { xPercent: 50, yPercent: 50 },
  shoes: { xPercent: 50, yPercent: 85 },
  bag: { xPercent: 50, yPercent: 50 },
  legwear: { xPercent: 40, yPercent: 85 },
  fashion_goods: { xPercent: 50, yPercent: 15 },
  accessory: { xPercent: 70, yPercent: 20 },
  other: { xPercent: 70, yPercent: 20 },
};

export const DEFAULT_POSITION: PositionType = { xPercent: 50, yPercent: 50 };
