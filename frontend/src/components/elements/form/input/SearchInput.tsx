'use client';

import { Input } from '@/components/ui/input';
import type { SearchInputProps } from '@/types';
import { CiSearch } from 'react-icons/ci';
import { IoClose } from 'react-icons/io5';

export const SearchInput = ({
  value,
  onChange,
  onClear,
  placeholder = '検索',
}: SearchInputProps) => {
  return (
    <div className="relative flex items-center w-full px-1 pt-2 pb-5">
      <span className="absolute left-3 text-gray-400">
        <CiSearch className="size-5" />
      </span>

      <Input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="transition-all duration-200 px-6 py-5 rounded-full"
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
            <IoClose className="size-4" />
          </button>
        )}
      </span>
    </div>
  );
};
