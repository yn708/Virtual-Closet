/** @type {import('next').NextConfig} */
import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig = {
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    formats: ['image/webp'],
    domains:
      process.env.NODE_ENV === 'production'
        ? ['bucket-name.s3.amazonaws.com'] // 本番環境での画像ドメイン（仮）
        : ['localhost'], // 開発環境での画像ドメイン
    unoptimized: process.env.NODE_ENV === 'development', // 開発環境では画像最適化をスキップ
  },
  output: 'standalone',
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
};

export default withBundleAnalyzer(nextConfig);
