'use client';
import { useImage } from '@/context/ImageContext';

export default function CoordinateEditPage() {
  const { image } = useImage();
  console.log('image', image);

  return <div className="min-h-screen flex justify-center items-center">Coordinate Edit Page</div>;
}
