'use client';

import ScrollToTopButton from '@/components/elements/button/ScrollToTopButton';
import { useScroll } from '@/hooks/utils/useScroll';
import { useEffect } from 'react';
import { useFashionItems } from '../../hooks/useFashionItems';
import CategorySelector from './CategorySelector';
import FashionItemList from './FashionItemList';

const FashionItemsContents = () => {
  const {
    selectedCategory,
    filters,
    isPending,
    handleCategoryChange,
    handleDelete,
    handleUpdate,
    handleFilterChange,
    currentItems,
  } = useFashionItems();
  const { showScrollButton, scrollToTop, elementRef } = useScroll();

  // カテゴリー選択時のスクロール処理
  useEffect(() => {
    if (selectedCategory && !isPending) {
      elementRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }, [selectedCategory, elementRef, isPending]);

  return (
    <div ref={elementRef}>
      <CategorySelector
        onCategoryChange={handleCategoryChange}
        selectedCategory={selectedCategory}
        onFilterChange={handleFilterChange}
        filters={filters}
      />
      {selectedCategory && (
        <div className="min-h-screen max-w-screen-2xl mx-auto p-4">
          <FashionItemList
            items={currentItems}
            isLoading={isPending}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
          />
        </div>
      )}
      <ScrollToTopButton show={showScrollButton} onClick={scrollToTop} />
    </div>
  );
};

export default FashionItemsContents;
