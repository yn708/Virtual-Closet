import clsx from 'clsx';
import './globals.css';

import { Toaster } from '@/components/ui/toaster';
import NextAuthProvider from '@/context/AuthProvider';
import { notoSansJP } from '@/utils/fonts';
import { metadata, viewport } from '@/utils/metadata';

export interface RootLayoutProps {
  children: React.ReactNode;
}

export { metadata, viewport };

export default function RootLayout({ children }: Readonly<RootLayoutProps>) {
  return (
    <html lang="ja" className={clsx(notoSansJP.variable, 'font-sans')}>
      <body>
        <NextAuthProvider>
          <Toaster />
          {children}
        </NextAuthProvider>
      </body>
    </html>
  );
}
