'use client';

import { BACKEND_URL } from '@/utils/constants';
import { X } from 'lucide-react';
import Image from 'next/image';
import { CgArrowsExpandLeft } from 'react-icons/cg';
import type { DraggableItemProps } from '../../types';

const DraggableItem: React.FC<DraggableItemProps> = ({
  item,
  style,
  isSelected,
  onSelect,
  onRemove,
  onDragStart,
  onTransformStart,
}) => {
  const imageUrl = `${BACKEND_URL}${item.image.replace('http://backend:8000', '')}`;

  return (
    <div
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
      onMouseDown={onDragStart}
      onTouchStart={onDragStart}
      onClick={onSelect}
    >
      <div className="relative flex items-center justify-center">
        <Image
          src={imageUrl}
          alt="item-image"
          width={160}
          height={160}
          className="object-contain select-none"
          draggable={false}
        />
        {isSelected && (
          <div className="absolute inset-0 border-2 border-blue-500 rounded operation-ui">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              className="absolute -top-3 -left-3 p-1 bg-gray-500 rounded-full text-white hover:bg-gray-600 operation-ui"
            >
              <X size={16} />
            </button>
            <div
              className="absolute -bottom-3 -right-3 p-1 bg-gray-500 border-2 rounded-full text-white cursor-move operation-ui"
              onMouseDown={onTransformStart}
              onTouchStart={onTransformStart}
            >
              <CgArrowsExpandLeft size={12} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DraggableItem;
