import type { NextConfig } from 'next';
import path from 'node:path';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // 사용자 홈에 다른 lockfile이 있어 Next.js가 workspace root를 잘못 추론하는 것 방지.
  outputFileTracingRoot: path.join(__dirname),
  // 빌드 트레이스에서 제외 — data/lwin-database.csv 19MB가 포함되면 build가 5~10×
  // 느려진다. workspace 산출물, .claude 정의, docs도 런타임에 필요 없음.
  outputFileTracingExcludes: {
    '*': [
      './data/**/*',
      './.claude/**/*',
      './_workspace/**/*',
      './docs/**/*',
      './node_modules/@swc/**',
      './node_modules/@esbuild/**',
    ],
  },
};

export default withNextIntl(nextConfig);
