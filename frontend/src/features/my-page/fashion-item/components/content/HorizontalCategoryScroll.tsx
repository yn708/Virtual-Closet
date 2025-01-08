'use client';

import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { FASHION_ITEMS_CATEGORY } from '@/utils/data/selectData';
import { useRef } from 'react';

interface HorizontalCategoryScrollProps {
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

const HorizontalCategoryScroll = ({
  selectedCategory,
  onCategoryChange,
}: HorizontalCategoryScrollProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const categoryButtonRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  const handleCategoryClick = (categoryId: string) => {
    onCategoryChange(categoryId);
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
      const targetScroll =
        buttonElement.offsetLeft - containerRect.width / 2 + buttonRect.width / 2;
      // スクロール実行
      scrollContainer.scrollTo({
        left: targetScroll,
        behavior: 'smooth',
      });
    }
  };

  return (
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
  );
};
export default HorizontalCategoryScroll;
