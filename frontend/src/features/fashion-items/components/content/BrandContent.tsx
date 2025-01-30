'use client';

import { SearchInput } from '@/components/elements/form/input/SearchInput';
import LoadingElements from '@/components/elements/loading/LoadingElements';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useBrandSearch } from '../../hooks/useBrandSearch';
import type { BrandContentProps } from '../../types';
import BrandList from '../list/BrandList';

const BrandContent = ({ selectedValue, onValueChange, initialOptions }: BrandContentProps) => {
  const { searchTerm, setSearchTerm, isLoading, searchResults } = useBrandSearch();

  return (
    <>
      <div className="sticky top-0 z-10 py-2">
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="ブランド検索"
          onClear={() => setSearchTerm('')}
        />
      </div>
      <ScrollArea className="flex-1">
        <div className="px-1">
          {isLoading ? (
            <LoadingElements message="検索中..." containerClassName="pt-5" />
          ) : searchTerm.length > 0 ? (
            <BrandList
              selectedValue={selectedValue}
              onValueChange={onValueChange}
              brands={searchResults}
              emptyMessage="ブランドが見つかりません"
              label="検索結果"
            />
          ) : (
            <BrandList
              selectedValue={selectedValue}
              onValueChange={onValueChange}
              brands={initialOptions}
              label="人気のブランド"
            />
          )}
        </div>
      </ScrollArea>
    </>
  );
};

export default BrandContent;
