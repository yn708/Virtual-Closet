'use client';

import ScrollToTopButton from '@/components/elements/button/ScrollToTopButton';
import { useScroll } from '@/hooks/utils/useScroll';
import type { ChildrenType } from '@/types';
import { useEffect } from 'react';

interface BaseContentsLayoutProps extends ChildrenType {
  selectedCategory?: string;
  isPending?: boolean;
}

const BaseContentsLayout = ({ selectedCategory, isPending, children }: BaseContentsLayoutProps) => {
  const { showScrollButton, scrollToTop, elementRef } = useScroll();

  useEffect(() => {
    if (selectedCategory && !isPending) {
      elementRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }, [selectedCategory, elementRef, isPending]);

  return (
    <div ref={elementRef} className="min-h-screen w-full">
      <div className="mx-auto w-full max-w-[1400px] px-3 py-4 sm:px-4 sm:py-5 md:p-6 lg:px-8">
        {children}
      </div>
      <ScrollToTopButton show={showScrollButton} onClick={scrollToTop} />
    </div>
  );
};
export default BaseContentsLayout;
