import { ClientProviders } from '@/context/ClientProviders';
import HeaderController from '@/features/navItems/components/layout/HeaderController';
import { metadata, viewport } from '@/utils/data/metadata';
import type { RootLayoutProps } from '../layout';
import FooterController from '@/features/navItems/components/layout/FooterController';

export { metadata, viewport };

export default function ProtectedLayout({ children }: Readonly<RootLayoutProps>) {
  return (
    <>
      <ClientProviders>
        <HeaderController />
        <main>{children}</main>
        <FooterController />
      </ClientProviders>
    </>
  );
}
