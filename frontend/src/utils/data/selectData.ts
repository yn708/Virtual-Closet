/* ----------------------------------------------------------------
性別
------------------------------------------------------------------ */
export const GENDER_ITEMS = [
  { id: 'unanswered', name: '未回答' },
  { id: 'male', name: '男性' },
  { id: 'female', name: '女性' },
  { id: 'other', name: 'その他' },
];

/* ----------------------------------------------------------------
ファッションアイテムカテゴリー
------------------------------------------------------------------ */
export const FASHION_ITEMS_CATEGORY = [
  { id: 'recent', label: '最近のアイテム' },
  { id: 'tops', label: 'トップス' },
  { id: 'bottoms', label: 'ボトムス' },
  { id: 'dress', label: 'ワンピース' },
  { id: 'setup', label: 'セットアップ' },
  { id: 'outer', label: 'アウター' },
  { id: 'shoes', label: 'シューズ' },
  { id: 'bag', label: 'バッグ' },
  { id: 'legwear', label: 'レッグウェア' },
  { id: 'fashion_goods', label: 'ファッション雑貨' },
  { id: 'accessory', label: 'アクセサリー' },
  { id: 'other', label: 'その他' },
];

/* ----------------------------------------------------------------
所有、古着選択
------------------------------------------------------------------ */
export const FASHION_ITEMS_FILTER_OPTIONS = [
  { id: 'owned', label: '所有アイテムのみ' },
  { id: 'used', label: '古着のみ' },
] as const;

/* ----------------------------------------------------------------
季節
------------------------------------------------------------------ */
export const SEASON_OPTIONS = [
  { id: 'spring', label: '春' },
  { id: 'summer', label: '夏' },
  { id: 'autumn', label: '秋' },
  { id: 'winter', label: '冬' },
] as const;

/* ----------------------------------------------------------------
カラー
------------------------------------------------------------------ */
// 背景色選択
export const BG_COLOR = [
  { value: 'bg-white' },
  { value: 'bg-slate-100' },
  { value: 'bg-red-100' },
  { value: 'bg-orange-100' },
  { value: 'bg-yellow-100' },
  { value: 'bg-green-100' },
  { value: 'bg-sky-100' },
  { value: 'bg-indigo-100' },
  { value: 'bg-pink-100' },
  { value: 'bg-slate-600' },
  { value: 'bg-red-600' },
  { value: 'bg-orange-700' },
  { value: 'bg-yellow-700' },
  { value: 'bg-green-700' },
  { value: 'bg-sky-700' },
  { value: 'bg-indigo-700' },
];
