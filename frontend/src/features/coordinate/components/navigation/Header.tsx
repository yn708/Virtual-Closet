'use client';
import IconLink from '@/components/elements/link/IconLink';

import { useCoordinateCanvasState } from '@/context/CoordinateCanvasContext';
import { FashionItemsProvider } from '@/context/FashionItemsContext';
import type { InitialItemsProps } from '@/features/my-page/coordinate/types';
import { fetchCoordinateMetaDataAPI } from '@/lib/api/coordinateApi';
import type { CoordinateMetaDataType } from '@/types/coordinate';
import { TOP_URL } from '@/utils/constants';
import { ChevronRight, CircleAlert } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import type { CoordinateEditTypes } from '../../types';
import FormDialog from '../dialog/FormDialog';

const Header: React.FC<InitialItemsProps & CoordinateEditTypes> = ({
  initialData,
  initialItems,
  onSuccess,
}) => {
  const { state } = useCoordinateCanvasState();
  const [isLoading, setIsLoading] = useState(false);
  const [metaData, setMetaData] = useState<CoordinateMetaDataType | null>(null);

  // メタデータ取得トリガー
  const fetchMetaData = useCallback(async () => {
    if (metaData) return;

    setIsLoading(true);
    try {
      const data = await fetchCoordinateMetaDataAPI();
      setMetaData(data);
    } catch (error) {
      console.error('Failed to fetch metadata:', error);
    } finally {
      setIsLoading(false);
    }
  }, [metaData]);

  useEffect(() => {
    fetchMetaData();
  }, [fetchMetaData]);

  return (
    <FashionItemsProvider>
      <div
        className={`flex items-center ${initialData ? 'justify-end' : 'justify-between'}  pb-5 pt-2 w-full px-2`}
      >
        {!initialData && (
          <IconLink
            href={TOP_URL}
            Icon={ChevronRight}
            label="トップへ戻る"
            size="sm"
            rounded={true}
            className="text-xs md:text-sm !gap-1 text-gray-700 dark:text-gray-300 py-2 px-3 underline-offset-4 hover:underline"
            iconClassName="rotate-180"
          />
        )}

        {/* フォーム */}
        {state.selectedItems && state.selectedItems?.length >= 2 ? (
          <FormDialog
            metaData={metaData}
            isLoading={isLoading}
            initialData={initialData}
            initialItems={initialItems}
            onSuccess={onSuccess}
          />
        ) : (
          <>
            <div className="flex justify-center items-center gap-2 text-gray-500 dark:text-gray-300">
              <CircleAlert className="size-5" />
              <p className="text-xs">アイテムは2個以上選択する必要があります（10個まで）</p>
            </div>
          </>
        )}
      </div>
    </FashionItemsProvider>
  );
};

export default Header;
