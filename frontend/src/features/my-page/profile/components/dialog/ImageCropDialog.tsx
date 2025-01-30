'use client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { Minus, Plus } from 'lucide-react';
import React from 'react';
import Cropper from 'react-easy-crop';
import { useImageCrop } from '../../hooks/useImageCrop';
import type { ImageCropDialogProps } from '../../types';

const ImageCropDialog: React.FC<ImageCropDialogProps> = ({
  open,
  onClose,
  image,
  onCropComplete,
}) => {
  const { crop, setCrop, zoom, setZoom, onCropCompleteCallback, createCroppedImage } = useImageCrop(
    { image, onCropComplete, onClose },
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <div className="relative w max-h-screen h-96">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropCompleteCallback}
          />
        </div>
        <div className="flex justify-center items-center gap-2 mt-4">
          <Minus className="size-4" />
          {/* ズームレベルを調整するスライダー */}
          <Slider
            value={[zoom]}
            onValueChange={(value) => setZoom(value[0])}
            min={1}
            max={3}
            step={0.05}
          />
          <Plus className="size-4" />
        </div>
        <div className="mt-4 flex justify-end space-x-2">
          <Button onClick={createCroppedImage}>完了</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageCropDialog;
