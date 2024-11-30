import type { Metadata } from 'next';
import { SITE_URL, SITE_NAME, DESCRIPTION } from '../constants';

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
  },
  twitter: {
    card: 'summary',
    title: SITE_NAME,
    description: DESCRIPTION,
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  userScalable: false,
};
