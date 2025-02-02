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
        ? ['d2omfeuzdtuar5.cloudfront.net']
        : ['localhost', '127.0.0.1'], // 開発環境では両方必要
    unoptimized: process.env.NODE_ENV === 'development', // 開発環境では画像最適化をスキップ
  },
  output: 'standalone',
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
};

export default withBundleAnalyzer(nextConfig);
