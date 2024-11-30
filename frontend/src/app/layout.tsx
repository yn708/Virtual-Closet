import clsx from 'clsx';
import './globals.css';

import { Toaster } from '@/components/ui/toaster';
import NextAuthProvider from '@/context/AuthProvider';
import { metadata, viewport } from '@/utils/data/metadata';
import { notoSansJP } from '@/utils/fonts';

export interface RootLayoutProps {
  children: React.ReactNode;
}

export { metadata, viewport };

export default function RootLayout({ children }: Readonly<RootLayoutProps>) {
  return (
    <html lang="ja" className={clsx(notoSansJP.variable, 'font-sans')} suppressHydrationWarning>
      <body>
        <NextAuthProvider>
          <Toaster />
          {children}
        </NextAuthProvider>
      </body>
    </html>
  );
}
