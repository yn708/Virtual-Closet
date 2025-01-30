'use client';

import { Input } from '@/components/ui/input';
import type { SearchInputProps } from '@/types';
import { Search, X } from 'lucide-react';

export const SearchInput = ({
  value,
  onChange,
  onClear,
  placeholder = '検索',
}: SearchInputProps) => {
  return (
    <div className="relative flex items-center w-full px-1 pt-2 pb-5">
      <span className="absolute left-5 text-gray-400">
        <Search className="size-4" />
      </span>

      <Input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="transition-all duration-200 px-10 py-5 rounded-full"
      />

      <span className="absolute right-3 text-gray-400 flex items-center gap-2">
        {value && onClear && (
          <button
            type="button"
            onClick={() => {
              onClear();
            }}
            className="hover:text-gray-600 focus:outline-none mr-3"
            aria-label="入力をクリア"
          >
            <X className="size-4" />
          </button>
        )}
      </span>
    </div>
  );
};
