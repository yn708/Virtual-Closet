import type { CountData } from '@/types';
import { Info } from 'lucide-react';

const ItemCounter = ({ countData }: CountData) => {
  return (
    <div className="inline-flex items-center text-sm text-muted-foreground float-end pr-2">
      <Info className="size-4 mr-2" />
      <p className="text-xs text-muted-foreground">
        {countData.current_count} / {countData.max_items} (アイテム数)
      </p>
    </div>
  );
};

export default ItemCounter;
