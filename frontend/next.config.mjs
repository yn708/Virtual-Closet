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
    remotePatterns:
      process.env.NODE_ENV === 'production'
        ? [
            {
              protocol: 'https',
              hostname: 'd2omfeuzdtuar5.cloudfront.net',
            },
          ]
        : [
            {
              protocol: 'http',
              hostname: 'localhost',
            },
            {
              protocol: 'http',
              hostname: '127.0.0.1',
            },
            {
              protocol: 'http',
              hostname: 'backend',
            },
            // {
            //   protocol: 'https',
            //   hostname: 'd2omfeuzdtuar5.cloudfront.net',
            // },
          ],
  },
  output: 'standalone',
  reactStrictMode: true,
};

export default withBundleAnalyzer(nextConfig);
