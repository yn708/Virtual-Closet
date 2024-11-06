import { ClientProviders } from '@/context/ClientProviders';
import Footer from '@/features/navItems/components/layout/Footer';
import Header from '@/features/navItems/components/layout/Header';
import { metadata, viewport } from '@/utils/metadata';
import type { RootLayoutProps } from '../layout';

export { metadata, viewport };

export default function ProtectedLayout({ children }: Readonly<RootLayoutProps>) {
  return (
    <>
      <ClientProviders>
        <Header />
        <main>{children}</main>
        <Footer />
      </ClientProviders>
    </>
  );
}
