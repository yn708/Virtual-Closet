'use client';

import { useCoordinateCanvasState } from '@/context/CoordinateCanvasContext';
import { IMAGE_URL } from '@/utils/constants';
import { Maximize2, X } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useRef } from 'react';
import { useCoordinateCanvas } from '../../hooks/useCoordinateCanvas';

/**
 * アイテムのドラッグ&ドロップ、回転、拡大縮小などの操作が可能なキャンバスを提供
 */
const CoordinateCanvas = () => {
  const { state, handlers: coordinateHandlers } = useCoordinateCanvasState();
  const { selectedItems, itemStyles, background } = state;
  const { handleUpdateStyles, handleRemoveItem } = coordinateHandlers;

  const containerRef = useRef<HTMLDivElement>(null); // キャンバス要素への参照

  // カスタムフックから状態とハンドラーを取得
  const { selectedItemId, isDragging, handlers } = useCoordinateCanvas(
    itemStyles,
    handleUpdateStyles,
  );

  // アイテムの選択を解除する
  const handleBackgroundClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        handlers.setSelectedItemId(null);
      }
    },
    [handlers],
  );

  return (
    <div
      ref={containerRef}
      onClick={handleBackgroundClick}
      data-testid="coordinate-canvas"
      className={`relative aspect-[4/5] w-full max-w-[65vh] mx-auto ${background} shadow-lg overflow-hidden coordinate-canvas`}
    >
      {selectedItems?.map((item) => {
        // アイテムごとの表示設定
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
            style={{
              position: 'absolute',
              left: `${style.xPercent}%`,
              top: `${style.yPercent}%`,
              transform: `translate(-50%, -50%) scale(${style.scale}) rotate(${style.rotate}deg)`,
              transformOrigin: 'center',
              zIndex: style.zIndex || 0,
              touchAction: 'none',
              width: '160px',
              height: '160px',
            }}
            onMouseDown={(e) => handlers.handleDragStart(e, item.id, containerRef)}
            onTouchStart={(e) => handlers.handleDragStart(e, item.id, containerRef)}
            onClick={(e) => {
              e.stopPropagation();
              if (!isDragging) {
                handlers.setSelectedItemId(isSelected ? null : item.id);
                handlers.updateZIndex(item.id);
              }
            }}
          >
            {/* アイテムの画像とUI要素 */}
            <div className="relative flex items-center justify-center">
              <Image
                src={imageUrl}
                alt="item-image"
                width={160}
                height={160}
                className="object-contain select-none"
                draggable={false}
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
                  {/* 変形（回転・拡大縮小）ハンドル */}
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
