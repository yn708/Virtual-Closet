/**
 * カスタムフック: 指定された遅延時間後に値を更新する
 * @param value デバウンスする値
 * @param delay 遅延時間（ミリ秒）
 * @returns デバウンスされた値
 */
import { useEffect, useState } from 'react';

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value); // デバウンスされた値の状態を管理

  useEffect(() => {
    // 指定された遅延時間後に値を更新するタイマーを設定
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // クリーンアップ関数: コンポーネントのアンマウント時やdependenciesの変更時にタイマーをクリア
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // value または delay が変更されたときにエフェクトを再実行

  return debouncedValue;
}

export default useDebounce;
