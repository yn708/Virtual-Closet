'use client';
import IconButton from '@/components/elements/button/IconButton';
import { Accordion } from '@/components/ui/accordion';

import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { useIsOpen } from '@/hooks/utils/useIsOpen';
import { IoMdAdd } from 'react-icons/io';
import AddItemSection from '../section/AddItemSection';
import CreateOutfitSection from '../section/CreateOutfitSection';

const AddFashionContentDrawer = () => {
  const { isOpen, onClose, onToggle } = useIsOpen();

  return (
    <Drawer open={isOpen} onOpenChange={onToggle}>
      <DrawerTrigger>
        <IconButton
          Icon={IoMdAdd}
          label="Add"
          size="lg"
          showText={false}
          rounded={true}
          variant="ghost"
          className="bg-slate-100 dark:bg-slate-900"
        />
      </DrawerTrigger>
      <DrawerContent className="h-[60vh]">
        <DrawerHeader className="hidden">
          <DrawerTitle />
          <DrawerDescription />
        </DrawerHeader>

        <div className="grid gap-6 p-6 text-left">
          <Accordion type="single" collapsible>
            {/* アイテム追加 */}
            <AddItemSection onClose={onClose} />
            {/* コーディネート追加 */}
            <CreateOutfitSection onClose={onClose} />
          </Accordion>
        </div>

        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="ghost" className="w-full">
              閉じる
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
export default AddFashionContentDrawer;
