'use server';
import { BASE_URL } from '@/utils/constants';
import { getServerSession } from 'next-auth';
import { authOptions } from '../next-auth';

/* ----------------------------------------------------------------
共通のフェッチ関数
------------------------------------------------------------------ */
export async function baseFetchAPI(endpoint: string, options: RequestInit = {}) {
  const url = `${BASE_URL}${endpoint}`; // BASE_URLとエンドポイントを組み合わせて完全なURLを作成

  // fetchリクエストを実行
  const response = await fetch(url, {
    ...options, // 渡されたオプションをスプレッド
    headers: {
      ...options.headers, // 追加のヘッダーがあれば上書き
    },
  });

  // レスポンスが成功でない場合、エラーをスロー
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(JSON.stringify(errorData));
  }

  // 成功した場合、JSONレスポンスを返す
  return response.json();
}

/* ----------------------------------------------------------------
認証付きのフェッチ関数
------------------------------------------------------------------ */
export async function baseFetchAuthAPI(endpoint: string, options: RequestInit = {}) {
  // サーバーサイドセッションを取得
  const session = await getServerSession(authOptions);

  // セッションが存在しない（未認証）の場合、エラーをスロー
  if (!session) {
    throw new Error('認証されていません');
  }

  // 認証トークンを含めて基本フェッチ関数を呼び出し
  return baseFetchAPI(endpoint, {
    ...options, // 渡されたオプションをスプレッド
    headers: {
      ...options.headers, // 既存のヘッダーを保持
      Authorization: `Token ${session.backendTokens}`, // 認証トークンを追加
    },
  });
}
