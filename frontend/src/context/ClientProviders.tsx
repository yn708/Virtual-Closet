import { ThemeProvider } from 'next-themes';
import type { ReactNode } from 'react';
import { ImageProvider } from './ImageContext';

export function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      <ImageProvider>{children}</ImageProvider>
    </ThemeProvider>
  );
}
