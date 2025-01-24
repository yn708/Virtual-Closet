import { Noto_Sans_JP } from 'next/font/google';

export const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  display: 'swap', // フォントローディングの最適化
  weight: ['400', '500', '700'], // 必要なウェイトのみを指定
  variable: '--font-noto-sans-jp',
  preload: true, // プリロードの有効化
});
