import type { Config } from 'jest';
import nextJest from 'next/jest';

const createJestConfig = nextJest({
  // next.config.jsとテスト環境用の.envファイルが配置されたディレクトリをセット。基本は"./"で良い。
  dir: './',
});

// Jestのカスタム設定を設置する場所。従来のプロパティはここで定義。
const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  // jest.setup.js テスト前に実行されるファイルのパス指定
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1', // ルートディレクトリのエイリアス設定
  },
  transform: {
    '^.+\\.(ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
  },
  transformIgnorePatterns: ['/node_modules/(?!(@tsparticles|tsparticles)/)'],
};

// createJestConfigを定義することによって、本ファイルで定義された設定がNext.jsの設定に反映される
export default createJestConfig(config);
