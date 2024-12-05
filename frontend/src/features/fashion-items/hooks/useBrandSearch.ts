import useDebounce from '@/hooks/utils/useDebounce';
import { searchBrandsAPI } from '@/lib/api/fashionItemsApi';
import type { Brand } from '@/types';
import { CACHE_DURATION, MIN_SEARCH_LENGTH } from '@/utils/constants';
import { useCallback, useEffect, useRef, useState } from 'react';

interface CacheItem {
  results: Brand[];
  timestamp: number;
}

export const useBrandSearch = () => {
  const [searchTerm, setSearchTerm] = useState(''); // 検索文字列の状態
  const [isLoading, setIsLoading] = useState(false); // 検索中のローディング状態
  const [searchResults, setSearchResults] = useState<Brand[]>([]); // 検索結果の状態

  const debouncedSearchTerm = useDebounce(searchTerm, 300); // 検索実行を遅延させる（300ms）
  const searchCache = useRef<Record<string, CacheItem>>({}); // 検索結果をキャッシュするためのRef

  const search = useCallback(async (term: string) => {
    // 最小文字数未満の場合は検索しない
    if (term.length < MIN_SEARCH_LENGTH) {
      setSearchResults([]);
      return;
    }

    // キャッシュチェック
    const cached = searchCache.current[term];
    // 有効期限内のキャッシュがある場合はそれを使用
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      setSearchResults(cached.results);
      return;
    }

    // 検索開始
    setIsLoading(true);
    try {
      const results = await searchBrandsAPI(term);
      setSearchResults(results); // 検索結果を設定
      searchCache.current[term] = { results, timestamp: Date.now() }; // 検索結果をキャッシュに保存
    } catch (error) {
      console.error('Error searching brands:', error);
      setSearchResults([]); // エラー時は空配列を設定
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debouncedSearchTerm.length < MIN_SEARCH_LENGTH) {
      setSearchResults([]); // 最小文字数未満なら結果をリセット
      return;
    }

    search(debouncedSearchTerm);
  }, [debouncedSearchTerm, search]);

  return {
    searchTerm, // 現在の検索文字列
    setSearchTerm, // 検索文字列を更新する関数
    isLoading, // 検索中かどうか
    searchResults, // 検索結果
    search, // 検索を実行する関数
    debouncedSearchTerm, // デバウンスされた検索文字列
  };
};
