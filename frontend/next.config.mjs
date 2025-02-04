/** @type {import('next').NextConfig} */
import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig = {
  images: {
    deviceSizes: [320, 480, 640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp'],
    domains:
      process.env.NODE_ENV === 'production'
        ? ['d2omfeuzdtuar5.cloudfront.net']
        : ['localhost', '127.0.0.1'], // 開発環境では両方必要
  },
  output: 'standalone',
  reactStrictMode: true,
};

export default withBundleAnalyzer(nextConfig);
