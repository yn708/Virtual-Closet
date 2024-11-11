/** @type {import('next').NextConfig} */
// 環境による設定の分岐例
const nextConfig = {
  images: {
    domains:
      process.env.NODE_ENV === 'production'
        ? ['bucket-name.s3.amazonaws.com'] // 本番環境（後々本物に設定）
        : ['localhost'], // 開発環境
    unoptimized: process.env.NODE_ENV === 'development',
  },
};

export default nextConfig;
