import type { InitialItems } from '@/features/my-page/coordinate/types';
import { generatePreviewImage } from '@/utils/imageUtils';
import { useEffect, useMemo, useState } from 'react';
import type { CoordinateEditTypes, ItemStyle } from '../types';

interface ItemsData {
  items: { item: string | number; position_data: ItemStyle }[];
  background: string;
}

export const usePreviewGeneration = (
  itemsData: ItemsData,
  initialItems?: InitialItems,
  initialData?: CoordinateEditTypes['initialData'],
) => {
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // アイテムの配置が変更されたかチェック
  const hasChanges = useMemo(() => {
    if (!initialItems) return true;
    // 背景の変更をチェック
    if (itemsData.background !== initialItems.background) return true;
    // アイテム数の変更をチェック
    if (itemsData.items.length !== initialItems.items.length) return true;
    // 各アイテムの変更をチェック
    return itemsData.items.some((current, index) => {
      const initial = initialItems.items[index];
      if (String(current.item) !== String(initial.item_id)) return true;

      const currentPos = current.position_data;
      const initialPos = initial.position_data;

      return Object.entries(currentPos).some(
        ([key, value]) => value !== initialPos[key as keyof ItemStyle],
      );
    });
  }, [itemsData, initialItems]);
  // プレビュー画像生成処理
  useEffect(() => {
    const generatePreview = async () => {
      if (!hasChanges) {
        // 変更がない場合は初期画像を使用
        if (initialData?.image) {
          const imageInput = document.querySelector('input[type="file"]') as HTMLInputElement;
          if (imageInput) {
            imageInput.value = ''; // 既存の値をクリア
          }
        }
        return;
      }
      // 変更がある場合のみプレビュー画像を生成
      setIsProcessing(true);
      try {
        const canvasElement = document.querySelector('.coordinate-canvas') as HTMLElement;
        await generatePreviewImage(canvasElement);
      } catch (error) {
        console.error('Failed to generate preview:', error);
      } finally {
        setIsProcessing(false);
      }
    };

    generatePreview();
  }, [hasChanges, initialData, setIsProcessing]);

  return { isProcessing };
};
