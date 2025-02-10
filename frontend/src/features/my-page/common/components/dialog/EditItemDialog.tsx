import IconButton from '@/components/elements/button/IconButton';
import BaseDialog from '@/components/elements/dialog/BaseDialog';
import LoadingElements from '@/components/elements/loading/LoadingElements';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useImage } from '@/context/ImageContext';
import CoordinateCanvasPageContent from '@/features/coordinate/components/contents/CoordinateCanvasPageContent';
import CoordinateEditorForm from '@/features/coordinate/components/form/CoordinateEditorForm';
import ItemEditorForm from '@/features/fashion-items/components/form/ItemEditorForm';
import type { InitialItems } from '@/features/my-page/coordinate/types';
import { useIsOpen } from '@/hooks/utils/useIsOpen';
import {
  fetchCoordinateMetaDataAPI,
  fetchCustomCoordinateInitialDataAPI,
} from '@/lib/api/coordinateApi';
import { fetchFashionMetaDataAPI } from '@/lib/api/fashionItemsApi';
import type { FashionItem, MetaDataType } from '@/types';
import type { BaseCoordinate, CoordinateMetaDataType, CoordinateType } from '@/types/coordinate';
import { Pen } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { UpdateItemTypes } from '../../types';

interface EditItemDialogProps<T extends FashionItem | BaseCoordinate> extends UpdateItemTypes<T> {
  category?: CoordinateType;
}

const EditItemDialog = <T extends FashionItem | BaseCoordinate>({
  type,
  item,
  onUpdate,
  category,
}: EditItemDialogProps<T>) => {
  const { isOpen, onClose, onToggle } = useIsOpen();
  const [metaData, setMetaData] = useState<MetaDataType | CoordinateMetaDataType | null>(null);
  const [initialItems, setInitialItems] = useState<InitialItems>();
  const [isLoading, setIsLoading] = useState(false);

  const { clearImage } = useImage();

  const isInitialized = useRef(false);

  // 初回マウント時のみclearImageを実行（previewに違う画像が表示されるのを防ぐため）
  useEffect(() => {
    if (!isInitialized.current) {
      clearImage();
      isInitialized.current = true;
    }
    // eslint警告無視（初回マウント時のみclearImageを実行したいだけのため）
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSuccess = (updatedItem: T) => {
    onUpdate(updatedItem);
    onClose();
  };

  const fetchMetaData = useCallback(async () => {
    if (!isOpen || metaData) return;

    setIsLoading(true);
    try {
      if (type === 'fashion-item') {
        const data = await fetchFashionMetaDataAPI();
        setMetaData(data);
      } else {
        const data = await fetchCoordinateMetaDataAPI();
        setMetaData(data);

        if (category === 'custom') {
          const items = await fetchCustomCoordinateInitialDataAPI((item as BaseCoordinate).id);
          setInitialItems(items);
        }
      }
    } catch (error) {
      console.error('Failed to fetch metadata:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isOpen, metaData, type, category, item]);

  useEffect(() => {
    fetchMetaData();
  }, [fetchMetaData]);

  return (
    <BaseDialog
      isOpen={isOpen}
      onToggle={onToggle}
      isCloseButtonLeft
      trigger={
        <IconButton
          Icon={Pen}
          label="編集"
          size="sm"
          variant="default"
          type="button"
          className="w-full"
        />
      }
      className="size-full !max-w-none !max-h-none p-0"
    >
      {isLoading ? (
        <LoadingElements message="データを取得中..." />
      ) : (
        metaData && (
          <ScrollArea className="px-5">
            {type === 'fashion-item' && (
              <ItemEditorForm
                metaData={metaData as MetaDataType}
                initialData={item as FashionItem}
                onSuccess={handleSuccess as (updatedItem: FashionItem) => void}
              />
            )}
            {type === 'coordinate' && (
              <>
                {category === 'photo' && (
                  <CoordinateEditorForm
                    metaData={metaData as CoordinateMetaDataType}
                    initialData={item as BaseCoordinate}
                    onSuccess={handleSuccess as (updatedItem: BaseCoordinate) => void}
                  />
                )}
                {category === 'custom' && (
                  <CoordinateCanvasPageContent
                    initialData={item as BaseCoordinate}
                    initialItems={initialItems}
                    onSuccess={handleSuccess as (updatedItem: BaseCoordinate) => void}
                  />
                )}
              </>
            )}
          </ScrollArea>
        )
      )}
    </BaseDialog>
  );
};

export default EditItemDialog;
