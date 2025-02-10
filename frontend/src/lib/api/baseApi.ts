'use server';
import { BASE_URL, LOGIN_URL, TOKEN_REFRESH_ENDPOINT } from '@/utils/constants';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
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

  // 204 No Content の場合は空オブジェクトを返す
  if (response.status === 204) {
    return {};
  }

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

  // セッションが存在しない（未認証）の場合、ログイン画面にリダイレクト
  if (!session?.backendTokens) {
    redirect(LOGIN_URL + '?error=unauthorized');
  }

  // 認証トークンを含めて基本フェッチ関数を呼び出し
  return baseFetchAPI(endpoint, {
    ...options, // 渡されたオプションをスプレッド
    headers: {
      ...options.headers, // 既存のヘッダーを保持
      Authorization: `Bearer ${session.backendTokens?.access}`, // 認証トークンを追加
    },
  });
}

/* ----------------------------------------------------------------
トークンリフレッシュ関数
------------------------------------------------------------------ */
export async function refreshToken(refreshToken: string) {
  try {
    const response = await fetch(BASE_URL + TOKEN_REFRESH_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refresh: refreshToken,
      }),
    });

    if (!response.ok) {
      redirect(LOGIN_URL + '?error=session_expired');
    }

    return response.json();
  } catch (error) {
    if (error) {
      throw new Error('セッションの更新に失敗しました。再度ログインしてください。');
    }
  }
}
