import { BiCloset } from 'react-icons/bi';
import { BsBag } from 'react-icons/bs';
import { GiClothes, GiMonclerJacket, GiPearlNecklace } from 'react-icons/gi';
import { IoGlassesOutline } from 'react-icons/io5';
import { LiaSocksSolid } from 'react-icons/lia';
import { LuShirt } from 'react-icons/lu';
import { PiDressLight, PiPantsLight, PiSneaker } from 'react-icons/pi';

/*---------------------------------------------------------
ファッションアイテムカテゴリー
---------------------------------------------------------*/
export const CATEGORY_ICONS = {
  tops: LuShirt,
  bottoms: PiPantsLight,
  dress: PiDressLight,
  setup: GiClothes,
  outer: GiMonclerJacket,
  shoes: PiSneaker,
  bag: BsBag,
  legwear: LiaSocksSolid,
  fashion_goods: IoGlassesOutline,
  accessory: GiPearlNecklace,
  other: BiCloset,
};
