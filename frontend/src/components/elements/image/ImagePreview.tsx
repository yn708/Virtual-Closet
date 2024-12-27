import Image from 'next/image';
import React from 'react';

interface ImagePreviewProps {
  src: string;
  alt?: string;
  onChangeClick?: () => void;
  handleToggleImage?: () => void;
  isShowingRemovedBg: boolean;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({ src, alt = 'Preview' }) => (
  <div className="md:w-full w-40 mx-auto">
    <div className="relative group max-w-2xl mx-auto h-40 md:h-96 bg-gray-50 rounded-lg overflow-hidden">
      <Image
        src={src}
        alt={alt}
        fill
        style={{ objectFit: 'contain' }}
        priority
        className="transition-opacity duration-200"
      />
    </div>
  </div>
);
