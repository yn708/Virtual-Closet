export { default } from 'next-auth/middleware';

export const config = {
  // ログインが必要なページのパスを指定
  matcher: ['/top', '/outfit/:path*', '/my-page/:path*'],
};
