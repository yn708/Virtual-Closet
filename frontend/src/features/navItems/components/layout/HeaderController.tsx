'use client';

import Header from '@/features/navItems/components/layout/Header';
import { COORDINATE_CREATE_CANVAS_URL } from '@/utils/constants';
import { usePathname } from 'next/navigation';

export default function HeaderController() {
  const pathname = usePathname();
  const hideHeaderPaths = [COORDINATE_CREATE_CANVAS_URL];

  if (hideHeaderPaths.includes(pathname)) {
    return null;
  }

  return <Header />;
}
