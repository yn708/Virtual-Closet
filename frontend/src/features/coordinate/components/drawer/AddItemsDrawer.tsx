import IconButton from '@/components/elements/button/IconButton';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useCoordinateCanvasState } from '@/context/CoordinateCanvasContext';
import { useFashionItems } from '@/context/FashionItemsContext';
import FashionItemsContents from '@/features/my-page/fashion-item/components/content/FashionItemsContents';
import { useIsOpen } from '@/hooks/utils/useIsOpen';
import { Shirt, X } from 'lucide-react';
import { useCallback, useEffect, useRef } from 'react';

const AddItemsDrawer = () => {
  const { state, handlers } = useCoordinateCanvasState();
  const { state: fashionState, handlers: fashionHandlers } = useFashionItems();
  const { isOpen, setIsOpen, onClose, onToggle } = useIsOpen();
  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state.selectedItems?.length === 0) {
      setIsOpen(true);
    }
  }, [state.selectedItems?.length, setIsOpen]);

  /*
   * AddItemsDrawerはScrollAreaを使用中のため、
   * 無限スクロール（loadMoreの発火）は
   * BaseListLayout/useInfiniteScrollを使用せず、
   * 本コンポーネントの中で処理を定義
   */
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting && !fashionState.isLoadingMore && fashionState.hasMore) {
        fashionHandlers.loadMore();
      }
    },
    [fashionState.isLoadingMore, fashionState.hasMore, fashionHandlers],
  );

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '20px',
      threshold: 0.1,
    };

    const observer = new IntersectionObserver(handleObserver, options);
    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [handleObserver]);

  return (
    <Drawer open={isOpen} onOpenChange={onToggle}>
      <DrawerTrigger asChild>
        <IconButton
          Icon={Shirt}
          label="追加"
          size="md"
          variant="ghost"
          className="flex-col h-auto gap-1"
          labelClassName="opacity-60"
        />
      </DrawerTrigger>
      <DrawerContent className="h-[90vh] w-full mx-auto">
        <ScrollArea>
          <div className="max-w-[100vw]">
            <Button
              onClick={onClose}
              className="absolute top-0 right-5 rounded-full"
              variant="ghost"
            >
              <X size={16} />
            </Button>

            <FashionItemsContents
              onSelectItem={handlers.handleSelectItem}
              selectedItems={state.selectedItems}
            />

            {/* loaderRef要素のみ定義 */}
            <div ref={loaderRef} className="h-10" />
          </div>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
};

export default AddItemsDrawer;
