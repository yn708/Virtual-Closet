'use client';
import IconButton from '@/components/elements/button/IconButton';
import { Accordion } from '@/components/ui/accordion';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useIsOpen } from '@/hooks/utils/useIsOpen';
import { IoMdAdd } from 'react-icons/io';
import AddItemSection from '../section/AddItemSection';
import CreateOutfitSection from '../section/CreateOutfitSection';

const AddFashionContentSheet = () => {
  const { isOpen, onClose, onToggle } = useIsOpen();

  return (
    <Sheet open={isOpen} onOpenChange={onToggle}>
      <SheetTrigger asChild>
        <IconButton
          Icon={IoMdAdd}
          label="Add"
          size="lg"
          showText={false}
          rounded={true}
          variant="ghost"
          className="bg-slate-100 dark:bg-slate-900"
        />
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[80vh]">
        <SheetHeader className="hidden">
          <SheetTitle>追加</SheetTitle>
          <SheetDescription>アイテム、コーディネート等を追加できます</SheetDescription>
        </SheetHeader>
        <div className="grid gap-6 p-6 text-left">
          <Accordion type="single" collapsible>
            {/* アイテム追加 */}
            <AddItemSection onClose={onClose} />
            {/* コーディネート追加 */}
            <CreateOutfitSection onClose={onClose} />
          </Accordion>
        </div>
      </SheetContent>
    </Sheet>
  );
};
export default AddFashionContentSheet;
