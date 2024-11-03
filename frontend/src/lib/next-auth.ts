import {
  BASE_URL,
  LOGIN_AFTER_VERIFICATION_ENDPOINT,
  LOGIN_EMAIL_ENDPOINT,
  LOGIN_ERROR_URL,
  LOGIN_GOOGLE_ENDPOINT,
  LOGIN_URL,
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
            const user = await res.json();
            if (res.ok && user) {
              // バックエンドからのレスポンスを適切な形式に変換
              return {
                id: user.user.id,
                email: user.user.email,
                name: user.user.username,
                isNewUser: user.is_new_user,
                backendTokens: user.access,
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
            const user = await res.json();
            if (res.ok && user) {
              return {
                id: user.id,
                email: user.email,
                name: user.username,
                isNewUser: true,
                backendTokens: credentials.token,
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
    maxAge: 24 * 60 * 60, // 24 hours
  },
  jwt: {
    maxAge: 24 * 60 * 60, // 24 hours
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

            account.backendTokens = data.access;
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
    async jwt({ token, user, account }) {
      if (user) {
        token.isNewUser = user.isNewUser;
        if (user.backendTokens) {
          token.backendTokens = user.backendTokens;
        }
      }
      if (account?.access_token) {
        token.backendTokens = account.backendTokens;
      }

      return token;
    },

    // セッションの作成・更新時に呼び出されるコールバック
    async session({ session, token }) {
      session.user.isNewUser = token.isNewUser;
      session.backendTokens = token.backendTokens;
      if (token.backendTokens?.access_token) {
        session.user.access = token.backendTokens.access_token;
      }

      return session;
    },
  },
};
