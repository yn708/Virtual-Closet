'use client';

import { useCoordinateCanvasState } from '@/context/CoordinateCanvasContext';
import { IMAGE_URL } from '@/utils/constants';
import { Maximize2, X } from 'lucide-react';
import Image from 'next/image';
import { useCoordinateCanvas } from '../../hooks/useCoordinateCanvas';

/**
 * コーディネートキャンバスコンポーネント
 * アイテムの配置・操作を可能にするインタラクティブなキャンバス領域
 */
const CoordinateCanvas = () => {
  // コンテキストから状態と操作ハンドラーを取得
  const { state, handlers: coordinateHandlers } = useCoordinateCanvasState();
  const { selectedItems, itemStyles, background } = state;
  const { handleUpdateStyles, handleRemoveItem } = coordinateHandlers;

  // カスタムフックからキャンバス操作ロジックを取得
  const { selectedItemId, isDragging, containerRef, setSelectedItemId, handlers } =
    useCoordinateCanvas(itemStyles, handleUpdateStyles);

  return (
    <div
      ref={containerRef}
      onClick={handlers.handleBackgroundClick}
      data-testid="coordinate-canvas"
      className={`relative aspect-[4/5] w-full max-w-[65vh] mx-auto ${background} shadow-lg overflow-hidden coordinate-canvas`}
    >
      {selectedItems?.map((item) => {
        const imageUrl = `${IMAGE_URL}${item.image.replace('http://backend:8000', '')}`;
        const style = itemStyles[item.id] || {
          zIndex: 0,
          scale: 1,
          rotate: 0,
          xPercent: 50,
          yPercent: 50,
        };
        const isSelected = selectedItemId === item.id;

        return (
          <div
            key={item.id}
            data-testid="draggable-element"
            className="draggable-element absolute cursor-move"
            style={handlers.getDisplayStyle(style)}
            onMouseDown={(e) => handlers.handleDragStart(e, item.id)}
            onTouchStart={(e) => handlers.handleDragStart(e, item.id)}
            onClick={(e) => {
              e.stopPropagation();
              // ドラッグ操作でない場合のみ選択状態を更新
              if (!isDragging) {
                setSelectedItemId(isSelected ? null : item.id);
                handlers.updateZIndex(item.id);
              }
            }}
          >
            {/* アイテム画像表示領域 */}
            <div className="relative w-full aspect-[4/5] z-0">
              <Image
                src={imageUrl}
                alt="item-image"
                fill
                className="object-contain select-none"
                draggable={false}
                unoptimized
              />
              {/* 選択時の操作UI */}
              {isSelected && (
                <div className="absolute inset-0 border-2 border-blue-500 rounded operation-ui">
                  {/* 削除ボタン */}
                  <button
                    data-testid="delete-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveItem(item.id);
                    }}
                    className="absolute -top-3 -left-3 p-1 bg-gray-500 rounded-full text-white hover:bg-gray-600 operation-ui"
                  >
                    <X size={16} />
                  </button>
                  {/* 変形操作ハンドル */}
                  <div
                    data-testid="transform-handle"
                    className="absolute -bottom-3 -right-3 p-1 bg-gray-500 border-2 rounded-full text-white cursor-move operation-ui"
                    onMouseDown={(e) => handlers.handleTransformStart(e, item.id)}
                    onTouchStart={(e) => handlers.handleTransformStart(e, item.id)}
                  >
                    <Maximize2 size={12} />
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CoordinateCanvas;
