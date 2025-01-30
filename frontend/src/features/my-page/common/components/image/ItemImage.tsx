import type { ClassNameType } from '@/types';
import Image from 'next/image';

interface ItemImageProps extends ClassNameType {
  src: string;
}

const ItemImage = ({ src, className }: ItemImageProps) => (
  <div className={`relative w-full aspect-[4/5] overflow-hidden ${className}`}>
    <Image
      src={src}
      alt="アイテム画像"
      fill
      className="object-contain transition-all duration-300 group-hover:scale-105 p-2"
      priority={false}
    />
  </div>
);

export default ItemImage;
