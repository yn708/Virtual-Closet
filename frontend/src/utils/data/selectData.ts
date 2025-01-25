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
];

/* ----------------------------------------------------------------
季節
------------------------------------------------------------------ */
export const SEASON_OPTIONS = [
  { id: 'spring', label: '春' },
  { id: 'summer', label: '夏' },
  { id: 'autumn', label: '秋' },
  { id: 'winter', label: '冬' },
];

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

/* ----------------------------------------------------------------
コーディネート選択カテゴリー
------------------------------------------------------------------ */
interface CoordinateCategoryType {
  id: 'photo' | 'custom';
  label: string;
  description: string;
}
export const COORDINATE_CATEGORY: CoordinateCategoryType[] = [
  { id: 'photo', label: 'フォトコーディネート', description: '- 画像から作成したコーディネート -' },
  {
    id: 'custom',
    label: 'カスタムコーディネート',
    description: '- 登録済みアイテムから作成したコーディネート -',
  },
];

/* ----------------------------------------------------------------
シーン
------------------------------------------------------------------ */
export const SCENE_OPTIONS = [
  { id: '1', label: '休日' },
  { id: '2', label: '散歩' },
  { id: '3', label: 'アウトドア' },
  { id: '4', label: '買い物' },
  { id: '5', label: 'ランチ' },
  { id: '6', label: 'ディナー' },
  { id: '7', label: 'カフェ' },
  { id: '8', label: '飲み会' },
  { id: '9', label: 'おでかけ' },
  { id: '10', label: 'デート' },
  { id: '11', label: '旅行' },
  { id: '12', label: 'イベント' },
  { id: '13', label: 'パーティー' },
  { id: '14', label: 'スポーツ観戦' },
  { id: '15', label: '結婚式' },
  { id: '16', label: '通勤' },
  { id: '17', label: 'オフィスカジュアル' },
  { id: '18', label: '学校' },
  { id: '19', label: 'ドライブ' },
  { id: '20', label: 'その他' },
];

/* ----------------------------------------------------------------
テイスト
------------------------------------------------------------------ */
export const TASTE_OPTIONS = [
  { id: '1', label: '古着Mix/ヴィンテージ' },
  { id: '2', label: 'きれいめ' },
  { id: '3', label: 'カジュアル' },
  { id: '4', label: 'シンプル' },
  { id: '5', label: 'ナチュラル/リラックス' },
  { id: '6', label: 'ストリート' },
  { id: '7', label: 'スポーティー' },
  { id: '8', label: 'モード' },
  { id: '9', label: 'ガーリー/フェミニン' },
  { id: '10', label: 'ロック' },
  { id: '11', label: 'ミリタリー' },
  { id: '12', label: 'セレブティ' },
  { id: '13', label: 'その他' },
];

/* ----------------------------------------------------------------
お問合せ機能
------------------------------------------------------------------ */
// 件名
export const SUBJECT_OPTIONS = [
  { id: 'サービス全般について', name: 'サービス全般について' },
  { id: 'サービスの利用方法について', name: 'サービスの利用方法について' },
  { id: 'バグの報告', name: 'バグの報告' },
  { id: '機能要望', name: '機能要望' },
  { id: 'その他', name: 'その他' },
];
