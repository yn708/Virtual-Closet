import './globals.css';

import { Toaster } from '@/components/ui/toaster';
import type { ChildrenType } from '@/types';
import { metadata, viewport } from '@/utils/data/metadata';
import { notoSansJP } from '@/utils/fonts';

export { metadata, viewport };

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
