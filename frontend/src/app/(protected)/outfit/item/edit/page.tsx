// 画像が表示されるか確認
'use client';
import { useImage } from '@/context/ImageContext';
import Image from 'next/image';

export default function ItemEditPage() {
  const { preview, isProcessing } = useImage();

  if (!preview) {
    return null;
  }

  return (
    <div className="min-h-screen flex justify-center items-center relative">
      {isProcessing && (
        <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
          <div className="text-white">画像を処理中...</div>
        </div>
      )}
      <Image
        src={preview}
        alt="Preview"
        layout="fill"
        objectFit="contain"
        className="rounded-lg shadow-md transition duration-300 ease-in-out group-hover:opacity-75"
      />
    </div>
  );
}
