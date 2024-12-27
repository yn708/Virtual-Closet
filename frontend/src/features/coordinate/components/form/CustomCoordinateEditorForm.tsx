'use client';
import type { FashionItem } from '@/types';
import { initialState } from '@/utils/data/initialState';
import { generatePreviewImage } from '@/utils/imageUtils';
import { useEffect, useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import type { CoordinateEditorFormProps, ItemStyle } from '../../types';
import CoordinateEditorSelectFormFields from './field/CoordinateEditorSelectFormFields';
import { customCoordinateCreateAction } from '@/lib/actions/outfit/customCoordinateCreateAction';

interface ExtendedCoordinateEditorFormProps extends CoordinateEditorFormProps {
  selectedItems: FashionItem[];
  itemStyles: Record<string, ItemStyle>;
}

const CustomCoordinateEditorForm = ({
  metaData,
  selectedItems,
  itemStyles,
}: ExtendedCoordinateEditorFormProps) => {
  const [state, formAction] = useFormState(customCoordinateCreateAction, initialState);
  const { pending } = useFormStatus();
  const [isProcessing, setIsProcessing] = useState<boolean>(false); // プレビュー画像生成中のプロセス

  // 使用アイテムとその位置情報
  const itemsData = selectedItems.map((item) => ({
    item: item.id, // itemのIDを送信
    position_data: itemStyles[item.id], // 位置データをそのまま使用
  }));

  const itemsJSON = JSON.stringify(itemsData);

  // プレビュー画像生成処理
  useEffect(() => {
    const generatePreview = async () => {
      if (selectedItems.length > 0) {
        setIsProcessing(true);
        try {
          const canvasElement = document.querySelector('.coordinate-canvas') as HTMLElement;
          await generatePreviewImage(canvasElement);
        } catch (error) {
          console.error(error);
          setIsProcessing(false);
        } finally {
          setIsProcessing(false);
        }
      }
    };

    generatePreview();
  }, [selectedItems]);

  return (
    <form action={formAction} className="w-full">
      <input type="file" name="preview_image" hidden />
      <input type="hidden" name="items" value={itemsJSON} />
      <CoordinateEditorSelectFormFields
        metaData={metaData}
        isProcessing={isProcessing || pending}
        state={state}
      />
    </form>
  );
};

export default CustomCoordinateEditorForm;
