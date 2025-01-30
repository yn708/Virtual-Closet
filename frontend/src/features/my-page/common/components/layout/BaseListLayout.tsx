import LoadingElements from '@/components/elements/loading/LoadingElements';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';
import EmptyState from '../contents/EmptyState';

interface BaseListLayoutProps<T> {
  items: T[];
  isInitialLoading: boolean;
  isLoadingMore: boolean;
  renderItem: (item: T) => React.ReactNode;
  hasMore?: boolean;
  onLoadMore?: () => void;
}

const BaseListLayout = <T extends { id: string }>({
  items,
  isInitialLoading,
  isLoadingMore,
  renderItem,
  hasMore,
  onLoadMore,
}: BaseListLayoutProps<T>) => {
  useInfiniteScroll({
    onLoadMore: onLoadMore || (() => {}),
    hasMore: !!hasMore,
    isLoading: !!isLoadingMore,
  });
  return isInitialLoading ? (
    <div className="min-h-[50vh] flex items-center justify-center p-4">
      <LoadingElements message="アイテムを取得中..." />
    </div>
  ) : !items?.length ? (
    <EmptyState />
  ) : (
    <>
      <div className="p-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 md:gap-4 max-w-screen-2xl mx-auto">
        {items.map((item) => renderItem(item))}
      </div>

      {hasMore && isLoadingMore && (
        <div className="flex justify-center p-4">
          <LoadingElements message="読み込み中..." />
        </div>
      )}
    </>
  );
};
export default BaseListLayout;
