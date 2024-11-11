import type { BackendTokens } from '@/types/next-auth';
import {
  BASE_URL,
  LOGIN_AFTER_VERIFICATION_ENDPOINT,
  LOGIN_EMAIL_ENDPOINT,
  LOGIN_ERROR_URL,
  LOGIN_GOOGLE_ENDPOINT,
  LOGIN_URL,
  TOKEN_REFRESH_ENDPOINT,
} from '@/utils/constants';
import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    // Google認証プロバイダーの設定
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    }),
    // メール/パスワード認証プロバイダーの設定
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
        token: { label: 'Token', type: 'text' },
      },
      async authorize(credentials) {
        if (credentials?.email && credentials?.password) {
          // Email通常ログイン用
          try {
            const res = await fetch(BASE_URL + LOGIN_EMAIL_ENDPOINT, {
              method: 'POST',
              body: JSON.stringify(credentials),
              headers: { 'Content-Type': 'application/json' },
            });
            const data = await res.json();

            if (res.ok && data) {
              // バックエンドからのレスポンスを適切な形式に変換
              return {
                id: data.user.id,
                email: data.user.email,
                name: data.user.username,
                isNewUser: data.is_new_user,
                backendTokens: data.tokens as BackendTokens,
              };
            }
          } catch (e) {
            console.error('Failed to authenticate:', e);
          }
        } else if (credentials?.email && credentials?.token) {
          // 認証コード認証後そのままログインする用
          try {
            // トークンを使用してユーザー情報を取得
            const res = await fetch(BASE_URL + LOGIN_AFTER_VERIFICATION_ENDPOINT, {
              headers: {
                Authorization: `Token ${credentials.token}`,
                'Content-Type': 'application/json',
              },
            });
            const data = await res.json();

            if (res.ok && data) {
              return {
                id: data.user.id,
                email: data.user.email,
                name: data.user.username,
                isNewUser: true,
                backendTokens: data.tokens as BackendTokens,
              };
            }
          } catch (e) {
            console.error('Failed to authenticate:', e);
          }
        } else {
          return null;
        }
        return null; // 認証失敗時はnullを返す
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days (リフレッシュトークンの有効期限に合わせる)
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: LOGIN_URL,
    signOut: LOGIN_URL,
    error: LOGIN_ERROR_URL,
  },
  // サインインプロセス中に呼び出されるコールバック
  callbacks: {
    async signIn({ account, user }) {
      if (account?.provider === 'google') {
        try {
          const response = await fetch(BASE_URL + LOGIN_GOOGLE_ENDPOINT, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              access_token: account.access_token,
              id_token: account.id_token,
              auth_provider: account.provider,
            }),
          });

          if (response.status === 200 || response.status === 201) {
            const data = await response.json();

            account.backendTokens = data.tokens;
            user.isNewUser = data.is_new_user;

            return true;
          } else if (response.status === 403) {
            // アカウントが無効な場合
            const errorData = await response.json();
            throw new Error(errorData.error || 'アカウントが有効化されていません。');
          }
        } catch (error) {
          console.error('Google login failed:', error);
          return false;
        }
      }
      if (account?.provider === 'credentials') {
        return true; // Email認証時に通過させるためにTrue
      }
      return false;
    },

    // JWTの作成・更新時に呼び出されるコールバック
    async jwt({ token, user, account, trigger, session }) {
      if (user) {
        token.isNewUser = user.isNewUser;
        if (user.backendTokens) {
          token.backendTokens = user.backendTokens;
        }
      }
      if (account?.access_token) {
        token.backendTokens = account.backendTokens;
      }

      // セッション更新時のisNewUser状態の反映
      if (trigger === 'update' && session?.user) {
        token.isNewUser = session.user.isNewUser;
      }

      // アクセストークンの有効期限をチェック
      if (token.backendTokens) {
        const accessTokenExpiresAt = new Date(token.backendTokens.expires_at);
        const now = new Date();

        // トークンの期限切れが近い（5分前）の場合、リフレッシュを試みる
        if (accessTokenExpiresAt.getTime() - now.getTime() < 29 * 60 * 1000) {
          try {
            const response = await fetch(BASE_URL + TOKEN_REFRESH_ENDPOINT, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                refresh: token.backendTokens.refresh,
              }),
            });

            const data = await response.json();

            if (response.ok) {
              token.backendTokens = data;
            }
          } catch (error) {
            console.error('Token refresh failed:', error);
            // リフレッシュに失敗した場合、セッションを無効化する可能性
            delete token.backendTokens;
          }
        }
      }

      return token;
    },

    // セッションの作成・更新時に呼び出されるコールバック
    async session({ session, token }) {
      if (token.backendTokens) {
        session.user.isNewUser = token.isNewUser;
        session.backendTokens = token.backendTokens;
      }
      return session;
    },
  },
};
