import NextAuthProvider from '@/context/AuthProvider';
import { ImageProvider } from '@/context/ImageContext';
import FooterController from '@/features/navItems/components/layout/FooterController';
import HeaderController from '@/features/navItems/components/layout/HeaderController';
import type { ChildrenType } from '@/types';
import { ThemeProvider } from 'next-themes';

export default function ProtectedLayout({ children }: Readonly<ChildrenType>) {
  return (
    <NextAuthProvider>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
        <ImageProvider>
          <HeaderController />
          <main>{children}</main>
          <FooterController />
        </ImageProvider>
      </ThemeProvider>
    </NextAuthProvider>
  );
}
