import LoadingElements from '@/components/elements/loading/LoadingElements';
import EmptyState from '../contents/EmptyState';

interface BaseListLayoutProps<T> {
  items: T[];
  isLoading?: boolean;
  renderItem: (item: T) => React.ReactNode;
}

const BaseListLayout = <T extends { id: string }>({
  items,
  isLoading,
  renderItem,
}: BaseListLayoutProps<T>) => {
  return isLoading ? (
    <div className="min-h-[50vh] flex items-center justify-center p-4">
      <LoadingElements message="アイテムを取得中..." />
    </div>
  ) : !items?.length ? (
    <EmptyState />
  ) : (
    <div className="p-2 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 md:gap-4 max-w-screen-2xl mx-auto">
      {items.map((item) => renderItem(item))}
    </div>
  );
};
export default BaseListLayout;
