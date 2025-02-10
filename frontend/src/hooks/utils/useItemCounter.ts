import { fetchCoordinateCountAPI } from '@/lib/api/coordinateApi';
import { fetchFashionCountAPI } from '@/lib/api/fashionItemsApi';
import type { CountDataType } from '@/types';
import { useEffect, useState } from 'react';

export const useItemCounter = (isOpen: boolean) => {
  const [count, setCount] = useState<{
    coordinate: CountDataType | null;
    fashion: CountDataType | null;
  }>({
    coordinate: null,
    fashion: null,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) return; // Dialog が開いていないときはフェッチしない

    const fetchCounts = async () => {
      try {
        setIsLoading(true);
        const [coordinateData, fashionData] = await Promise.all([
          fetchCoordinateCountAPI(),
          fetchFashionCountAPI(),
        ]);
        setCount({ coordinate: coordinateData, fashion: fashionData });
        setIsLoading(false);
      } catch (error) {
        console.error('データの取得に失敗しました:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCounts();
  }, [isOpen]); // isOpen が true になったときに実行
  return { count, isLoading };
};
