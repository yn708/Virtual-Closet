'use client';

import { COORDINATE_CREATE_CANVAS_URL } from '@/utils/constants';
import { usePathname } from 'next/navigation';
import Footer from './Footer';

export default function FooterController() {
  const pathname = usePathname();
  const hideFooterPaths = [COORDINATE_CREATE_CANVAS_URL];

  if (hideFooterPaths.includes(pathname)) {
    return null;
  }

  return <Footer />;
}
