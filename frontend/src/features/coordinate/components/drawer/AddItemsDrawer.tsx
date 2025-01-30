import IconButton from '@/components/elements/button/IconButton';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useCoordinateCanvasState } from '@/context/CoordinateCanvasContext';
import FashionItemsContents from '@/features/my-page/fashion-item/components/content/FashionItemsContents';
import { useIsOpen } from '@/hooks/utils/useIsOpen';
import { Shirt, X } from 'lucide-react';
import { useEffect } from 'react';

const AddItemsDrawer = () => {
  const { state, handlers } = useCoordinateCanvasState();

  const { isOpen, setIsOpen, onClose, onToggle } = useIsOpen();

  useEffect(() => {
    if (state.selectedItems?.length === 0) {
      setIsOpen(true);
    }
  }, [state.selectedItems?.length, setIsOpen]);

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
          </div>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
};

export default AddItemsDrawer;
