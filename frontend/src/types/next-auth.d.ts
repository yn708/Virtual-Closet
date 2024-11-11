import 'next-auth';
import type { JWT as DefaultJWT } from 'next-auth/jwt';

export interface BackendTokens {
  access: string;
  refresh: string;
  expires_at: string;
  refresh_expires_at: string;
}

declare module 'next-auth' {
  interface Session {
    backendTokens?: BackendTokens;
    user: {
      isNewUser?: boolean;
    } & DefaultSession['user'];
  }

  interface User {
    isNewUser?: boolean;
    backendTokens?: BackendTokens;
  }
  interface Account {
    backendTokens?: BackendTokens;
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    backendTokens?: BackendTokens;
    isNewUser?: boolean;
  }
}
