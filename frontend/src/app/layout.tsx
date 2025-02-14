import './globals.css';

import { Toaster } from '@/components/ui/toaster';
import type { ChildrenType } from '@/types';
import { DESCRIPTION, SITE_NAME, SITE_URL } from '@/utils/constants';
import { notoSansJP } from '@/utils/fonts';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_NAME,
  description: DESCRIPTION,
  keywords: ['ファッション', 'コーディネート', 'おしゃれ', '提案'],
  robots: 'index, follow',
  alternates: {
    canonical: SITE_URL,
  },
  icons: {
    icon: [
      { url: '/favicons/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicons/favicon.png', type: 'image/png' },
    ],
    apple: [
      { url: '/favicons/apple-touch-icon.svg', type: 'image/svg+xml' },
      { url: '/favicons/apple-homescreen-icon.svg', type: 'image/svg+xml' },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: SITE_NAME,
  },
  other: {
    'mobile-web-app-capable': 'yes',
  },
  openGraph: {
    title: SITE_NAME,
    siteName: SITE_NAME,
    description: DESCRIPTION,
    type: 'website',
    locale: 'ja_JP',
    url: SITE_URL,
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'サイトの説明画像',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: DESCRIPTION,
    images: `${SITE_URL}/images/og-image.png`,
    creator: '@yamahon708',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  userScalable: false,
};

export default function RootLayout({ children }: Readonly<ChildrenType>) {
  return (
    <html lang="ja" className={notoSansJP.variable} suppressHydrationWarning>
      <body className="font-sans min-h-screen bg-background antialiased">
        <Toaster />
        {children}
      </body>
    </html>
  );
}
