'use client';

import type { CanvasState, ItemStyle } from '@/features/coordinate/types';
import type { InitialItemsProps } from '@/features/my-page/coordinate/types';
import type {
  ChildrenType,
  CoordinateCanvasContextHandlers,
  CoordinateCanvasContextValue,
  FashionItem,
} from '@/types';
import { DEFAULT_POSITION, INITIAL_POSITIONS } from '@/utils/data/canvasInitialPositions';
import { createContext, useCallback, useContext, useState } from 'react';

// コンテキストの作成
const CoordinateCanvasContext = createContext<CoordinateCanvasContextValue | undefined>(undefined);

/**
 * コーディネートキャンバスの状態管理を提供するProvider
 */
export const CoordinateCanvasStateProvider = ({
  children,
  initialItems,
}: ChildrenType & InitialItemsProps) => {
  // initialItemsからデータを変換
  const initialState = (() => {
    if (!initialItems?.items) {
      return {
        selectedItems: [] as FashionItem[],
        itemStyles: {},
        background: 'bg-white',
      };
    }
    // 選択されたアイテムの配列を作成
    const selectedItems = initialItems.items.map((item) => ({
      id: String(item.item_id),
      image: item.image,
    })) as FashionItem[];

    // アイテムスタイルのマッピングを作成
    const itemStyles = initialItems.items.reduce(
      (acc, item) => ({
        ...acc,
        [item.item_id]: {
          scale: item.position_data.scale,
          rotate: item.position_data.rotate,
          zIndex: item.position_data.zIndex,
          xPercent: item.position_data.xPercent,
          yPercent: item.position_data.yPercent,
        },
      }),
      {},
    );

    return {
      selectedItems,
      itemStyles,
      background: initialItems.background || 'bg-white',
    };
  })();

  const [state, setState] = useState<CanvasState>(initialState); // キャンバスの状態を管理

  // カテゴリーに基づく初期位置の取得
  const getInitialPositionByCategory = useCallback((category: string) => {
    return INITIAL_POSITIONS[category] || DEFAULT_POSITION;
  }, []);

  // ハンドラーの定義
  const handlers: CoordinateCanvasContextHandlers = {
    // アイテム選択のトグル処理
    handleSelectItem: useCallback(
      (item: FashionItem) => {
        setState((prev) => {
          // 既存アイテムのインデックスを検索
          const existingItemIndex = prev.selectedItems.findIndex(
            (prevItem) => String(prevItem.id) === String(item.id),
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
                zIndex: maxZIndex + 1,
              },
            },
          };
        });
      },
      [getInitialPositionByCategory],
    ),

    // 特定のアイテムを削除
    handleRemoveItem: useCallback((itemId: string) => {
      setState((prev) => {
        const newItemStyles = { ...prev.itemStyles };
        delete newItemStyles[itemId];

        return {
          ...prev,
          selectedItems: prev.selectedItems.filter((item) => item.id !== itemId),
          itemStyles: newItemStyles,
        };
      });
    }, []),

    // アイテムのスタイルを一括更新
    handleUpdateStyles: useCallback((newStyles: Record<string, ItemStyle>) => {
      setState((prev) => ({
        ...prev,
        itemStyles: newStyles,
      }));
    }, []),

    // キャンバスをリセット
    handleFullReset: useCallback(() => {
      setState((prev) => ({
        ...prev,
        selectedItems: [],
        itemStyles: {},
      }));
    }, []),

    // 背景色を変更
    handleBackgroundChange: useCallback((background: string) => {
      setState((prev) => ({
        ...prev,
        background,
      }));
    }, []),
  };

  return (
    <CoordinateCanvasContext.Provider
      value={{
        state,
        handlers,
      }}
    >
      {children}
    </CoordinateCanvasContext.Provider>
  );
};

/**
 * コーディネートコンテキストを使用するためのカスタムフック
 */
export const useCoordinateCanvasState = () => {
  const context = useContext(CoordinateCanvasContext);

  if (!context) {
    throw new Error('useCoordinate must be used within a CoordinateProvider');
  }

  return context;
};
