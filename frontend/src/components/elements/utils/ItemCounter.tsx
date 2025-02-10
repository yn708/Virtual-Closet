'use client';

import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { useIsOpen } from '@/hooks/utils/useIsOpen';
import { useItemCounter } from '@/hooks/utils/useItemCounter';
import { Info } from 'lucide-react';
import BaseDialog from '../dialog/BaseDialog';
import LoadingElements from '../loading/LoadingElements';

interface CounterItemProps {
  title: string;
  current: number;
  max: number;
}

const ItemCounter = () => {
  const { isOpen, onClose, onToggle } = useIsOpen();
  const { count, isLoading } = useItemCounter(isOpen);

  return (
    <div className="inline-flex items-center text-sm text-muted-foreground float-end pr-2">
      <BaseDialog
        isOpen={isOpen}
        onToggle={onToggle}
        trigger={
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <Info className="size-4 mr-2" />
            <p className="text-xs">アイテム登録情報を確認</p>
          </Button>
        }
        title="登録アイテム数"
        description=""
        className="p-10"
        headerClassName="mb-5"
      >
        {isLoading ? (
          <LoadingElements />
        ) : (
          <div className="space-y-6 mb-5">
            <CounterItem
              title="ファッションアイテム"
              current={count.fashion?.current_count as number}
              max={count.fashion?.max_items as number}
            />
            <CounterItem
              title="コーディネート"
              current={count.coordinate?.current_count as number}
              max={count.coordinate?.max_items as number}
            />
          </div>
        )}
        <DialogFooter>
          <div className="flex justify-end">
            <Button onClick={onClose} variant="outline">
              閉じる
            </Button>
          </div>
        </DialogFooter>
      </BaseDialog>
    </div>
  );
};

const CounterItem = ({ title, current, max }: CounterItemProps) => (
  <div className="space-y-2">
    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">{title}</h3>
    <div className="flex items-center">
      <div className="grow mr-4">
        <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
          <div
            className="h-full rounded-full bg-blue-500 dark:bg-blue-400 transition-all duration-500 ease-in-out"
            style={{ width: `${(current / max) * 100}%` }}
          />
        </div>
      </div>
      <div className="flex items-baseline shrink-0">
        <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">{current}</span>
        <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">/{max}</span>
      </div>
    </div>
  </div>
);

export default ItemCounter;
