'use client';

import ScrollToTopButton from '@/components/elements/button/ScrollToTopButton';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { useFashionItems } from '@/context/FashionItemsContext';
import type { OnSelectItemType, SelectedItemsType } from '@/features/coordinate/types';
import { useScroll } from '@/hooks/utils/useScroll';
import { FASHION_ITEMS_CATEGORY } from '@/utils/data/selectData';
import { useEffect, useRef } from 'react';
import CategorySelector from './CategorySelector';
import FashionItemList from './FashionItemList';

const FashionItemsContents: React.FC<OnSelectItemType & SelectedItemsType> = ({
  onSelectItem,
  selectedItems,
}) => {
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

  const scrollContainerRef = useRef<HTMLDivElement>(null); // スクロール可能な要素を参照するref
  const categoryButtonRefs = useRef<Map<string, HTMLButtonElement>>(new Map()); // カテゴリーボタンのrefを保持するMap
  // カテゴリー選択時のスクロール処理
  const handleCategoryClick = (categoryId: string) => {
    handleCategoryChange(categoryId);
    // 選択されたカテゴリーボタンの要素を取得
    const buttonElement = categoryButtonRefs.current.get(categoryId);
    const scrollContainer = scrollContainerRef.current?.querySelector(
      '[data-radix-scroll-area-viewport]',
    );

    if (buttonElement && scrollContainer) {
      // ボタンの位置とコンテナの位置を取得
      const containerRect = scrollContainer.getBoundingClientRect();
      const buttonRect = buttonElement.getBoundingClientRect();
      // スクロール位置を計算
      // ボタンを中央に配置するために、コンテナの幅の半分からボタンの幅の半分を引く
      const targetScroll =
        buttonElement.offsetLeft - containerRect.width / 2 + buttonRect.width / 2;
      // スクロール実行
      scrollContainer.scrollTo({
        left: targetScroll,
        behavior: 'smooth',
      });
    }
  };
  // コンテンツエリアへのスクロール
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
        <CategorySelector
          onCategoryChange={handleCategoryChange}
          selectedCategory={selectedCategory}
          onFilterChange={handleFilterChange}
          filters={filters}
        />

        {selectedCategory && (
          <>
            <ScrollArea
              className="w-full rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm pt-4 pb-8 px-3 md:px-8"
              ref={scrollContainerRef}
            >
              <div className="mx-auto flex items-center justify-center gap-2">
                {FASHION_ITEMS_CATEGORY.map((category) => (
                  <Button
                    key={category.id}
                    ref={(el) => {
                      if (el) categoryButtonRefs.current.set(category.id, el);
                    }}
                    onClick={() => handleCategoryClick(category.id)}
                    variant={selectedCategory === category.id ? 'default' : 'outline'}
                    className={`
                        whitespace-nowrap rounded-full transition-all duration-200 text-xs md:text-sm
                        ${
                          selectedCategory === category.id
                            ? 'shadow-md'
                            : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                        }
                      `}
                  >
                    {category.label}
                  </Button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>

            <div
              className={`
                transition-opacity duration-300 ease-in-out
                ${isPending ? 'opacity-50' : 'opacity-100'}
              `}
            >
              <FashionItemList
                items={currentItems}
                isLoading={isPending}
                onDelete={handleDelete}
                onUpdate={handleUpdate}
                onSelectItem={onSelectItem}
                selectedItems={selectedItems}
              />
            </div>
          </>
        )}
      </div>
      <ScrollToTopButton show={showScrollButton} onClick={scrollToTop} />
    </div>
  );
};

export default FashionItemsContents;
