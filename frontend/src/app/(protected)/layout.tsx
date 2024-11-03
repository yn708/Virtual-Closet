import { metadata, viewport } from '@/utils/metadata';
import type { RootLayoutProps } from '../layout';

export { metadata, viewport };

export default function ProtectedLayout({ children }: Readonly<RootLayoutProps>) {
  return (
    <>
      {/* <Header /> */}
      <main>{children}</main>
      {/* <Footer /> */}
    </>
  );
}
