import LoadingElements from '@/components/elements/loading/LoadingElements';
import { Button } from '@/components/ui/button';
import { SheetClose } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import type { BrandListProps } from '../../types';

export default function BrandList({
  brands,
  isLoading,
  emptyMessage = 'ブランドが見つかりません',
  selectedValue,
  onValueChange,
  label,
}: BrandListProps) {
  if (isLoading) {
    return <LoadingElements message="読み込み中" />;
  }

  if (brands?.length === 0) {
    return <div>{emptyMessage}</div>;
  }

  return (
    <div>
      {label && <h1 className="font-medium mb-4">{label}</h1>}
      <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-2">
        {brands?.map((brand) => (
          <SheetClose asChild key={brand.id}>
            <Button
              variant="outline"
              className={cn(
                'flex flex-col justify-center items-start h-auto',
                selectedValue === brand.id.toString() && 'border-2 border-primary bg-primary/5',
              )}
              onClick={() => onValueChange(brand)}
            >
              <span className="font-medium">{brand.brand_name}</span>
              <span className="text-[10px] text-gray-500 opacity-70">{brand.brand_name_kana}</span>
            </Button>
          </SheetClose>
        ))}
        <SheetClose asChild>
          <Button
            variant="outline"
            className="justify-center bg-gray-50 dark:bg-gray-950"
            onClick={() => onValueChange('')}
          >
            未選択
          </Button>
        </SheetClose>
      </div>
    </div>
  );
}
