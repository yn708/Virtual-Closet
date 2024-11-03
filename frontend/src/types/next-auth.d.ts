import 'next-auth';

declare module 'next-auth' {
  interface Session {
    backendTokens?: {
      access_token?: string;
      id_token?: string;
      key?: string;
    };
    user: {
      key?: string;
      isNewUser?: boolean;
    } & NextAuth.DefaultSession['user'];
  }

  interface User {
    isNewUser?: boolean;
    backendTokens?: {
      access_token?: string;
      id_token?: string;
      key?: string;
    };
  }

  interface Account {
    backendTokens?: {
      access_token?: string;
      id_token?: string;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    backendTokens?: {
      access_token?: string;
      id_token?: string;
    };
  }
}
