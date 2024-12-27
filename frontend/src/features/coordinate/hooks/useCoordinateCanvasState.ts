'use client';

import type { FashionItem } from '@/types';
import { DEFAULT_POSITION, INITIAL_POSITIONS } from '@/utils/data/canvasInitialPositions';
import { useCallback, useState } from 'react';
import type { CanvasState, ItemStyle } from '../types';

/**
 * コーディネートキャンバスの状態管理とロジックを扱うカスタムフック
 */
export const useCoordinateCanvasState = () => {
  // キャンバスの全体的な状態を管理
  const [state, setState] = useState<CanvasState>({
    selectedItems: [], // 選択したアイテム
    itemStyles: {}, // アイテムの位置情報等
    background: 'bg-white', // キャンバス背景色
  });

  // カテゴリーに基づいて初期位置を取得
  const getInitialPositionByCategory = useCallback((category: string) => {
    return INITIAL_POSITIONS[category] || DEFAULT_POSITION;
  }, []);

  // アイテム選択のトグル処理
  const handleSelectItem = useCallback(
    (item: FashionItem) => {
      setState((prev) => {
        // 既存アイテムのインデックスを検索
        const existingItemIndex = prev.selectedItems.findIndex(
          (prevItem) => prevItem.id === item.id,
        );

        // アイテムが既に選択されている場合は削除
        if (existingItemIndex !== -1) {
          const newItemStyles = { ...prev.itemStyles };
          delete newItemStyles[item.id];

          return {
            ...prev,
            selectedItems: prev.selectedItems.filter((_, index) => index !== existingItemIndex),
            itemStyles: newItemStyles,
          };
        }

        // 新規アイテムの追加処理
        const initialPosition = getInitialPositionByCategory(item.sub_category.category);
        const maxZIndex = Math.max(
          ...Object.values(prev.itemStyles).map((style) => style.zIndex || 0),
          0,
        );

        return {
          ...prev,
          selectedItems: [...prev.selectedItems, item],
          itemStyles: {
            ...prev.itemStyles,
            [item.id]: {
              ...initialPosition,
              scale: 1,
              rotate: 0,
              zIndex: maxZIndex + 1, // 新規アイテムを最前面に配置
            },
          },
        };
      });
    },
    [getInitialPositionByCategory],
  );

  // 特定のアイテムを削除
  const handleRemoveItem = useCallback((itemId: string) => {
    setState((prev) => {
      const newItemStyles = { ...prev.itemStyles };
      delete newItemStyles[itemId];

      return {
        ...prev,
        selectedItems: prev.selectedItems.filter((item) => item.id !== itemId),
        itemStyles: newItemStyles,
      };
    });
  }, []);

  // アイテムのスタイルを一括更新
  const handleUpdateStyles = useCallback((newStyles: Record<string, ItemStyle>) => {
    setState((prev) => ({
      ...prev,
      itemStyles: newStyles,
    }));
  }, []);

  // キャンバスをリセット
  const handleFullReset = useCallback(() => {
    setState((prev) => ({
      ...prev,
      selectedItems: [],
      itemStyles: {},
    }));
  }, []);

  // 背景色を変更
  const handleBackgroundChange = useCallback((background: string) => {
    setState((prev) => ({
      ...prev,
      background,
    }));
  }, []);

  return {
    state,
    handlers: {
      handleSelectItem,
      handleRemoveItem,
      handleUpdateStyles,
      handleFullReset,
      handleBackgroundChange,
    },
  };
};
