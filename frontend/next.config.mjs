/** @type {import('next').NextConfig} */
const nextConfig = {
  // 画像ドメインとの最適化設定
  images: {
    domains:
      process.env.NODE_ENV === 'production'
        ? ['bucket-name.s3.amazonaws.com'] // 本番環境での画像ドメイン（仮）
        : ['localhost'], // 開発環境での画像ドメイン
    unoptimized: process.env.NODE_ENV === 'development', // 開発環境では画像最適化をスキップ
  },

  //   // Webpackの開発環境設定
  //   webpack: (config, { dev }) => {
  //     if (dev) {
  //       // ファイル監視の設定
  //       config.watchOptions = {
  //         poll: 1000, // ファイル変更をチェックする間隔(ms)
  //         aggregateTimeout: 300, // 変更検出後、実際にビルドを開始するまでの待機時間(ms)
  //         ignored: ['**/node_modules', '**/.git'], // 監視対象から除外するパス
  //       };

  //       // コード分割と最適化の設定
  //       config.optimization = {
  //         ...config.optimization,
  //         splitChunks: {
  //           chunks: 'all', // すべてのチャンクを対象に分割
  //           cacheGroups: {
  //             default: false, // デフォルトのキャッシュグループを無効化
  //             vendors: false, // ベンダーのデフォルトキャッシュグループを無効化
  //             commons: {
  //               name: 'commons', // 共通モジュールのチャンク名
  //               chunks: 'all', // すべてのチャンクを対象
  //               minChunks: 2, // 最低2回以上使用されるモジュールを分割
  //               reuseExistingChunk: true, // 既存のチャンクを再利用
  //             },
  //             vendor: {
  //               test: /[\\/]node_modules[\\/]/, // node_modulesのモジュールを対象
  //               name: 'vendor', // ベンダーチャンクの名前
  //               chunks: 'all', // すべてのチャンクを対象
  //             },
  //           },
  //         },
  //         removeAvailableModules: false, // 利用可能なモジュールの削除を無効化（ビルド速度改善）
  //         removeEmptyChunks: false, // 空のチャンクの削除を無効化（ビルド速度改善）
  //       };
  //     }
  //     return config;
  //   },

  //   // 開発サーバーのホットリロード設定
  //   webpackDevMiddleware: (config) => {
  //     config.watchOptions = {
  //       poll: 1000, // ファイル変更をチェックする間隔(ms)
  //       aggregateTimeout: 300, // 変更検出後の待機時間(ms)
  //     };
  //     return config;
  //   },

  //   // 実験的機能の設定
  //   experimental: {
  //     optimizeCss: true, // CSSの最適化を有効化
  //     scrollRestoration: true, // ページ遷移時のスクロール位置復元を有効化
  //   },

  //   poweredByHeader: false, // X-Powered-Byヘッダーを無効化（セキュリティ対策）
  //   reactStrictMode: true, // Reactの厳格モードを有効化（開発時の問題検出）
  //   swcMinify: true, // SWCによるコードの最小化を有効化（高速なビルド）
};

export default nextConfig;
