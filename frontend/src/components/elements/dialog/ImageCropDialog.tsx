'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import type { ImageCropDialogProps } from '@/features/my-page/profile/types';
import { useImageCrop } from '@/hooks/image/useImageCrop';
import { Minus, Plus } from 'lucide-react';
import React from 'react';
import Cropper from 'react-easy-crop';

const ImageCropDialog: React.FC<ImageCropDialogProps> = ({
  open,
  onToggle,
  onClose,
  image,
  onCropComplete,
  aspect = 4 / 5,
  cropShape = 'rect',
}) => {
  const { crop, setCrop, zoom, setZoom, onCropCompleteCallback, createCroppedImage } = useImageCrop(
    {
      image,
      onCropComplete,
      onClose,
      cropShape,
    },
  );

  return (
    <Dialog open={open} onOpenChange={onToggle}>
      <DialogContent
        showClose={false}
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <div className="relative w-full max-h-screen h-96">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={cropShape === 'round' ? 1 : aspect}
            cropShape={cropShape}
            showGrid={true}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropCompleteCallback}
          />
        </div>
        <div className="flex justify-center items-center gap-2 mt-4 px-5">
          <Minus className="size-4" />
          {/* ズームレベルを調整するスライダー */}
          <Slider
            value={[zoom]}
            onValueChange={(value) => setZoom(value[0])}
            min={1}
            max={3}
            step={0.05}
            className="w-full"
          />
          <Plus className="size-4" />
        </div>
        <div className="mt-4 flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onClose}>
            キャンセル
          </Button>
          <Button onClick={createCroppedImage}>完了</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageCropDialog;
