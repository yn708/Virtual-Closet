'use client';
import { useCoordinateCanvasState } from '@/context/CoordinateCanvasContext';
import type { InitialItemsProps } from '@/features/my-page/coordinate/types';
import type { CoordinateMetaDataType } from '@/types/coordinate';
import { useMemo } from 'react';
import { useCustomCoordinateForm } from '../../hooks/useCustomCoordinateForm';
import { usePreviewGeneration } from '../../hooks/usePreviewGeneration';
import type { CoordinateEditTypes } from '../../types';
import CoordinateEditorSelectFormFields from './field/CoordinateEditorSelectFormFields';

interface CustomCoordinateEditorFormProps extends InitialItemsProps, CoordinateEditTypes {
  metaData: CoordinateMetaDataType;
}

const CustomCoordinateEditorForm = ({
  metaData,
  initialData,
  initialItems,
  onSuccess,
}: CustomCoordinateEditorFormProps) => {
  const { state: canvasState } = useCoordinateCanvasState();
  const { selectedItems, itemStyles, background } = canvasState;
  const { state, formAction } = useCustomCoordinateForm({
    initialItems,
    initialData,
    onSuccess,
  });
  // 現在のアイテムデータを生成
  const itemsData = useMemo(
    () => ({
      items: selectedItems.map((item) => ({
        item: item.id,
        position_data: itemStyles[item.id],
      })),
      background,
    }),
    [selectedItems, itemStyles, background],
  );

  const { isProcessing } = usePreviewGeneration(itemsData, initialItems, initialData);

  const itemsJSON = JSON.stringify(itemsData);

  return (
    <form action={formAction} className="w-full">
      <input type="file" name="image" hidden />
      <input type="hidden" name="items" value={itemsJSON} />
      <CoordinateEditorSelectFormFields
        metaData={metaData}
        isProcessing={isProcessing}
        state={state}
        initialData={initialData}
      />
    </form>
  );
};

export default CustomCoordinateEditorForm;
