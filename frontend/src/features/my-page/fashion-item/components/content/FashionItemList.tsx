import LoadingElements from '@/components/elements/loading/LoadingElements';
import type { FashionItemListProps } from '../../types';
import ItemImageDrawer from '../drawer/ItemImageDrawer';
import EmptyState from './EmptyState';

const FashionItemList = ({ items, isLoading, onDelete, onUpdate }: FashionItemListProps) => {
  return isLoading ? (
    <div className="min-h-[50vh] flex items-center justify-center p-4">
      <LoadingElements message="アイテムを取得中..." />
    </div>
  ) : !items?.length ? (
    <EmptyState />
  ) : (
    <div className="py-5 px-3 sm:px-8 md:px-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 max-w-screen-2xl mx-auto">
      {items.map((item) => (
        <ItemImageDrawer key={item.id} item={item} onDelete={onDelete} onUpdate={onUpdate} />
      ))}
    </div>
  );
};

export default FashionItemList;
