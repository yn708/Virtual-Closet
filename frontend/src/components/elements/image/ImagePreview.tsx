import { Button } from '@/components/ui/button';
import Image from 'next/image';
import React from 'react';

interface ImagePreviewProps {
  src: string;
  alt?: string;
  onChangeClick?: () => void;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({
  src,
  alt = 'Preview',
  onChangeClick,
}) => (
  <div className="md:w-full w-40 mx-auto">
    <div className="relative group max-w-2xl mx-auto h-40 md:h-96">
      <Image src={src} alt={alt} fill style={{ objectFit: 'contain' }} priority />
      {onChangeClick && (
        <Button
          type="button"
          onClick={onChangeClick}
          variant="secondary"
          className="absolute bottom-4 right-4"
          size="sm"
        >
          変更
        </Button>
      )}
    </div>
  </div>
);
