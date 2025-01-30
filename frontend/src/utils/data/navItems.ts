import { House } from 'lucide-react';
import { APP_ABOUT_URL, CONTACT_URL, PRIVACY_URL, TERMS_URL, TOP_URL } from '../constants';

/* ----------------------------------------------------------------
フッター
------------------------------------------------------------------ */
export const FOOTER_NAV_ITEMS = [
  { href: APP_ABOUT_URL, label: 'このサイトについて' },
  { href: CONTACT_URL, label: 'お問い合わせ' },
  { href: PRIVACY_URL, label: 'プライバシーポリシー' },
  { href: TERMS_URL, label: '利用規約' },
];

/* ----------------------------------------------------------------
ヘッダー
------------------------------------------------------------------ */
// 機能がまだ限定的なので、１のみ
export const HEADER_NAV_ITEMS = [
  // {
  //   href: TOP_URL,
  //   icon: GoHome,
  //   label: 'top-page',
  // },
  // {
  //   // ここは後々詳しく設定（マイクローゼット、検索、コーディネート提案等のどの機能にするにか）
  //   href: '/#',
  //   icon: BiCloset,
  //   label: 'Closet',
  // },
  // {
  //   href: MY_PAGE_URL,
  //   icon: FaRegUser,
  //   label: 'my-page',
  // },

  {
    href: TOP_URL,
    icon: House,
    label: 'my-closet',
  },
];

/* ----------------------------------------------------------------
ステップフォーム
------------------------------------------------------------------ */
export const STEPS = [
  { step: 1, label: '入力' },
  { step: 2, label: '確認' },
  { step: 3, label: '完了' },
];
