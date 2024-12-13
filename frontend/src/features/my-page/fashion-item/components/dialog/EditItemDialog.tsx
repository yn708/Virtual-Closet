import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import ItemEditorForm from '@/features/fashion-items/components/form/ItemEditorForm';
import { fetchFashionMetaDataAPI } from '@/lib/api/fashionItemsApi';
import type { FashionItem, MetaDataType } from '@/types';

import LoadingElements from '@/components/elements/loading/LoadingElements';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useIsOpen } from '@/hooks/utils/useIsOpen';
import { useCallback, useEffect, useState } from 'react';
import type { EditItemDialogProps } from '../../types';

const EditItemDialog = ({ children, item, onUpdate }: EditItemDialogProps) => {
  const { isOpen, onClose, onToggle } = useIsOpen();
  const [metaData, setMetaData] = useState<MetaDataType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const handleSuccess = (updatedItem: FashionItem) => {
    onUpdate(updatedItem);
    onClose();
  };

  const fetchMetaData = useCallback(async () => {
    if (!isOpen) return;
    if (metaData) return;

    setIsLoading(true);
    try {
      const data = await fetchFashionMetaDataAPI();
      setMetaData(data);
    } catch (error) {
      console.error('Failed to fetch metadata:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isOpen, metaData]);

  useEffect(() => {
    fetchMetaData();
  }, [fetchMetaData]);

  return (
    <Dialog open={isOpen} onOpenChange={onToggle}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="size-full !max-w-none !max-h-none">
        <DialogHeader className="hidden">
          <DialogTitle />
          <DialogDescription />
        </DialogHeader>
        {isLoading ? (
          <LoadingElements message="データを取得中..." />
        ) : metaData ? (
          <ScrollArea className="px-5">
            <ItemEditorForm metaData={metaData} initialData={item} onSuccess={handleSuccess} />
          </ScrollArea>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};

export default EditItemDialog;
