import { SearchX } from 'lucide-react';

const EmptyState = () => (
  <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4 p-8">
    <SearchX className="size-12 text-gray-400" />
    <div className="text-center">
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
        アイテムが見つかりませんでした
      </h3>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        別のカテゴリーを選択してください
      </p>
    </div>
  </div>
);
export default EmptyState;
